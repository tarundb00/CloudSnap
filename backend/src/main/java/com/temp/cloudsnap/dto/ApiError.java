package com.temp.cloudsnap.dto;

import lombok.Data;

import java.time.Instant;

@Data
public class ApiError {
    private int status;
    private String message;
    private Instant timestamp = Instant.now();

    public ApiError(int status, String message) {
        this.status = status;
        this.message = message;
    }
}
