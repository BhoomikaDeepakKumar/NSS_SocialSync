package com.example.demo.Controller;

import com.example.demo.dto.UserDTO;
import com.example.demo.dto.RoleUpdateRequest;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserService userService;

    // Fetch all users
    @GetMapping("/users")
    public List<UserDTO> getAllUsers() {
        return userService.getAllUsers();
    }

    // Update user role
   @PutMapping("/users/{id}/role")
public ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestBody RoleUpdateRequest request) {
    userService.updateUserRole(id, request.getRoleId()); // pass the ID, not enum
    return ResponseEntity.ok().build();
}

}
