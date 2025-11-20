package com.Uptc.ProyectoFinal.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Uptc.ProyectoFinal.entity.Location;
import com.Uptc.ProyectoFinal.entity.LocationCategory;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {
    List<Location> findByCategory(LocationCategory category);
}