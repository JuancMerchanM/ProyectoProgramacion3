package com.Uptc.ProyectoFinal.service;

import org.springframework.stereotype.Service;

import com.Uptc.ProyectoFinal.entity.Location;
import com.Uptc.ProyectoFinal.entity.LocationCategory;
import com.Uptc.ProyectoFinal.repository.LocationRepository;

import jakarta.persistence.EntityNotFoundException;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class LocationService {

    private final LocationRepository repository;

    public LocationService(LocationRepository repository) {
        this.repository = repository;
    }

    public List<Location> findAll() {
        return repository.findAll();
    }

    public Optional<Location> findById(Long id) {
        return repository.findById(id);
    }

    public Location save(Location location) {
        return repository.save(location);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public List<Location> findByCategory(String category) {
        try {
            LocationCategory cat = LocationCategory.valueOf(category.toUpperCase());
            return repository.findByCategory(cat);
        } catch (IllegalArgumentException e) {
            // categoría no válida → devuelve lista vacía o lanza excepción personalizada
            return List.of();
        }
    }

    public Map<String,String> updateRating(Long id, Double rating) {
        if (rating < 0 || rating > 5) {
            return Map.of("error", "Rango de puntuacion erroneo.");
        }

        Location location = repository.findById(id)
                .orElse(null);

        if (location == null) {
            return Map.of("error", "Ubicacion no encontrada.");
        }
        location.setRating(rating);
        repository.save(location);
        return Map.of("succes", "Puntuado con exito");
    }
}
