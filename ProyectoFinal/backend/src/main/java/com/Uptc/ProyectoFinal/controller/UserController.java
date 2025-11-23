package com.Uptc.ProyectoFinal.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Uptc.ProyectoFinal.dto.DeleteUserRequest;
import com.Uptc.ProyectoFinal.dto.RegisterRequest;
import com.Uptc.ProyectoFinal.dto.UpdateUserRequest;
import com.Uptc.ProyectoFinal.service.UserService;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/user")
public class UserController {

    private UserService userService;

    public UserController(UserService userService){
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody RegisterRequest request) {
        boolean successfulRegister = userService.register(request);
        if (!successfulRegister) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Email o username ya en uso"));
        }
        return ResponseEntity.ok(Map.of("msg", "usuario registrado exitosamente."));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UpdateUserRequest request) {

        Map<String, String> response = userService.updateUser(id, request);

        if (response.containsKey("error")) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(response);
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/delete-user")
    public ResponseEntity<Map<String, String>> deleteUser(@RequestBody DeleteUserRequest dtUser) {
        Map<String, String> response = userService.deleteUser(dtUser);

        if (response.containsKey("error")) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(response);
        }

        return ResponseEntity.ok(response);
    }

}
