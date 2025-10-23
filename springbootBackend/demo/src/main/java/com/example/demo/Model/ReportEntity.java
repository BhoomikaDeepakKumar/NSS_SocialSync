package com.example.demo.Model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
public class ReportEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String eventName;

    private String fileName;

    private LocalDateTime uploadTime;

    // ✅ Constructors
    public ReportEntity() {}

    public ReportEntity(String eventName, String fileName, LocalDateTime uploadTime) {
        this.eventName = eventName;
        this.fileName = fileName;
        this.uploadTime = uploadTime;
    }

    // ✅ Getters & Setters
    public Long getId() {
        return id;
    }

    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public LocalDateTime getUploadTime() {
        return uploadTime;
    }

    public void setUploadTime(LocalDateTime uploadTime) {
        this.uploadTime = uploadTime;
    }
}
