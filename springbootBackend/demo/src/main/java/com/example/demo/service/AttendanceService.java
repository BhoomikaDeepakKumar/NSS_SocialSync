package com.example.demo.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.AttendanceResponse;
import com.example.demo.Model.Attendance;
import com.example.demo.Model.Event;
import com.example.demo.Repository.AttendanceRepository;
import com.example.demo.Repository.EventRepository;
import com.example.demo.service.AttendanceService;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

@Service
public class AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepo;

    @Autowired
    private EventRepository eventRepo;

   public Page<AttendanceResponse> getPagedAttendance(Long eventId, String date, String search, int page, int size) {
    List<Attendance> records = attendanceRepo.findAll();

    List<AttendanceResponse> filtered = records.stream()
        .filter(record -> {
            boolean matchesEvent = (eventId == null || record.getEventId().equals(eventId));
            boolean matchesSearch = (search == null || search.isEmpty() ||
                record.getStudentName().toLowerCase().contains(search.toLowerCase()) ||
                record.getStudentId().toLowerCase().contains(search.toLowerCase()));
            Event event = eventRepo.findById(record.getEventId()).orElse(null);
            boolean matchesDate = (date == null || event == null || date.equals(event.getDate().toString()));
            return matchesEvent && matchesDate && matchesSearch;
        })
        .map(record -> {
            Event event = eventRepo.findById(record.getEventId()).orElse(null);
            String eventName = (event != null) ? event.getName() : "Unknown";
            String eventDate = (event != null) ? event.getDate().toString() : "N/A";

            return new AttendanceResponse(
                record.getId(),
                record.getStudentId(),
                record.getStudentName(),
                record.getEventId(),
                eventName,
                eventDate
            );
        })
        .collect(Collectors.toList());

    // Calculate start and end index for pagination
    int start = Math.min(page * size, filtered.size());
    int end = Math.min(start + size, filtered.size());

    List<AttendanceResponse> pagedList = filtered.subList(start, end);

    return new PageImpl<>(pagedList, PageRequest.of(page, size), filtered.size());
}

public void deleteAttendanceByIds(List<Long> ids) {
        attendanceRepo.deleteByIdIn(ids);
    }
}

