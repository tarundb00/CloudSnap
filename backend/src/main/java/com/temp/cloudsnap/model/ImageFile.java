package com.temp.cloudsnap.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "images")
public class ImageFile {

    @Id
    private String id;

    private String owner; // username of uploader

    private String s3Key;

    private String originalFilename;

    private String contentType;

    private long size;

    @Indexed(unique = true)
    private String shareId; // public UUID used in share link

    private String title;
    private String description;
    private String passwordHash;

    private Instant uploadTime;

    private Instant expiryTime;
}
