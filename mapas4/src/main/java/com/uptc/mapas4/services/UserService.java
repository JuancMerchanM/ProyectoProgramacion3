package com.uptc.mapas4.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import com.uptc.mapas4.repository.*;
import com.uptc.mapas4.Entities.*;

public class UserService {

    @Autowired
    private UserRepository userRepository;

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
}
