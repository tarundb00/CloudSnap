package com.temp.cloudsnap.controller;

import com.temp.cloudsnap.dto.SharedImageResponse;
import com.temp.cloudsnap.service.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/share")
@RequiredArgsConstructor
public class ShareController {

    private final ImageService imageService;

    @GetMapping("/{shareId}")
    public ResponseEntity<SharedImageResponse> getSharedImage(@PathVariable String shareId) {
        return ResponseEntity.ok(imageService.getSharedImageMetadata(shareId));
    }

    @PostMapping("/{shareId}/unlock")
    public ResponseEntity<SharedImageResponse> unlockSharedImage(
            @PathVariable String shareId,
            @RequestParam("password") String password) {
        return ResponseEntity.ok(imageService.unlockSharedImage(shareId, password));
    }
}
