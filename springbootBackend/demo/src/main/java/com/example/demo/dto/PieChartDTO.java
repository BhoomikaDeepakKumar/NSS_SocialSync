package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PieChartDTO {
    private String studentId;
    private String studentName;
    private int presentCount;
    private int absentCount;
}
