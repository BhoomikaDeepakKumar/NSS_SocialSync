package com.example.demo.service;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.demo.Model.MyAppUser;
import com.example.demo.Model.Role;
import com.example.demo.Repository.MyAppUserRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class MyAppUserService implements UserDetailsService {

    private final MyAppUserRepository repository;

    @Override
     public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        MyAppUser user = repository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        return User.builder()
                .username(user.getEmail())  // principal = email
                .password(user.getPassword())
                .authorities(
                        user.getRoles()
                                .stream()
                                .map(Role::getName)
                                .toArray(String[]::new)
                )
                .build();
    }
}