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

import com.Uptc.ProyectoFinal.entity.Route;
import com.Uptc.ProyectoFinal.service.RouteService;
import com.Uptc.ProyectoFinal.service.*;
import com.Uptc.ProyectoFinal.entity.*;
// Component para RouteSecurity. Verificar pertenencia y autenticacion
@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/routes")
public class RouteController {

    @Autowired
    private RouteService routeService;
    
    @Autowired
    private RoutingService routingService;
    
    @Autowired
    private LocationService locationService;

    @GetMapping
    public ResponseEntity<List<Route>> getUserRoutes() {
        return ResponseEntity.ok(routeService.getRoutesForCurrentUser());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Route> getById(@PathVariable String id) {
        return ResponseEntity.ok(routeService.getById(id));
    }

    @PostMapping
    public ResponseEntity<Route> create(@RequestBody Route route) {
        return ResponseEntity.ok(routeService.create(route));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Route> update(@PathVariable String id, @RequestBody Route updated) {
        return ResponseEntity.ok(routeService.update(id, updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        routeService.delete(id);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Calcula una ruta entre dos locations usando OSRM
     * POST /routes/calculate
     * Body: { "originId": "uuid", "destinationId": "uuid", "waypointIds": ["uuid1", "uuid2"] }
     */
    @PostMapping("/calculate")
    public ResponseEntity<RoutingService.RouteResponse> calculateRoute(
            @RequestBody Map<String, Object> request) {
        
        String originId = (String) request.get("originId");
        String destinationId = (String) request.get("destinationId");
        List<String> waypointIds = (List<String>) request.get("waypointIds");
        
        // Obtener coordenadas de origen
        Location origin = locationService.findById(originId)
            .orElseThrow(() -> new RuntimeException("Origen no encontrado"));
        
        // Obtener coordenadas de destino
        Location destination = locationService.findById(destinationId)
            .orElseThrow(() -> new RuntimeException("Destino no encontrado"));
        
        // Construir lista de coordenadas [lng, lat]
        List<double[]> coordinates = new ArrayList<>();
        coordinates.add(new double[]{
            origin.getLocation().getLng(),
            origin.getLocation().getLat()
        });
        
        // Agregar waypoints si existen
        if (waypointIds != null && !waypointIds.isEmpty()) {
            for (String wpId : waypointIds) {
                Location waypoint = locationService.findById(wpId)
                    .orElseThrow(() -> new RuntimeException("Waypoint no encontrado: " + wpId));
                coordinates.add(new double[]{
                    waypoint.getLocation().getLng(),
                    waypoint.getLocation().getLat()
                });
            }
        }
        
        // Agregar destino
        coordinates.add(new double[]{
            destination.getLocation().getLng(),
            destination.getLocation().getLat()
        });
        
        // Calcular ruta
        RoutingService.RouteResponse routeResponse = routingService.calculateRoute(coordinates);
        
        return ResponseEntity.ok(routeResponse);
    }
    
    /**
     * Crea y guarda una ruta calculada
     * POST /routes/create-from-calculation
     */
    @PostMapping("/create-from-calculation")
    public ResponseEntity<Route> createFromCalculation(@RequestBody Map<String, Object> request) {
        String name = (String) request.get("name");
        String originId = (String) request.get("originId");
        String destinationId = (String) request.get("destinationId");
        List<String> waypointIds = (List<String>) request.get("waypointIds");
        
        // Calcular ruta primero
        List<double[]> coordinates = new ArrayList<>();
        List<Location> points = new ArrayList<>();
        
        Location origin = locationService.findById(originId)
            .orElseThrow(() -> new RuntimeException("Origen no encontrado"));
        points.add(origin);
        coordinates.add(new double[]{
            origin.getLocation().getLng(),
            origin.getLocation().getLat()
        });
        
        if (waypointIds != null) {
            for (String wpId : waypointIds) {
                Location wp = locationService.findById(wpId).orElseThrow();
                points.add(wp);
                coordinates.add(new double[]{
                    wp.getLocation().getLng(),
                    wp.getLocation().getLat()
                });
            }
        }
        
        Location destination = locationService.findById(destinationId)
            .orElseThrow(() -> new RuntimeException("Destino no encontrado"));
        points.add(destination);
        coordinates.add(new double[]{
            destination.getLocation().getLng(),
            destination.getLocation().getLat()
        });
        
        RoutingService.RouteResponse routeResponse = routingService.calculateRoute(coordinates);
        
        // Crear entidad Route
        Route route = new Route();
        route.setName(name);
        route.setPoints(points);
        route.setDistance(routeResponse.getDistance());
        route.setDuration(routeResponse.getDuration());
        route.setPath(routeResponse.getGeometry());
        route.setNumPoints(points.size());
        
        return ResponseEntity.ok(routeService.create(route));
    }
}