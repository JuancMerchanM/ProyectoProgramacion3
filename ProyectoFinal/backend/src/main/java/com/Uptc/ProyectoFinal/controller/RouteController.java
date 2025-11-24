package com.Uptc.ProyectoFinal.controller;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
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
import com.Uptc.ProyectoFinal.dto.*;
import com.Uptc.ProyectoFinal.service.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/routes")
public class RouteController {

    @Autowired
    private RouteService routeService;
    
    @Autowired
    private LocationService locationService;

    @GetMapping
    public ResponseEntity<List<Route>> getUserRoutes() {
        return ResponseEntity.ok(routeService.getRoutesForCurrentUser());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RouteDTO> getById(@PathVariable String id) {
        Route route = routeService.getById(id);
        RouteDTO dto = routeService.toDTO(route);
        return ResponseEntity.ok(dto);
    }

    @PostMapping
    public ResponseEntity<Route> create(@RequestBody Route route) {
        return ResponseEntity.ok(routeService.create(route));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Route> update(@PathVariable String id, @RequestBody Map<String, Object> request) {
        try {
            System.out.println("=== ACTUALIZANDO RUTA " + id + " ===");
            
            String name = (String) request.get("name");
            
            // Manejar pointIds
            List<?> rawPointIds = (List<?>) request.get("pointIds");
            List<String> pointIds = new ArrayList<>();
            for (Object pointId : rawPointIds) {
                pointIds.add(pointId.toString());
            }
            
            Double distance = ((Number) request.get("distance")).doubleValue();
            Double duration = ((Number) request.get("duration")).doubleValue();
            
            // Obtener los puntos por ID
            List<Location> points = new ArrayList<>();
            for (String pointId : pointIds) {
                Location location = locationService.findById(pointId)
                    .orElseThrow(() -> new RuntimeException("Location no encontrada: " + pointId));
                points.add(location);
            }
            
            // Crear objeto de actualización
            Route updatedData = new Route();
            updatedData.setName(name);
            updatedData.setPoints(points);
            updatedData.setDistance(distance);
            updatedData.setDuration(duration);
            updatedData.setNumPoints(points.size());
            
            System.out.println("=== ACTUALIZANDO EN BASE DE DATOS ===");
            Route savedRoute = routeService.update(id, updatedData);
            System.out.println("✅ Ruta actualizada con ID: " + savedRoute.getId());
            
            return ResponseEntity.ok(savedRoute);
            
        } catch (Exception e) {
            System.err.println("❌ ERROR al actualizar ruta: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error al actualizar la ruta: " + e.getMessage(), e);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        routeService.delete(id);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Crea y guarda una ruta con datos ya calculados desde el frontend
     */
    @PostMapping("/create-with-data")
    public ResponseEntity<Route> createWithData(@RequestBody Map<String, Object> request) {
        try {
            System.out.println("=== RECIBIENDO PETICIÓN PARA CREAR RUTA ===");
            
            String name = (String) request.get("name");
            
            // Manejar pointIds
            List<?> rawPointIds = (List<?>) request.get("pointIds");
            List<String> pointIds = new ArrayList<>();
            for (Object id : rawPointIds) {
                pointIds.add(id.toString());
            }
            
            Double distance = ((Number) request.get("distance")).doubleValue();
            Double duration = ((Number) request.get("duration")).doubleValue();
            
            // Obtener los puntos por ID
            List<Location> points = new ArrayList<>();
            for (String pointId : pointIds) {
                Location location = locationService.findById(pointId)
                    .orElseThrow(() -> new RuntimeException("Location no encontrada: " + pointId));
                points.add(location);
            }
            
            // Crear la ruta
            Route route = new Route();
            route.setName(name);
            route.setPoints(points);
            route.setDistance(distance);
            route.setDuration(duration);
            route.setNumPoints(points.size());
            
            System.out.println("=== GUARDANDO RUTA ===");
            Route savedRoute = routeService.create(route);
            System.out.println("✅ Ruta guardada con ID: " + savedRoute.getId());
            
            return ResponseEntity.ok(savedRoute);
            
        } catch (Exception e) {
            System.err.println("❌ ERROR al crear ruta: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error al crear la ruta: " + e.getMessage(), e);
        }
    }
}