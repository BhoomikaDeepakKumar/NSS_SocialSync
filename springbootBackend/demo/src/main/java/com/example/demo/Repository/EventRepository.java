package com.example.demo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.Model.Event;
import java.time.LocalDate;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {

     List<Event> findByDateAfterOrderByDateAsc(LocalDate date);
     List<Event> findByDateBeforeOrderByDateDesc(LocalDate date); 
      Event findTopByOrderByStartDesc(); // fetch latest event
      List<Event> findByDateGreaterThanEqualOrderByDateAsc(LocalDate date);
      List<Event> findByDate(LocalDate date);

  int countByDateBetween(LocalDate start, LocalDate end);

@Query("SELECT COUNT(e) FROM Event e WHERE e.date BETWEEN :start AND :end")
int countEventsBetween(@Param("start") LocalDate start, @Param("end") LocalDate end);

Event findTopByDateBeforeOrderByDateDesc(LocalDate now);
long countByDateBefore(LocalDate now);


}