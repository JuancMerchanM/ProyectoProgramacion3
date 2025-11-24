package com.Uptc.ProyectoFinal.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Uptc.ProyectoFinal.entity.*;

import com.Uptc.ProyectoFinal.service.*;
@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/location")
public class LocationController {
    private final LocationService service;

    public LocationController(LocationService service) {
        this.service = service;
    }

    @GetMapping("/")
    public ResponseEntity<List<Location>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Location> getById(@PathVariable String id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Location>> getByCategory(@PathVariable String category) {
        return ResponseEntity.ok(service.findByCategory(category));
    }

    @PostMapping("/")
    public ResponseEntity<Location> create(@RequestBody Location location) {
        System.out.println(location.toString());
        return ResponseEntity.ok(service.save(location));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Location> update(
            @PathVariable String id,
            @RequestBody Location updated) {
        return service.findById(id)
                .map(existing -> {
                    updated.setId(existing.getId());
                    return ResponseEntity.ok(service.save(updated));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        try {
            service.delete(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    @PutMapping("/{id}/rating")
    public ResponseEntity<Location> updateRating(
            @PathVariable String id,
            @RequestBody Map<String, Double> ratingData) {
        try {
            Long locationId = Long.parseLong(id);
            Double newRating = ratingData.get("rating");
            
            if (newRating == null || newRating < 0 || newRating > 5) {
                return ResponseEntity.badRequest().build();
            }
            
            Location updated = service.updateRating(locationId, newRating);
            return ResponseEntity.ok(updated);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
