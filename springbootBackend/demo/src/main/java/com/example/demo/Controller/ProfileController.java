package com.example.demo.Controller;

import com.example.demo.Model.MyAppUser;
import com.example.demo.Repository.MyAppUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.Year;
import java.util.Optional;

// ------------------------------------------------------------------
// DTO for sending profile safely (no password, tokens, roles table)
// ------------------------------------------------------------------
class ProfileResponse {
    private String email;
    private String fullName;
    private String volunteerId;
    private String course;
    private Integer semester;
    private String contact;
    private String affiliation;     // NEW
    private String role;

    public ProfileResponse(MyAppUser user) {
        this.email = user.getEmail();
        this.fullName = user.getFullName();
        this.volunteerId = user.getVolunteerId();
        this.course = user.getCourse();
        this.semester = user.getSemester();
        this.contact = user.getContact();
        this.affiliation = user.getAffiliation(); // NEW

        // extract first role name safely
        this.role = user.getRoles()
                .stream()
                .findFirst()
                .map(r -> r.getName().name())
                .orElse("ROLE_USER");
    }

    public String getEmail() { return email; }
    public String getFullName() { return fullName; }
    public String getVolunteerId() { return volunteerId; }
    public String getCourse() { return course; }
    public Integer getSemester() { return semester; }
    public String getContact() { return contact; }
    public String getAffiliation() { return affiliation; }
    public String getRole() { return role; }
}

@RestController
@RequestMapping("/api/users")
public class ProfileController {

    @Autowired
    private MyAppUserRepository myAppUserRepository;

    // ------------------------------------------------------------------
    // 1️⃣ COMPLETE PROFILE (first-time setup)
    // ------------------------------------------------------------------
    @PostMapping("/complete-profile/{email}")
    public ProfileResponse completeProfile(
            @PathVariable String email,
            @RequestBody MyAppUser updatedProfile
    ) {
        Optional<MyAppUser> userOpt = myAppUserRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found with email: " + email);
        }

        MyAppUser user = userOpt.get();

        // fill in profile details
        user.setFullName(updatedProfile.getFullName());
        user.setCourse(updatedProfile.getCourse());
        user.setSemester(updatedProfile.getSemester());
        user.setContact(updatedProfile.getContact());
        user.setAffiliation(updatedProfile.getAffiliation()); // NEW

        // generate volunteer ID if null
        if (user.getVolunteerId() == null) {
            String prefix = String.valueOf(Year.now().getValue());
            long count = myAppUserRepository.count() + 1;
            String volunteerId = String.format("%s_%03d", prefix, count);
            user.setVolunteerId(volunteerId);
        }

        MyAppUser saved = myAppUserRepository.save(user);
        return new ProfileResponse(saved);
    }

    // ------------------------------------------------------------------
    // 2️⃣ UPDATE PROFILE (normal edit from profile page)
    // ------------------------------------------------------------------
    @PutMapping("/update-profile/{email}")
    public ProfileResponse updateProfile(
            @PathVariable String email,
            @RequestBody MyAppUser updatedProfile
    ) {
        Optional<MyAppUser> userOpt = myAppUserRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found with email: " + email);
        }

        MyAppUser user = userOpt.get();

        // update editable fields only
        user.setFullName(updatedProfile.getFullName());
        user.setCourse(updatedProfile.getCourse());
        user.setSemester(updatedProfile.getSemester());
        user.setContact(updatedProfile.getContact());
        user.setAffiliation(updatedProfile.getAffiliation()); // NEW

        // do NOT update password, roles, tokens

        MyAppUser saved = myAppUserRepository.save(user);
        return new ProfileResponse(saved);
    }
}
