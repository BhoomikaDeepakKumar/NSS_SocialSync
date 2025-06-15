package com.example.demo.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Model.MyAppUser;
import com.example.demo.Model.MyAppUserRepository;
import com.example.demo.service.EmailService;
import com.example.demo.utils.JwtTokenUtil;

@RestController
public class RegistrationController {
    
    @Autowired
    private MyAppUserRepository myAppUserRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private EmailService emailService;
    
    
@PostMapping(value = "/req/signup", consumes = "application/json")
public ResponseEntity<String> createUser(@RequestBody MyAppUser user) {

    MyAppUser existingAppUser = myAppUserRepository.findByEmail(user.getEmail());

    if (existingAppUser != null) {
        if (existingAppUser.isVerified()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("User already exists and is verified.");
        } else {
            String verificationToken = JwtTokenUtil.generateToken(existingAppUser.getEmail());
            existingAppUser.setVerificationToken(verificationToken);
            myAppUserRepository.save(existingAppUser);

            emailService.sendVerificationEmail(existingAppUser.getEmail(), verificationToken);
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body("Verification email resent. Please check your inbox.");
        }
    }

    user.setPassword(passwordEncoder.encode(user.getPassword()));
    String verificationToken = JwtTokenUtil.generateToken(user.getEmail());
    user.setVerificationToken(verificationToken);
    myAppUserRepository.save(user);

    emailService.sendVerificationEmail(user.getEmail(), verificationToken);

    return ResponseEntity
            .status(HttpStatus.OK)
            .body("Registration successful! Please verify your email.");
}
}
