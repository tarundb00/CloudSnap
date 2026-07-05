package com.temp.cloudsnap;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class CloudsnapApplication {
    public static void main(String[] args) {
        SpringApplication.run(CloudsnapApplication.class, args);
    }
}
