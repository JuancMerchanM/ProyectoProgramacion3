package com.Uptc.ProyectoFinal.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.Uptc.ProyectoFinal.dto.AuthResponse;
import com.Uptc.ProyectoFinal.dto.LoginRequest;
import com.Uptc.ProyectoFinal.dto.RegisterRequest;
import com.Uptc.ProyectoFinal.service.AuthService;

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
        if (!successfulRegister) {
            return ResponseEntity.ok(Map.of("error", "Email o username ya en uso."));
        }
        return ResponseEntity.ok(Map.of("msg", "usuario registrado exitosamente."));
    }

    @PostMapping(path = "/login", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestParam String email) {
        authService.sendPasswordResetEmail(email);
        return ResponseEntity.ok("Se ha enviado un correo para restablecer tu contraseña.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(
            @RequestParam String token,
            @RequestParam String newPassword) {
        authService.resetPassword(token, newPassword);
        return ResponseEntity.ok("Tu contraseña ha sido actualizada correctamente.");
    }

}
