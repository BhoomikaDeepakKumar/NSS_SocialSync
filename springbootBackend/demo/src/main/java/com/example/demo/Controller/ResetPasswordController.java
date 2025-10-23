package com.example.demo.Controller;

import com.example.demo.Model.MyAppUser;
import com.example.demo.Repository.MyAppUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
public class ResetPasswordController {

    @Autowired
    private MyAppUserRepository userRepository;

    // Encoder to hash password (recommended)
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestParam String email,
                                                @RequestParam String newPassword,
                                                @RequestParam String confirmPassword) {
        // Step 1: Check if new passwords match
        if (!newPassword.equals(confirmPassword)) {
            return ResponseEntity.badRequest().body("Passwords do not match.");
        }

        // Step 2: Find user by email
        Optional<MyAppUser> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("No user found with this email.");
        }

        MyAppUser user = userOpt.get();

        // Step 3: Hash the new password and save
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Step 4: Redirect or respond with success
        return ResponseEntity.status(HttpStatus.FOUND)
                .header("Location", "/password-reset-success")
                .build();
    }
}
