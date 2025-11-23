package com.Uptc.ProyectoFinal.service;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.Uptc.ProyectoFinal.entity.*;
import com.Uptc.ProyectoFinal.repository.*;

@Service
public class PostService {
    
    @Autowired
    private PostRepository postRepository;

    @Autowired
    private RouteRepository routeRepository;

    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    /**
     * Crear una nueva publicación
     */
    public RoutePost createPost(String routeId, String description, Double rating) {
        Route route = routeRepository.findById(routeId)
                .orElseThrow(() -> new RuntimeException("Ruta no encontrada"));

        User currentUser = getCurrentUser();
        
        // Verificar que el usuario es dueño de la ruta
        if (!route.getCreatedBy().equals(currentUser)) {
            throw new RuntimeException("No tienes permiso para publicar esta ruta");
        }

        // Marcar la ruta como pública
        route.setPublic(true);
        routeRepository.save(route);

        // Crear el post
        RoutePost post = new RoutePost();
        post.setRoute(route);
        post.setDescription(description);
        post.setRating(rating);
        post.setActive(true);

        return postRepository.save(post);
    }

    /**
     * Obtener todas las publicaciones activas
     */
    public List<RoutePost> getActivePosts() {
        return postRepository.findByIsActiveOrderByPublishedAtDesc(true);
    }

    /**
     * Obtener publicaciones del usuario actual
     */
    public List<RoutePost> getUserPosts() {
        User user = getCurrentUser();
        return postRepository.findByRoute_CreatedByOrderByPublishedAtDesc(user);
    }

    /**
     * Desactivar una publicación
     */
    public void deactivatePost(String postId) {
        RoutePost post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Publicación no encontrada"));

        User currentUser = getCurrentUser();
        
        // Verificar que el usuario es dueño del post
        if (!post.getRoute().getCreatedBy().equals(currentUser)) {
            throw new RuntimeException("No tienes permiso para eliminar esta publicación");
        }

        post.setActive(false);
        postRepository.save(post);
    }

    /**
     * Actualizar rating de una publicación
     */
    public RoutePost updateRating(String postId, Double rating) {
        RoutePost post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Publicación no encontrada"));

        post.setRating(rating);
        return postRepository.save(post);
    }
}