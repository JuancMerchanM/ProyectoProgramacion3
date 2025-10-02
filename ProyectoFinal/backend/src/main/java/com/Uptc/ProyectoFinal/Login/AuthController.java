package com.Uptc.ProyectoFinal.Login;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        // Simple hard-coded check for testing
        if ("user".equals(req.getUsername()) && "password".equals(req.getPassword())) {
            System.out.println("Se logeo");
            return ResponseEntity.ok(Map.of(
                "token", "dummy-jwt-token-for-testing",
                "username", req.getUsername()
            ));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                             .body(Map.of("message", "Invalid credentials"));
    }
}
