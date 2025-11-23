package com.Uptc.ProyectoFinal.dto;

public class AuthResponse {
    private String token;
    private Long id;
    private String username;
    private String email;

    public AuthResponse(Long id, String token, String username, String email) {
        this.token = token;
        this.username = username;
        this.email = email;
        this.id = id;
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

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
