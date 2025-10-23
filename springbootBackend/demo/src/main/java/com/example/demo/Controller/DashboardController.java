package com.example.demo.Controller;

import java.time.LocalDate;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Repository.AttendanceRepository;
import com.example.demo.Repository.EventRepository;
import java.util.Map;
import com.example.demo.Model.Event;


    
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private AttendanceRepository attendanceRepo;

    @Autowired
    private EventRepository eventRepo;

    @GetMapping("/stats")
public ResponseEntity<Map<String, Object>> getDashboardStats() {
    Map<String, Object> stats = new HashMap<>();

    // Only get the latest past event
    Event lastEvent = eventRepo.findTopByDateBeforeOrderByDateDesc(LocalDate.now());
    int lastEventAttendance = 0;
    if (lastEvent != null) {
        lastEventAttendance = attendanceRepo.countByEventId(lastEvent.getId());
    }

    // Only count past events for averaging
    long totalPastEvents = eventRepo.countByDateBefore(LocalDate.now());
    long totalAttendance = attendanceRepo.count();
    int averageAttendance = (totalPastEvents == 0) ? 0 : (int)(totalAttendance / totalPastEvents);

    stats.put("lastEventAttendance", lastEventAttendance);
    stats.put("averageAttendance", averageAttendance);

    return ResponseEntity.ok(stats);
}

}

