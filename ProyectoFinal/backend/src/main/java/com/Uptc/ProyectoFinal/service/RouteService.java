package com.Uptc.ProyectoFinal.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.Uptc.ProyectoFinal.entity.Route;
import com.Uptc.ProyectoFinal.entity.User;
import com.Uptc.ProyectoFinal.repository.RouteRepository;
import com.Uptc.ProyectoFinal.repository.UserRepository;

@Service
public class RouteService {
    
    @Autowired
    private RouteRepository routeRepository;

    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    public List<Route> getRoutesForCurrentUser() {
        User user = getCurrentUser();
        return routeRepository.findByCreatedBy(user);
    }

    public Route getById(Long id) {
        return routeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ruta no encontrada"));
    }

    public Route create(Route route) {
        route.setCreatedBy(getCurrentUser());
        route.setPublic(false);
        return routeRepository.save(route);
    }

    public Route update(Long id, Route updated) {
        Route existing = getById(id);
        if (!existing.getCreatedBy().equals(getCurrentUser())) {
            throw new RuntimeException("No tienes permiso para modificar esta ruta");
        }

        existing.setName(updated.getName());
        existing.setPoints(updated.getPoints());
        existing.setDistance(updated.getDistance());
        existing.setDuration(updated.getDuration());
        return routeRepository.save(existing);
    }

    public void delete(Long id) {
        Route existing = getById(id);
        if (!existing.getCreatedBy().equals(getCurrentUser())) {
            throw new RuntimeException("No tienes permiso para eliminar esta ruta");
        }
        routeRepository.delete(existing);
    }
}
