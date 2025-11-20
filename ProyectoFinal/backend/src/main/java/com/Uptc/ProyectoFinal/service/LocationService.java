package com.Uptc.ProyectoFinal.service;

import org.springframework.stereotype.Service;

import com.Uptc.ProyectoFinal.entity.Location;
import com.Uptc.ProyectoFinal.entity.LocationCategory;
import com.Uptc.ProyectoFinal.repository.LocationRepository;

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
        try {
            Long locationId = Long.parseLong(id);
            return repository.findById(locationId);
        } catch (NumberFormatException e) {
            return Optional.empty();
        }
    }

    public Location save(Location location) {
        return repository.save(location);
    }

    public void delete(String id) {
        try {
            Long locationId = Long.parseLong(id);
            repository.deleteById(locationId);
        } catch (NumberFormatException e) {
            throw new RuntimeException("ID inválido: " + id);
        }
    }

    public List<Location> findByCategory(String category) {
        try {
            LocationCategory cat = LocationCategory.valueOf(category.toUpperCase());
            return repository.findByCategory(cat);
        } catch (IllegalArgumentException e) {
            return List.of();
        }
    }
}