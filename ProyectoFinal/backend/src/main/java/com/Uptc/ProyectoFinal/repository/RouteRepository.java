package com.Uptc.ProyectoFinal.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Uptc.ProyectoFinal.entity.Route;
import com.Uptc.ProyectoFinal.entity.User;

@Repository
public interface RouteRepository extends JpaRepository<Route, Long> {
    List<Route> findByCreatedBy(User user);
}
