package com.example.demo.Controller;

import com.example.demo.Model.MyAppUser;
import com.example.demo.Repository.MyAppUserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final MyAppUserRepository myAppUserRepository;

    @GetMapping("/profile")
public ResponseEntity<?> getLoggedInUser(Authentication authentication) {
    String username = authentication.getName();
    Optional<MyAppUser> optionalUser = myAppUserRepository.findByUsername(username);

    if (optionalUser.isPresent()) {
        return ResponseEntity.ok(optionalUser.get());
    } else {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
    }
}
}
