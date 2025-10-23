package com.example.demo.Model;

import jakarta.persistence.*;

@Entity
@Table(name = "roles")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)  // store enum value as string in DB
    @Column(unique = true, nullable = false)
    private RoleType name;  // <-- enum instead of String

    // constructor, getters, setters
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
