package com.example.demo.Controller;

import com.example.demo.Model.Event;
import com.example.demo.Repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*")
public class EventController {

    @Autowired
    private EventRepository repository;
    @Autowired
private EventRepository eventRepo;


    @PostMapping
    public Event createEvent(@RequestBody Event event) {
        return repository.save(event);
    }

    @GetMapping
    public List<Event> getAllEvents() {
        return repository.findAll();
    }

    @GetMapping("/upcoming")
    public List<Event> getUpcomingEvents() {
        LocalDate today = LocalDate.now();
        // return repository.findByDateAfterOrderByDateAsc(today);
        return repository.findByDateGreaterThanEqualOrderByDateAsc(today);

    }

    @GetMapping("/past")
    public List<Event> getPastEvents() {
        LocalDate today = LocalDate.now();
        return repository.findByDateBeforeOrderByDateDesc(today);
    }

    @PutMapping("/{id}")
public Event updateEvent(@PathVariable Long id, @RequestBody Event updated) {
    return repository.findById(id).map(event -> {
        event.setDescription(updated.getDescription());

        String newUrls = updated.getImageUrls();
        List<String> finalUrls = new ArrayList<>();

        if (newUrls != null && !newUrls.isBlank()) {
            finalUrls = List.of(newUrls.split(","))
                            .stream()
                            .map(String::trim)
                            .distinct()
                            .limit(6)
                            .toList();
        }

        event.setImageUrls(String.join(",", finalUrls));

        return repository.save(event);
    }).orElse(null);
}


    @GetMapping("/{id}")
public Event getEventById(@PathVariable Long id) {
    return repository.findById(id).orElse(null);
}

@GetMapping("/names")
public List<Map<String, Object>> getEventNames() {
    List<Event> events = repository.findAll();
    return events.stream().map(event -> {
        Map<String, Object> map = new HashMap<>();
        map.put("eventId", event.getEventId());
        map.put("eventName", event.getEventName());
        return map;
    }).toList();
}

@GetMapping("/by-date")
public List<Event> getEventsByDate(@RequestParam String date) {
    return eventRepo.findByDate(LocalDate.parse(date));
}


    // 🔹 Delete Event
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.ok("Deleted");
        }
        return ResponseEntity.notFound().build();
    }
}

