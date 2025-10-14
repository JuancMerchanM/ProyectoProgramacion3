package com.Uptc.ProyectoFinal.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Uptc.ProyectoFinal.dto.AuthResponse;
import com.Uptc.ProyectoFinal.dto.LoginRequest;
import com.Uptc.ProyectoFinal.dto.RegisterRequest;
import com.Uptc.ProyectoFinal.service.AuthService;
import com.Uptc.ProyectoFinal.service.UserService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController (AuthService as){
        this.authService = as;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody RegisterRequest request) {
        boolean successfulRegister = authService.register(request);
        if (successfulRegister) {
            return ResponseEntity.ok(Map.of("error", "Email o username ya en uso."));
        }
        return ResponseEntity.ok(Map.of("msg", "usuario registrado exitosamente."));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

}
