package com.Uptc.ProyectoFinal.service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.Uptc.ProyectoFinal.dto.AuthResponse;
import com.Uptc.ProyectoFinal.dto.LoginRequest;
import com.Uptc.ProyectoFinal.dto.RegisterRequest;
import com.Uptc.ProyectoFinal.entity.User;
import com.Uptc.ProyectoFinal.repository.UserRepository;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsernameOrEmail())
            .or(() -> userRepository.findByEmail(request.getUsernameOrEmail()))
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Contraseña incorrecta");
        }

        String token = jwtService.generateToken(user.getUsername());
        return new AuthResponse(token, user.getUsername());
    }

    public boolean register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail()) ||
            userRepository.existsByUsername(request.getUsername())) {
            return false;
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);
        return true;
    }

    public void requestPasswordReset(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Email no registrado"));

        String token = UUID.randomUUID().toString();
        user.setResetToken(token);
        user.setTokenExpirity(LocalDateTime.now().plusMinutes(30)); // válido 30 min
        userRepository.save(user);

        // Aquí se enviaría un correo con un link que contiene el token
        String resetLink = "http://localhost:8080/reset-password?token=" + token;
        emailService.sendEmail(email, "Recupera tu contraseña", 
            "Haz clic aquí para restablecer tu contraseña:\n" + resetLink);
    }

    public void resetPassword(String token, String newPassword) {
        User user = userRepository.findByResetToken(token)
            .orElseThrow(() -> new RuntimeException("Token inválido"));

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        userRepository.save(user);
    }
}
