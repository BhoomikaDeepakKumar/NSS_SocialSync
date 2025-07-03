package com.example.demo.Controller;

import com.example.demo.dto.AttendanceResponse;
import com.example.demo.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;

@RestController
@RequestMapping("/api/attendance/records")
@CrossOrigin(origins = "*")
public class AttendanceRecordController {

    @Autowired
    private AttendanceService attendanceService;

    @GetMapping
    public Page<AttendanceResponse> getAttendanceRecords(
            @RequestParam(required = false) Long eventId,
            @RequestParam(required = false) String date,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return attendanceService.getPagedAttendance(eventId, date, search, page, size);
    }
}