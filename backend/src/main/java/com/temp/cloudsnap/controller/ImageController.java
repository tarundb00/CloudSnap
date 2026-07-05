package com.temp.cloudsnap.controller;

import com.temp.cloudsnap.dto.ImageResponse;
import com.temp.cloudsnap.service.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
public class ImageController {

    private final ImageService imageService;

    @PostMapping(value = "/upload", consumes = "multipart/form-data")
    public ResponseEntity<ImageResponse> upload(
            Authentication authentication,
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("password") String password,
            @RequestParam("expiryMinutes") long expiryMinutes) throws IOException {

        String username = authentication.getName();
        return ResponseEntity.ok(imageService.uploadImage(username, file, title, description, password, expiryMinutes));
    }

    @GetMapping
    public ResponseEntity<List<ImageResponse>> list(Authentication authentication) {
        return ResponseEntity.ok(imageService.listUserImages(authentication.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(Authentication authentication, @PathVariable String id) {
        imageService.deleteImage(authentication.getName(), id);
        return ResponseEntity.noContent().build();
    }
}
