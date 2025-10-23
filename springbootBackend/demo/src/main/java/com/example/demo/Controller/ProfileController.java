package com.example.demo.Controller;

import com.example.demo.Model.MyAppUser;
import com.example.demo.Repository.MyAppUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.Year;
import java.util.Optional;

// DTO to safely send response
class ProfileResponse {
    private String email;
    private String fullName;
    private String volunteerId;
    private String course;
    private Integer semester;
    private String contact;
    private String role;

    // constructor
    public ProfileResponse(MyAppUser user) {
        this.email = user.getEmail();
        this.fullName = user.getFullName();
        this.volunteerId = user.getVolunteerId();
        this.course = user.getCourse();
        this.semester = user.getSemester();
        this.contact = user.getContact();
        this.role = user.getRole();
    }

    // getters
    public String getEmail() { return email; }
    public String getFullName() { return fullName; }
    public String getVolunteerId() { return volunteerId; }
    public String getCourse() { return course; }
    public Integer getSemester() { return semester; }
    public String getContact() { return contact; }
    public String getRole() { return role; }
}

@RestController
@RequestMapping("/api/users")
public class ProfileController {

    @Autowired
    private MyAppUserRepository myAppUserRepository;

    // --- Complete Profile after signup ---
    @PostMapping("/complete-profile/{email}")
    public ProfileResponse completeProfile(@PathVariable String email, @RequestBody MyAppUser updatedProfile) {
        Optional<MyAppUser> userOpt = myAppUserRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found with email: " + email);
        }

        MyAppUser user = userOpt.get();

        // set profile fields
        user.setFullName(updatedProfile.getFullName());
        user.setCourse(updatedProfile.getCourse());
        user.setSemester(updatedProfile.getSemester());
        user.setContact(updatedProfile.getContact());

        // generate volunteerId if not already set
        if (user.getVolunteerId() == null) {
            String prefix = String.valueOf(Year.now().getValue()); // current year
            long count = myAppUserRepository.count() + 1; // total users + 1
            String volunteerId = String.format("%s_%03d", prefix, count); // e.g., 2025_001
            user.setVolunteerId(volunteerId);
        }

        MyAppUser saved = myAppUserRepository.save(user);
        return new ProfileResponse(saved); // return safe response
    }

    // --- Update profile later ---
    @PutMapping("/update-profile/{email}")
    public ProfileResponse updateProfile(@PathVariable String email, @RequestBody MyAppUser updatedProfile) {
        Optional<MyAppUser> userOpt = myAppUserRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found with email: " + email);
        }

        MyAppUser user = userOpt.get();

        user.setFullName(updatedProfile.getFullName());
        user.setCourse(updatedProfile.getCourse());
        user.setSemester(updatedProfile.getSemester());
        user.setContact(updatedProfile.getContact());
        user.setRole(updatedProfile.getRole()); // allow admin to promote/demote

        MyAppUser saved = myAppUserRepository.save(user);
        return new ProfileResponse(saved);
    }
}
