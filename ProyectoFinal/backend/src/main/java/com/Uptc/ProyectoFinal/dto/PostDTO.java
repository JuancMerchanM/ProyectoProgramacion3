package com.Uptc.ProyectoFinal.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.Uptc.ProyectoFinal.entity.*;

public class PostDTO {
    private String id;
    private RouteInfo route;
    private String description;
    private boolean isActive;
    private Double rating;
    private LocalDateTime publishedAt;

    // Constructor vacío
    public PostDTO() {}

    // Getters y Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public RouteInfo getRoute() {
        return route;
    }

    public void setRoute(RouteInfo route) {
        this.route = route;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public LocalDateTime getPublishedAt() {
        return publishedAt;
    }

    public void setPublishedAt(LocalDateTime publishedAt) {
        this.publishedAt = publishedAt;
    }

    // Clase interna para RouteInfo
    public static class RouteInfo {
        private String id;
        private String name;
        private double distance;
        private int numPoints;
        private List<Location> points;
        private UserInfo createdBy;

        // Constructor vacío
        public RouteInfo() {}

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

        public double getDistance() {
            return distance;
        }

        public void setDistance(double distance) {
            this.distance = distance;
        }

        public int getNumPoints() {
            return numPoints;
        }

        public void setNumPoints(int numPoints) {
            this.numPoints = numPoints;
        }

        public List<Location> getPoints() {
            return points;
        }

        public void setPoints(List<Location> points) {
            this.points = points;
        }

        public UserInfo getCreatedBy() {
            return createdBy;
        }

        public void setCreatedBy(UserInfo createdBy) {
            this.createdBy = createdBy;
        }
    }

    // Clase interna para UserInfo
    public static class UserInfo {
        private String username;
        private String email;

        // Constructor vacío
        public UserInfo() {}

        // Constructor con parámetros
        public UserInfo(String username, String email) {
            this.username = username;
            this.email = email;
        }

        // Getters y Setters
        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }
    }
}