package com.uptc.mapas4.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.uptc.mapas4.dto.*;
import com.uptc.mapas4.services.*;
@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService as) {
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
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        AuthResponse auth = authService.login(request);

        if (auth == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Usuario o contraseña incorrectos"));
        }

        return ResponseEntity.ok(auth);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String email) {

        boolean sent = authService.sendPasswordResetEmail(email);

        if (!sent) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "No existe un usuario con ese correo"));
        }

        return ResponseEntity.ok(
                Map.of("message", "Se ha enviado un correo para restablecer tu contraseña."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest rpr) {

        boolean ok = authService.resetPassword(rpr.getResetToken(), rpr.getNewPassword());

        if (!ok) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Token inválido o expirado"));
        }

        return ResponseEntity.ok(
                Map.of("message", "Tu contraseña ha sido actualizada correctamente."));
    }

}
