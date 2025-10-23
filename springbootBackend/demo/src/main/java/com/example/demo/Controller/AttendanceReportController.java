package com.example.demo.Controller;

import com.example.demo.dto.AttendanceReportDTO;
import com.example.demo.dto.LeaderboardDTO;
import com.example.demo.dto.LineChartDTO;
import com.example.demo.service.AttendanceReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.example.demo.dto.PieChartDTO;
import com.example.demo.dto.StudentDTO;
import com.example.demo.dto.HeatmapDTO;


@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AttendanceReportController {

    private final AttendanceReportService reportService;

    // 1. Default Reports Endpoint (optional)
    @GetMapping
    public List<AttendanceReportDTO> getReports() {
        return reportService.getAllReports();
    }

    // 2. Top 10 leaderboard
    @GetMapping("/leaderboard")
    public List<LeaderboardDTO> getTopStudents() {
        return reportService.getTopStudents();
    }

    // 3. Student attendance pie chart (July 1 to June 30)
   @GetMapping("/student/{studentId}")
public PieChartDTO getStudentAttendanceSummary(
        @PathVariable String studentId,
        @RequestParam String start,
        @RequestParam String end
) {
    return reportService.getStudentAttendanceSummary(studentId, start, end);
}

    // 4. Monthly event attendance line chart
    @GetMapping("/monthly-summary")
    public List<LineChartDTO> getMonthlySummary(@RequestParam String month) {
        return reportService.getMonthlyEventAttendance(month);
    }

    // 5. Daily heatmap data
   @GetMapping("/daily")
public List<HeatmapDTO> getDailyAttendanceCounts(@RequestParam String month) {
    return reportService.getDailyAttendanceCounts(month);
}

@GetMapping("/students")
public List<StudentDTO> getAllStudents() {
    return reportService.getAllStudents();
}

}

