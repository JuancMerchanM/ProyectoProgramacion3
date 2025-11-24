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
    public PostDTO createPost(String routeId, String description, Double rating) {
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

        RoutePost savedPost = postRepository.save(post);
        return convertToDTO(savedPost);
    }

    /**
     * Obtener todas las publicaciones activas
     */
    public List<PostDTO> getActivePosts() {
        List<RoutePost> posts = postRepository.findByIsActiveOrderByPublishedAtDesc(true);
        return posts.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtener publicaciones del usuario actual
     */
    public List<PostDTO> getUserPosts() {
        User user = getCurrentUser();
        List<RoutePost> posts = postRepository.findByRoute_CreatedByOrderByPublishedAtDesc(user);
        return posts.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
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
    public PostDTO updateRating(String postId, Double rating) {
        RoutePost post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Publicación no encontrada"));

        post.setRating(rating);
        RoutePost updatedPost = postRepository.save(post);
        return convertToDTO(updatedPost);
    }

    /**
     * Convertir RoutePost a PostDTO
     */
    private PostDTO convertToDTO(RoutePost post) {
        PostDTO dto = new PostDTO();
        dto.setId(post.getId());
        dto.setDescription(post.getDescription());
        dto.setActive(post.isActive());
        dto.setRating(post.getRating());
        dto.setPublishedAt(post.getPublishedAt());

        // Convertir Route a RouteInfo
        Route route = post.getRoute();
        PostDTO.RouteInfo routeInfo = new PostDTO.RouteInfo();
        routeInfo.setId(route.getId());
        routeInfo.setName(route.getName());
        routeInfo.setDistance(route.getDistance());
        routeInfo.setNumPoints(route.getNumPoints());
        
        // Incluir puntos de la ruta
        if (route.getPoints() != null) {
            routeInfo.setPoints(route.getPoints());
        }

        // Incluir información del usuario creador
        User creator = route.getCreatedBy();
        if (creator != null) {
            PostDTO.UserInfo userInfo = new PostDTO.UserInfo(
                creator.getUsername(),
                creator.getEmail()
            );
            routeInfo.setCreatedBy(userInfo);
        }

        dto.setRoute(routeInfo);
        return dto;
    }
}