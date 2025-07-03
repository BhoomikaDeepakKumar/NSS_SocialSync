package com.example.demo.Controller;

import com.example.demo.Model.Attendance;
import com.example.demo.Model.Event;
import com.example.demo.Repository.AttendanceRepository;
import com.example.demo.Repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;
import java.util.List;

import java.util.Optional;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "*")
public class AttendanceController {

    @Autowired
    private AttendanceRepository attendanceRepo;

    @Autowired
    private EventRepository eventRepo;

    // ✅ Add this to call the service
    @Autowired
    private com.example.demo.service.AttendanceService attendanceService;

    // ✅ Save attendance
    @PostMapping("/mark")
public ResponseEntity<String> markAttendance(@RequestBody Attendance attendance) {
    boolean alreadyMarked = attendanceRepo.existsByStudentIdAndEventId(attendance.getStudentId(), attendance.getEventId());

    if (alreadyMarked) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body("Attendance already marked for this event.");
    }

    attendanceRepo.save(attendance);
    return ResponseEntity.ok("Attendance marked successfully.");
}


   @PostMapping("/upload")
public String uploadBulkAttendance(@RequestBody List<Attendance> attendanceList) {
    int savedCount = 0;
    for (Attendance att : attendanceList) {
        if (!attendanceRepo.existsByStudentIdAndEventId(att.getStudentId(), att.getEventId())) {
            attendanceRepo.save(att);
            savedCount++;
        }
    }
    return "Uploaded " + savedCount + " new records successfully.";
}


    // ✅ Redirect when scanning QR
    @GetMapping("/scan")
    public RedirectView handleQRScan(@RequestParam Long eventId) {
        return new RedirectView("/mark-attendance?eventId=" + eventId);
    }

    // ✅ Optional: View attendance records
    @GetMapping("/all")
    public List<Attendance> getAllAttendance() {
        return attendanceRepo.findAll();
    }

   @PostMapping("/delete")
public String deleteMultipleAttendance(@RequestBody List<Long> ids) {
    attendanceService.deleteAttendanceByIds(ids);
    return "Deleted successfully";
}

}
