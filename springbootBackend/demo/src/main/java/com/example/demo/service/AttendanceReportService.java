package com.example.demo.service;

import com.example.demo.Model.Attendance;
import com.example.demo.Model.Event;
import com.example.demo.Repository.AttendanceRepository;
import com.example.demo.Repository.EventRepository;
import com.example.demo.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
public class AttendanceReportService {

    private final AttendanceRepository attendanceRepo;
    private final EventRepository eventRepo;

    // ✅ 1. For table of all attendance entries
    public List<AttendanceReportDTO> getAllReports() {
        List<Attendance> attendanceList = attendanceRepo.findAll();

        return attendanceList.stream().map(att -> {
            Event event = eventRepo.findById(att.getEventId()).orElse(null);
            String eventTitle = (event != null) ? event.getTitle() : "Unknown Event";
            String eventDate = (event != null && event.getDate() != null)
                    ? event.getDate().toString()
                    : "Unknown Date";

            return new AttendanceReportDTO(
                    att.getStudentName(),
                    eventTitle,
                    eventDate,
                    "Present" // You can customize if a status column exists
            );
        }).collect(Collectors.toList());
    }

    // ✅ 2. Leaderboard - Top 10
public List<LeaderboardDTO> getTopStudents() {
    List<Object[]> top = attendanceRepo.findTopStudents();

    return top.stream()
            .map(row -> {
                String studentId = (String) row[0];
                String studentName = (String) row[1];
                Long count = ((Number) row[2]).longValue(); // Safely cast count
                return new LeaderboardDTO(studentId, studentName, count);
            })
            .collect(Collectors.toList());
}




    // ✅ 3. Student-specific summary (Pie chart)

    
public PieChartDTO getStudentAttendanceSummary(String studentId, String start, String end) {
    LocalDate startDate = LocalDate.parse(start);
    LocalDate endDate = LocalDate.parse(end);

   int totalEvents = eventRepo.countEventsBetween(startDate, endDate);

    int presentCount = attendanceRepo.countAttendancesByStudentAndEventDateRange(studentId, startDate, endDate);
    int absentCount = totalEvents - presentCount;

    // Get student name (fallback to "Unknown")
    String studentName = "Unknown";
    List<Attendance> records = attendanceRepo.findByStudentIdAndDateRange(studentId, startDate, endDate);
    if (!records.isEmpty()) {
        studentName = records.get(0).getStudentName();
    }

    return new PieChartDTO(studentId, studentName, presentCount, absentCount);
}

//Addition
    public List<StudentDTO> getAllStudents() {
    List<Attendance> attendanceList = attendanceRepo.findAll();

    // Use a Map to ensure uniqueness by studentId
    Map<String, String> uniqueStudents = new LinkedHashMap<>();
    for (Attendance att : attendanceList) {
        uniqueStudents.put(att.getStudentId(), att.getStudentName());
    }

    return uniqueStudents.entrySet().stream()
            .map(entry -> new StudentDTO(entry.getKey(), entry.getValue()))
            .collect(Collectors.toList());
}

    // ✅ 4. Monthly event attendance (Line chart)
    public List<LineChartDTO> getMonthlyEventAttendance(String month) {
        LocalDate parsed = LocalDate.parse(month + "-01");
        int m = parsed.getMonthValue();
        int y = parsed.getYear();

        List<Object[]> rows = attendanceRepo.getMonthlySummary(m, y);

        return rows.stream().map(row -> new LineChartDTO(
                (String) row[0],
                ((Long) row[1]).intValue()
        )).collect(Collectors.toList());
    }

    // ✅ 5. Heatmap (day vs count)
    public List<HeatmapDTO> getDailyAttendanceCounts(String month) {
        LocalDate parsed = LocalDate.parse(month + "-01");
        int m = parsed.getMonthValue();
        int y = parsed.getYear();

        List<Object[]> rows = attendanceRepo.getDailyAttendanceCounts(m, y);

        return rows.stream().map(row -> new HeatmapDTO(
                row[0].toString(),                // LocalDate -> String
                ((Long) row[1]).intValue()
        )).collect(Collectors.toList());
    }
}
