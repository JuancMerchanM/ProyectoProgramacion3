package com.Uptc.ProyectoFinal.service;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
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
    private JavaMailSender mailSender;

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

    public void sendPasswordResetEmail(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("No existe un usuario con ese correo"));

        String token = UUID.randomUUID().toString();
        user.setResetToken(token);
        userRepository.save(user);

        String resetUrl = "http://localhost:8080/reset-password?token=" + token;
        String message = "Haz clic en el siguiente enlace para restablecer tu contraseña:\n" + resetUrl;

        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setTo(email);
        mail.setSubject("Recuperación de contraseña");
        mail.setText(message);

        mailSender.send(mail);
    }

    public void resetPassword(String token, String newPassword) {
        User user = userRepository.findByResetToken(token)
            .orElseThrow(() -> new RuntimeException("Token inválido o expirado"));

        user.setPassword(newPassword); // ⚠️ cifrar con BCrypt antes de guardar
        user.setResetToken(null);
        userRepository.save(user);
    }
}
