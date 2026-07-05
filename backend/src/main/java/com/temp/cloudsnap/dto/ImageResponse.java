package com.temp.cloudsnap.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.Instant;

@Data
@AllArgsConstructor
public class ImageResponse {
    private String id;
    private String originalFilename;
    private String title;
    private String description;
    private String shareId;
    private String shareUrl;
    private Instant uploadTime;
    private Instant expiryTime;
    private boolean expired;
}
