package com.Uptc.ProyectoFinal.dto;
import java.time.LocalDateTime;
import java.util.List;
import com.Uptc.ProyectoFinal.entity.*;

public class RouteDTO {
    private String id;
    private String name;
    private Double distance;
    private Double duration;
    private Integer numPoints;
    private LocalDateTime createdAt;
    private boolean isPublic;
    private List<Location> points; // 👈 Incluye los puntos

    // Constructor vacío
    public RouteDTO() {}

    // Constructor completo
    public RouteDTO(String id, String name, Double distance, Double duration, 
                    Integer numPoints, LocalDateTime createdAt, boolean isPublic, 
                    List<Location> points) {
        this.id = id;
        this.name = name;
        this.distance = distance;
        this.duration = duration;
        this.numPoints = numPoints;
        this.createdAt = createdAt;
        this.isPublic = isPublic;
        this.points = points;
    }

    // Getters y Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getDistance() {
        return distance;
    }

    public void setDistance(Double distance) {
        this.distance = distance;
    }

    public Double getDuration() {
        return duration;
    }

    public void setDuration(Double duration) {
        this.duration = duration;
    }

    public Integer getNumPoints() {
        return numPoints;
    }

    public void setNumPoints(Integer numPoints) {
        this.numPoints = numPoints;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public boolean isPublic() {
        return isPublic;
    }

    public void setPublic(boolean isPublic) {
        this.isPublic = isPublic;
    }

    public List<Location> getPoints() {
        return points;
    }

    public void setPoints(List<Location> points) {
        this.points = points;
    }
}