package com.example.demo.Model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "roles")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})  // <-- SUPER IMPORTANT
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING) 
    @Column(unique = true, nullable = false)
    private RoleType name;

    public Role() {}

    public Role(RoleType name) {
        this.name = name;
    }

    public Long getId() { 
        return id; 
    }

    public RoleType getName() { 
        return name; 
    }

    public void setName(RoleType name) { 
        this.name = name; 
    }
}
