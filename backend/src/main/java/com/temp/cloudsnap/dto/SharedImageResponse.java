package com.temp.cloudsnap.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.Instant;

@Data
@AllArgsConstructor
public class SharedImageResponse {
    private String originalFilename;
    private String title;
    private String description;
    private String contentType;
    private String url;
    private Instant expiryTime;
    private boolean requiresPassword;
}
