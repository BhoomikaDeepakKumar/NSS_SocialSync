package com.example.demo.Controller;

import com.example.demo.Model.MyAppUser;
import com.example.demo.Model.Role;
import com.example.demo.Model.RoleType;
import com.example.demo.Repository.MyAppUserRepository;
import com.example.demo.Repository.RoleRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DefaultAdminCreator implements CommandLineRunner {

    @Autowired
    private MyAppUserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public void run(String... args) throws Exception {

        // only create admin if DB is empty
        if (userRepository.count() == 0) {  
            MyAppUser admin = new MyAppUser();
admin.setFullName("Admin User");            
admin.setEmail("admin@nss.com");
admin.setPassword(passwordEncoder.encode("admin123"));
admin.setVolunteerId(null);

// 1️⃣ Save user first
userRepository.save(admin);  

// 2️⃣ Fetch ROLE_ADMIN from DB
Role adminRole = roleRepository.findByName(RoleType.ROLE_ADMIN)
        .orElseThrow(() -> new RuntimeException("ROLE_ADMIN is missing in DB"));

// 3️⃣ Add role
admin.getRoles().add(adminRole);

// 4️⃣ Save again
userRepository.save(admin);

System.out.println("⭐⭐ Default Admin Created: admin@nss.com / admin123 ⭐⭐");

        }
    }
}
