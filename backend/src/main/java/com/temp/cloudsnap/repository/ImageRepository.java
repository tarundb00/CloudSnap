package com.temp.cloudsnap.repository;

import com.temp.cloudsnap.model.ImageFile;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface ImageRepository extends MongoRepository<ImageFile, String> {
    List<ImageFile> findByOwnerOrderByUploadTimeDesc(String owner);
    long countByOwner(String owner);
    Optional<ImageFile> findByShareId(String shareId);
    List<ImageFile> findByExpiryTimeBefore(Instant instant);
}
