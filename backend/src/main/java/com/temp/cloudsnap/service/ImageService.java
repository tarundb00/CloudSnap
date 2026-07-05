package com.temp.cloudsnap.service;

import com.temp.cloudsnap.dto.ImageResponse;
import com.temp.cloudsnap.dto.SharedImageResponse;
import com.temp.cloudsnap.exception.ImageLimitExceededException;
import com.temp.cloudsnap.exception.InvalidPasswordException;
import com.temp.cloudsnap.exception.LinkExpiredException;
import com.temp.cloudsnap.exception.ResourceNotFoundException;
import com.temp.cloudsnap.model.ImageFile;
import com.temp.cloudsnap.repository.ImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ImageService {

    private final ImageRepository imageRepository;
    private final S3Service s3Service;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.max-images-per-user}")
    private int maxImagesPerUser;

    @Value("${app.frontend.base-url:http://localhost:5173}")
    private String frontendBaseUrl;

    public ImageResponse uploadImage(String owner, MultipartFile file, String title, String description,
            String password, long expiryMinutes) throws IOException {
        long currentCount = imageRepository.countByOwner(owner);
        if (currentCount >= maxImagesPerUser) {
            throw new ImageLimitExceededException(
                    "Upload limit reached. You can store up to " + maxImagesPerUser +
                            " images at a time. Delete an existing image to free up space.");
        }

        String key = owner + "/" + UUID.randomUUID() + "_" + sanitize(file.getOriginalFilename());
        s3Service.uploadFile(key, file);

        ImageFile image = new ImageFile();
        image.setOwner(owner);
        image.setS3Key(key);
        image.setOriginalFilename(file.getOriginalFilename());
        image.setTitle(title);
        image.setDescription(description);
        image.setPasswordHash(passwordEncoder.encode(password));
        image.setContentType(file.getContentType());
        image.setSize(file.getSize());
        image.setShareId(UUID.randomUUID().toString());
        image.setUploadTime(Instant.now());
        image.setExpiryTime(Instant.now().plus(Duration.ofMinutes(expiryMinutes)));

        imageRepository.save(image);
        return toResponse(image);
    }

    public List<ImageResponse> listUserImages(String owner) {
        return imageRepository.findByOwnerOrderByUploadTimeDesc(owner)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public void deleteImage(String owner, String imageId) {
        ImageFile image = imageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("Image not found"));

        if (!image.getOwner().equals(owner)) {
            throw new ResourceNotFoundException("Image not found");
        }

        s3Service.deleteFile(image.getS3Key());
        imageRepository.delete(image);
    }

    public SharedImageResponse getSharedImageMetadata(String shareId) {
        ImageFile image = findValidImageByShareId(shareId);
        return new SharedImageResponse(
                image.getOriginalFilename(),
                image.getTitle(),
                image.getDescription(),
                image.getContentType(),
                null,
                image.getExpiryTime(),
                true);
    }

    public SharedImageResponse unlockSharedImage(String shareId, String password) {
        ImageFile image = findValidImageByShareId(shareId);
        if (password == null || !passwordEncoder.matches(password, image.getPasswordHash())) {
            throw new InvalidPasswordException("Please enter the correct password for opening the image.");
        }

        String presignedUrl = s3Service.generatePresignedGetUrl(image.getS3Key(), Duration.ofMinutes(5));
        return new SharedImageResponse(
                image.getOriginalFilename(),
                image.getTitle(),
                image.getDescription(),
                image.getContentType(),
                presignedUrl,
                image.getExpiryTime(),
                false);
    }

    private ImageFile findValidImageByShareId(String shareId) {
        ImageFile image = imageRepository.findByShareId(shareId)
                .orElseThrow(() -> new ResourceNotFoundException("Link not found"));

        if (Instant.now().isAfter(image.getExpiryTime())) {
            s3Service.deleteFile(image.getS3Key());
            imageRepository.delete(image);
            throw new LinkExpiredException("This link has timed out and the image has been deleted.");
        }

        return image;
    }

    private ImageResponse toResponse(ImageFile image) {
        boolean expired = Instant.now().isAfter(image.getExpiryTime());
        String shareUrl = frontendBaseUrl + "/share/" + image.getShareId();
        return new ImageResponse(
                image.getId(),
                image.getOriginalFilename(),
                image.getTitle(),
                image.getDescription(),
                image.getShareId(),
                shareUrl,
                image.getUploadTime(),
                image.getExpiryTime(),
                expired);
    }

    private String sanitize(String filename) {
        if (filename == null)
            return "file";
        return filename.replaceAll("[^a-zA-Z0-9._-]", "_");
    }
}
