package com.example.demo.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Model.MyAppUser;
import com.example.demo.Repository.MyAppUserRepository;
import com.example.demo.utils.JwtTokenUtil;

import java.util.Optional;

@RestController
public class VerificationController {
    
    @Autowired
    private MyAppUserRepository myAppUserRepository;
    
    @Autowired
    private JwtTokenUtil jwtUtil;
     
    @GetMapping("/req/signup/verify")
    public ResponseEntity<String> verifyEmail(@RequestParam("token") String token) {
        String emailString = jwtUtil.extractEmail(token);
        
        Optional<MyAppUser> userOpt = myAppUserRepository.findByEmail(emailString);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid or expired token!");
        }
        
        MyAppUser user = userOpt.get();

        if (user.getVerificationToken() == null ||
            !jwtUtil.validateToken(token) ||
            !user.getVerificationToken().equals(token)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Token expired or invalid!");
        }

        // Mark user as verified
        user.setVerificationToken(null);
        user.setVerified(true);  
        myAppUserRepository.save(user);
        
        return ResponseEntity.status(HttpStatus.OK).body("Email successfully verified!");
    }
}
