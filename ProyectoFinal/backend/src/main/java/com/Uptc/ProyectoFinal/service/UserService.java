package com.Uptc.ProyectoFinal.service;

import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.Uptc.ProyectoFinal.dto.DeleteUserRequest;
import com.Uptc.ProyectoFinal.dto.RegisterRequest;
import com.Uptc.ProyectoFinal.dto.UpdateUserRequest;
import com.Uptc.ProyectoFinal.entity.User;
import com.Uptc.ProyectoFinal.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

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

    public Map<String, String> updateUser(Long id, UpdateUserRequest request) {

        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isEmpty()) {
            return Map.of("error", "Usuario no encontrado.");
        }

        User user = optionalUser.get();

        if (user.getPassword().equals(passwordEncoder.encode(request.getOldPassword()))) {
            return Map.of("error", "Contraseña erronea.");
        }

        if (request.getUsername() != null && !request.getUsername().equals(user.getUsername())) {
            if (userRepository.existsByUsername(request.getUsername())) {
                return Map.of("error", "El username ya está en uso.");
            }
            user.setUsername(request.getUsername());
        }

        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                return Map.of("error", "El email ya está en uso.");
            }
            user.setEmail(request.getEmail());
        }

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        String newToken = jwtService.generateToken(user.getUsername());

        userRepository.save(user);

        return Map.of(
                "msg", "Usuario actualizado correctamente.",
                "token", newToken);
    }

    public Map<String, String> deleteUser(DeleteUserRequest request) {
        Optional<User> optionalUser = userRepository.findById(request.getId());
        if (optionalUser.isEmpty()) {
            return Map.of("error", "Usuario no encontrado.");
        }

        User user = optionalUser.get();

        if (user.getPassword().equals(passwordEncoder.encode(request.getPassword()))) {
            return Map.of("error", "Contraseña erronea.");
        }

        userRepository.deleteById(request.getId());
        return Map.of("msg", "Usuario eliminado correctamente.");
    }
}
