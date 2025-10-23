package com.example.demo.Controller;

import com.example.demo.Model.ReportEntity;
import com.example.demo.Repository.ReportRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final Path root = Paths.get("uploads/reports");
    private final ReportRepository reportRepository;

    public ReportController(ReportRepository reportRepository) throws IOException {
        this.reportRepository = reportRepository;
        if (!Files.exists(root)) {
            Files.createDirectories(root);
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<ReportEntity> uploadReport(
            @RequestParam("eventName") String eventName,
            @RequestParam("file") MultipartFile file) {

        try {
            // ✅ Validate file type
            if (!file.getOriginalFilename().endsWith(".doc") &&
                !file.getOriginalFilename().endsWith(".docx")) {
                return ResponseEntity.badRequest().build();
            }

            // ✅ Save file
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Files.copy(file.getInputStream(), root.resolve(fileName),
                    StandardCopyOption.REPLACE_EXISTING);

            // ✅ Save to DB
            ReportEntity report = new ReportEntity(eventName, fileName, LocalDateTime.now());
            ReportEntity saved = reportRepository.save(report);

            // ✅ Return saved entity (includes DB id, eventName, fileName, uploadTime)
            return ResponseEntity.ok(saved);

        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    // ✅ Optional: fetch all reports (for frontend table on page load)
    @GetMapping("/all")
    public ResponseEntity<?> getAllReports() {
        return ResponseEntity.ok(reportRepository.findAll());
    }
}
