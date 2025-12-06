package com.example.demo.Controller;

import java.util.HashSet;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Model.MyAppUser;
import com.example.demo.Model.Role;
import com.example.demo.Repository.MyAppUserRepository;
import com.example.demo.Repository.RoleRepository;
import com.example.demo.utils.JwtTokenUtil;
import com.example.demo.Model.RoleType;


@RestController
public class RegistrationController {

    @Autowired
    private MyAppUserRepository myAppUserRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping(value = "/req/signup", consumes = "application/json")
    public ResponseEntity<String> createUser(@RequestBody MyAppUser user) {

        Optional<MyAppUser> existingAppUserOpt = myAppUserRepository.findByEmail(user.getEmail());

        if (existingAppUserOpt.isPresent()) {
            MyAppUser existingAppUser = existingAppUserOpt.get();

            if (existingAppUser.isVerified()) {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body("User already exists and is verified.");
            } else {
                String verificationToken = JwtTokenUtil.generateToken(existingAppUser.getEmail());
                existingAppUser.setVerificationToken(verificationToken);
                myAppUserRepository.save(existingAppUser);

                return ResponseEntity
                        .status(HttpStatus.OK)
                        .body("Verification email resent. Please check your inbox.");
            }
        }

        // New user registration
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        String verificationToken = JwtTokenUtil.generateToken(user.getEmail());
        user.setVerificationToken(verificationToken);
        user.setVerified(false);

        // --- SET DEFAULT ROLE USER ---
        Role userRole = roleRepository.findByName(RoleType.ROLE_USER)   
                .orElseThrow(() -> new RuntimeException("ROLE_USER is missing from DB"));

        user.setRoles(new HashSet<>());
        user.getRoles().add(userRole);

        // Generate volunteerId if not already present
if (user.getVolunteerId() == null || user.getVolunteerId().isEmpty()) {
    long count = myAppUserRepository.count() + 1;
    String prefix = String.valueOf(java.time.Year.now().getValue());
    String volunteerId = String.format("%s_%03d", prefix, count);
    user.setVolunteerId(volunteerId);
}

        myAppUserRepository.save(user);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body("Registration successful! Please verify your email.");
    }
}
