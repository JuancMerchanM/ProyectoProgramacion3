package com.Uptc.ProyectoFinal.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;



import com.Uptc.ProyectoFinal.service.*;
import com.Uptc.ProyectoFinal.dto.*;
@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/posts")
public class PostController {

    @Autowired
    private PostService postService;

    /**
     * Crear una nueva publicación
     */
    @PostMapping
    public ResponseEntity<PostDTO> createPost(@RequestBody Map<String, Object> request) {
        try {
            String routeId = (String) request.get("routeId");
            String description = (String) request.get("description");
            Double rating = request.get("rating") != null ? 
                ((Number) request.get("rating")).doubleValue() : null;
            
            PostDTO post = postService.createPost(routeId, description, rating);
            return ResponseEntity.ok(post);
            
        } catch (Exception e) {
            System.err.println("❌ Error al crear post: " + e.getMessage());
            throw new RuntimeException("Error al crear la publicación: " + e.getMessage(), e);
        }
    }

    /**
     * Obtener todas las publicaciones activas
     */
    @GetMapping("/active")
    public ResponseEntity<List<PostDTO>> getActivePosts() {
        return ResponseEntity.ok(postService.getActivePosts());
    }

    /**
     * Obtener publicaciones del usuario actual
     */
    @GetMapping("/user")
    public ResponseEntity<List<PostDTO>> getUserPosts() {
        return ResponseEntity.ok(postService.getUserPosts());
    }

    /**
     * Desactivar una publicación
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivatePost(@PathVariable String id) {
        postService.deactivatePost(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Actualizar rating de una publicación
     */
    @PatchMapping("/{id}/rating")
    public ResponseEntity<PostDTO> updateRating(
            @PathVariable String id, 
            @RequestBody Map<String, Object> request) {
        Double rating = ((Number) request.get("rating")).doubleValue();
        PostDTO updatedPost = postService.updateRating(id, rating);
        return ResponseEntity.ok(updatedPost);
    }
}