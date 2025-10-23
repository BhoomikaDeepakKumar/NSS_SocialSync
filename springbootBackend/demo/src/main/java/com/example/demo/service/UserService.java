package com.example.demo.service;

import com.example.demo.Model.MyAppUser;
import com.example.demo.Model.Role;
import com.example.demo.Model.RoleType;
import com.example.demo.Repository.MyAppUserRepository;
import com.example.demo.Repository.RoleRepository;
import com.example.demo.dto.UserDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final MyAppUserRepository userRepository;
    private final RoleRepository roleRepository;

    // Get all users
    @Transactional
    public List<UserDTO> getAllUsers() {
        // Fetch all users
        List<MyAppUser> users = userRepository.findAll();

        // Ensure each user has at least one role
        Role defaultRole = roleRepository.findByName(RoleType.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("Default role not found"));

        for (MyAppUser user : users) {
            if (user.getRoles().isEmpty()) {
                user.getRoles().add(defaultRole);
                userRepository.save(user);
            }
        }

        // Map to DTOs
        return users.stream()
                .map(user -> new UserDTO(
                        user.getId(),
                        user.getUsername(),
                        user.getEmail(),
                        user.getRoles().stream().map(r -> r.getName().name()).toList()
                ))
                .collect(Collectors.toList());
    }

    // Update a user's role using roleId
    @Transactional
    public void updateUserRole(Long userId, Long roleId) {
        MyAppUser user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        user.getRoles().clear(); // keep only the new role
        user.getRoles().add(role);

        userRepository.save(user);
    }
}
