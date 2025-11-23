package com.Uptc.ProyectoFinal.service;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.Uptc.ProyectoFinal.entity.*;
import com.Uptc.ProyectoFinal.dto.*;
import com.Uptc.ProyectoFinal.repository.*;
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

    public Route getById(String id) {
        return routeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ruta no encontrada con ID: " + id));
    }
    
    /**
     * Convierte una Route a RouteDTO con los puntos incluidos
     */
    public RouteDTO toDTO(Route route) {
        // Forzar la carga de los puntos si es necesario
        route.getPoints().size(); // Esto inicializa la colección lazy
        
        RouteDTO dto = new RouteDTO();
        dto.setId(route.getId());
        dto.setName(route.getName());
        dto.setDistance(route.getDistance());
        dto.setDuration(route.getDuration());
        dto.setNumPoints(route.getNumPoints());
        dto.setCreatedAt(route.getCreatedAt());
        dto.setPublic(route.isPublic());
        dto.setPoints(route.getPoints()); // Incluir los puntos
        
        return dto;
    }
    
    /**
     * Convierte una lista de Routes a DTOs
     */
    public List<RouteDTO> toDTOList(List<Route> routes) {
        return routes.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public Route create(Route route) {
        route.setCreatedBy(getCurrentUser());
        route.setPublic(false);
        return routeRepository.save(route);
    }

    public Route update(String id, Route updated) {
        Route existing = getById(id);
        if (!existing.getCreatedBy().equals(getCurrentUser())) {
            throw new RuntimeException("No tienes permiso para modificar esta ruta");
        }

        existing.setName(updated.getName());
        existing.setPoints(updated.getPoints());
        existing.setDistance(updated.getDistance());
        existing.setDuration(updated.getDuration());
        existing.setNumPoints(updated.getNumPoints());
        return routeRepository.save(existing);
    }

    public void delete(String id) {
        Route existing = getById(id);
        if (!existing.getCreatedBy().equals(getCurrentUser())) {
            throw new RuntimeException("No tienes permiso para eliminar esta ruta");
        }
        routeRepository.delete(existing);
    }
}