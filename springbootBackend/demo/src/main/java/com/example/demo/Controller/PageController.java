package com.example.demo.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class PageController {

    @GetMapping("/event-details/{id}")
    public String eventDetailsPage(@PathVariable Long id, Model model) {
        model.addAttribute("eventId", id);
        return "event-details"; // Thymeleaf will render templates/event-details.html
    }
}
