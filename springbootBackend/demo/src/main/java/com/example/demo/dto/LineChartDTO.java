package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LineChartDTO {
    private String eventName;
    private int attendeeCount;
}
