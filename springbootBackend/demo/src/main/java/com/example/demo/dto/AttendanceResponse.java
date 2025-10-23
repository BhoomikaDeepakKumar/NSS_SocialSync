package com.example.demo.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AttendanceResponse {
    private Long id;
    private String studentId;
    private String studentName;
    private Long eventId;
    private String eventName;
    private String date;
}
