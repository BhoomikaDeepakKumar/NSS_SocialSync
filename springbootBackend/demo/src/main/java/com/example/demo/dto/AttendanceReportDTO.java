package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AttendanceReportDTO {
    private String studentName;
    private String eventTitle;
    private String date;
    private String status;
}
