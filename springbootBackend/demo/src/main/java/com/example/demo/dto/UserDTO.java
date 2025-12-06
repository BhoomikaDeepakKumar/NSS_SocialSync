package com.example.demo.dto;

import java.util.List;

public class UserDTO {

    private Long id;
    private String fullName;   // replaced username
    private String email;
    private List<String> roles;

    public UserDTO() {}

    public UserDTO(Long id, String fullName, String email, List<String> roles) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.roles = roles;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public List<String> getRoles() { return roles; }
    public void setRoles(List<String> roles) { this.roles = roles; }
}
