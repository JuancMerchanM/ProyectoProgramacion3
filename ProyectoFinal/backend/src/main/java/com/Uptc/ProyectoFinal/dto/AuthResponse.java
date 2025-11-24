package com.Uptc.ProyectoFinal.dto;

public class AuthResponse {
    private String token;
    private String username;
    private String email;
    private Long id;  // ← AGREGAR

    public AuthResponse(String token, String username, String email, Long id) {  // ← MODIFICAR constructor
        this.token = token;
        this.username = username;
        this.email = email;
        this.id = id;  // ← AGREGAR
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    // ← AGREGAR getter y setter para id
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}