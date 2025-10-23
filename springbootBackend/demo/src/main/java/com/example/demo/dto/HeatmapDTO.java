package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class HeatmapDTO {
    private String date; // Format: "YYYY-MM-DD"
    private int attendeeCount;
}
