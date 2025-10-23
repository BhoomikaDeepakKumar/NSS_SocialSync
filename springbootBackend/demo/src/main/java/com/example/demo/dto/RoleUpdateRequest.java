package com.example.demo.dto;

public class RoleUpdateRequest {
    private Long roleId;  // change from RoleType to Long

    public Long getRoleId() {
        return roleId;
    }

    public void setRoleId(Long roleId) {
        this.roleId = roleId;
    }
}
