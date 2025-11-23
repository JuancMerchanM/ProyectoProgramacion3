package com.Uptc.ProyectoFinal.repository;




import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Uptc.ProyectoFinal.entity.*;



public interface PostRepository extends JpaRepository<RoutePost, String> {
    
    // Encontrar posts activos ordenados por fecha de publicación
    List<RoutePost> findByIsActiveOrderByPublishedAtDesc(boolean isActive);
    
    // Encontrar posts de un usuario específico ordenados por fecha
    List<RoutePost> findByRoute_CreatedByOrderByPublishedAtDesc(User user);
}