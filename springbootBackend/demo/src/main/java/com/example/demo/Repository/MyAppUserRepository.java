package com.example.demo.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.Model.MyAppUser;

@Repository
public interface MyAppUserRepository extends JpaRepository<MyAppUser, Long> {
    
    Optional<MyAppUser> findByEmail(String email);
    Optional<MyAppUser> findByUsername(String username);
}
