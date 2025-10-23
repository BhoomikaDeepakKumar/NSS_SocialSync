package com.example.demo.Seeder;

import com.example.demo.Model.Role;
import com.example.demo.Model.RoleType;
import com.example.demo.Repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RoleSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;

    @Override
    public void run(String... args) {
        for (RoleType roleType : RoleType.values()) {
            roleRepository.findByName(roleType).orElseGet(() -> {
                Role role = new Role(roleType);
                return roleRepository.save(role);
            });
        }
        System.out.println("Roles seeded successfully!");
    }
}
