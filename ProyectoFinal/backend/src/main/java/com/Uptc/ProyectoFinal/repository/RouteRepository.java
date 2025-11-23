package com.Uptc.ProyectoFinal.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Uptc.ProyectoFinal.entity.*;
@Repository
public interface RouteRepository extends JpaRepository<Route, String> {  // ← Cambiado a String
    List<Route> findByCreatedBy(User user);
}
