package com.temp.cloudsnap.service;

import com.temp.cloudsnap.model.ImageFile;
import com.temp.cloudsnap.repository.ImageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class ImageCleanupScheduler {

    private final ImageRepository imageRepository;
    private final S3Service s3Service;

    // Runs every 60 seconds and purges any image whose expiry time has passed,
    // even if nobody ever clicked the share link.
    @Scheduled(fixedRate = 60000)
    public void purgeExpiredImages() {
        List<ImageFile> expired = imageRepository.findByExpiryTimeBefore(Instant.now());

        if (expired.isEmpty()) {
            return;
        }

        for (ImageFile image : expired) {
            try {
                s3Service.deleteFile(image.getS3Key());
            } catch (Exception e) {
                log.warn("Failed to delete S3 object {} during cleanup: {}", image.getS3Key(), e.getMessage());
            }
        }

        imageRepository.deleteAll(expired);
        log.info("Cleaned up {} expired image(s)", expired.size());
    }
}
