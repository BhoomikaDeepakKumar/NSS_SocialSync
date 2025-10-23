package com.example.demo.Repository;

import com.example.demo.Model.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

import jakarta.transaction.Transactional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
      boolean existsByStudentIdAndEventId(String studentId, Long eventId);

    int countByEventId(Long eventId);

    @Query("SELECT COUNT(DISTINCT a.studentId) FROM Attendance a")
    long countDistinctStudentId();

    @Transactional
    @Modifying
    @Query("DELETE FROM Attendance a WHERE a.id IN (:ids)")
    void deleteByIdIn(@Param("ids") List<Long> ids);

    // ✅ 1. Top 10 most active students (for leaderboard)
@Query(value = "SELECT student_id, student_name, COUNT(*) as total FROM attendance GROUP BY student_id, student_name ORDER BY total DESC", nativeQuery = true)
List<Object[]> findTopStudents();



    // ✅ 2. Student attendance in date range (for pie chart)

    @Query("SELECT a FROM Attendance a JOIN Event e ON a.eventId = e.id WHERE a.studentId = :studentId AND e.date BETWEEN :start AND :end")
    List<Attendance> findByStudentIdAndDateRange(
        @Param("studentId") String studentId,
        @Param("start") LocalDate start,
        @Param("end") LocalDate end
    );
@Query("SELECT COUNT(a) FROM Attendance a JOIN Event e ON a.eventId = e.id WHERE a.studentId = :studentId AND e.date BETWEEN :start AND :end")
int countAttendancesByStudentAndEventDateRange(
    @Param("studentId") String studentId,
    @Param("start") LocalDate start,
    @Param("end") LocalDate end
);


    // ✅ 3. Monthly summary (event name vs attendee count)
    @Query("SELECT e.name, COUNT(a) FROM Attendance a JOIN Event e ON a.eventId = e.id WHERE FUNCTION('MONTH', e.date) = :month AND FUNCTION('YEAR', e.date) = :year GROUP BY e.name")
    List<Object[]> getMonthlySummary(@Param("month") int month, @Param("year") int year);

    // ✅ 4. Daily attendance for heatmap
    @Query("SELECT e.date, COUNT(a) FROM Attendance a JOIN Event e ON a.eventId = e.id WHERE FUNCTION('MONTH', e.date) = :month AND FUNCTION('YEAR', e.date) = :year GROUP BY e.date")
    List<Object[]> getDailyAttendanceCounts(@Param("month") int month, @Param("year") int year);


}
