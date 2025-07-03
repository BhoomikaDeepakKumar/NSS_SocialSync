package com.example.demo.Model;

import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "events")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Event {
      @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String title;        // For FullCalendar
    private String start;        // Start datetime (ISO format)
    private String end;          // End datetime (ISO format)

    private String name;         // Original event name
     
    private String time;
    private String location;
    @Column(name = "date") // important: must match your DB column
    private LocalDate date; // ✅ change from String to LocalDate
    @Column(length = 1000)
    private String description;
    @Column(length = 2000)
    private String imageUrls;

     // ✅ Getter and Setter for eventName
    public String getEventName() {
        return name;
    }

    public void setEventName(String eventName) {
        this.name = eventName;
    }

    // ✅ Getter and Setter for eventId
    public Long getEventId() {
        return id;
    }

    public void setEventId(Long eventId) {
        this.id= eventId;
    }

}


    
