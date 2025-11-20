package com.Uptc.ProyectoFinal.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;

@Service
public class RoutingService {
    
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    // Usar OSRM público (puedes cambiarlo a tu propio servidor OSRM)
    private static final String OSRM_URL = "https://router.project-osrm.org/route/v1/driving/";
    
    /**
     * Calcula la ruta entre múltiples puntos usando OSRM
     * @param coordinates Lista de coordenadas [lng, lat]
     * @return RouteResponse con geometría, distancia y duración
     */
    public RouteResponse calculateRoute(List<double[]> coordinates) {
        try {
            // Construir URL con coordenadas
            StringBuilder coordString = new StringBuilder();
            for (int i = 0; i < coordinates.size(); i++) {
                double[] coord = coordinates.get(i);
                coordString.append(coord[0]).append(",").append(coord[1]);
                if (i < coordinates.size() - 1) {
                    coordString.append(";");
                }
            }
            
            String url = OSRM_URL + coordString.toString() + 
                        "?overview=full&geometries=geojson&steps=true";
            
            // Hacer petición
            String response = restTemplate.getForObject(url, String.class);
            JsonNode root = objectMapper.readTree(response);
            
            // Parsear respuesta
            JsonNode route = root.path("routes").get(0);
            JsonNode geometry = route.path("geometry");
            
            RouteResponse routeResponse = new RouteResponse();
            routeResponse.setDistance(route.path("distance").asDouble()); // metros
            routeResponse.setDuration(route.path("duration").asDouble()); // segundos
            routeResponse.setGeometry(geometry.toString());
            
            // Extraer coordenadas del path
            List<double[]> pathCoordinates = new ArrayList<>();
            JsonNode coords = geometry.path("coordinates");
            for (JsonNode coord : coords) {
                pathCoordinates.add(new double[]{
                    coord.get(0).asDouble(),
                    coord.get(1).asDouble()
                });
            }
            routeResponse.setCoordinates(pathCoordinates);
            
            return routeResponse;
            
        } catch (Exception e) {
            throw new RuntimeException("Error calculando ruta: " + e.getMessage(), e);
        }
    }
    
    /**
     * Calcula ruta entre origen y destino
     */
    public RouteResponse calculateSimpleRoute(double[] origin, double[] destination) {
        List<double[]> coordinates = new ArrayList<>();
        coordinates.add(origin);
        coordinates.add(destination);
        return calculateRoute(coordinates);
    }
    
    // Clase interna para la respuesta
    public static class RouteResponse {
        private double distance; // en metros
        private double duration; // en segundos
        private String geometry; // GeoJSON geometry
        private List<double[]> coordinates;
        
        // Getters y Setters
        public double getDistance() { return distance; }
        public void setDistance(double distance) { this.distance = distance; }
        
        public double getDuration() { return duration; }
        public void setDuration(double duration) { this.duration = duration; }
        
        public String getGeometry() { return geometry; }
        public void setGeometry(String geometry) { this.geometry = geometry; }
        
        public List<double[]> getCoordinates() { return coordinates; }
        public void setCoordinates(List<double[]> coordinates) { 
            this.coordinates = coordinates; 
        }
    }
}