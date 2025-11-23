package com.Uptc.ProyectoFinal.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Uptc.ProyectoFinal.entity.Route;
import com.Uptc.ProyectoFinal.service.RouteService;
// Component para RouteSecurity. Verificar pertenencia y autenticacion
@RestController
@RequestMapping("/routes")
public class RouteController {

    @Autowired
    private RouteService routeService;

    // Obtener todas las rutas del usuario actual
    @GetMapping
    public ResponseEntity<List<Route>> getUserRoutes() {
        return ResponseEntity.ok(routeService.getRoutesForCurrentUser());
    }

    // Obtener una ruta específica
    @GetMapping("/{id}")
    public ResponseEntity<Route> getById(@PathVariable Long id) {
        return ResponseEntity.ok(routeService.getById(id));
    }

    // Crear nueva ruta
    @PostMapping
    public ResponseEntity<Route> create(@RequestBody Route route) {
        return ResponseEntity.ok(routeService.create(route));
    }

    // Actualizar ruta (solo si es del usuario actual)
    @PutMapping("/{id}")
    public ResponseEntity<Route> update(@PathVariable Long id, @RequestBody Route updated) {
        return ResponseEntity.ok(routeService.update(id, updated));
    }

    // Eliminar ruta
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        routeService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
