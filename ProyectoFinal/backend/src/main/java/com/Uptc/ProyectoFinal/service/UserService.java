package com.Uptc.ProyectoFinal.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import com.Uptc.ProyectoFinal.entity.User;
import com.Uptc.ProyectoFinal.repository.UserRepository;

public class UserService {

    @Autowired
    private UserRepository userRepository;

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
}
