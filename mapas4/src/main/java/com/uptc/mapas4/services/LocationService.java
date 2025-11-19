package com.uptc.mapas4.services;

import org.springframework.stereotype.Service;

import com.uptc.mapas4.Entities.*;
import com.uptc.mapas4.repository.*;

import java.util.List;
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

    public Optional<Location> findById(String id) {
        return repository.findById(id);
    }

    public Location save(Location location) {
        return repository.save(location);
    }

    public void delete(String id) {
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
}
