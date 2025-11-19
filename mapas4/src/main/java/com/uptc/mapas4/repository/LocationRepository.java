package com.uptc.mapas4.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uptc.mapas4.Entities.*;


@Repository
public interface LocationRepository extends JpaRepository<Location, String> {
    List<Location> findByCategory(LocationCategory category);
}
