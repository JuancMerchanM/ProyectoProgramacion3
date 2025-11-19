package com.Uptc.ProyectoFinal.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

@Entity
@Table(name = "locations")
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private LocationCategory category;

    @Column(nullable = false)
    private String municipality;

    @Column(length = 120)
    private String image;

    @Column(length = 255)
    private String link;

    @Column(precision = 2)
    private Double rating;

    // --- Datos geográficos ---
    @Embedded
    private GeoLocation location;

    // --- Metadatos ---
    @Column(name = "created_at", updatable = false, insertable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = true)
    private LocalDateTime updatedAt;

    // --- Relaciones calculadas (no persistidas) ---
    @Transient
    private Integer routesCount;

    @Transient
    private Integer favoritesCount;

    // --- Getters y Setters ---
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocationCategory getCategory() {
        return category;
    }

    public void setCategory(LocationCategory category) {
        this.category = category;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public GeoLocation getLocation() {
        return location;
    }

    public void setLocation(GeoLocation location) {
        this.location = location;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Integer getRoutesCount() {
        return routesCount;
    }

    public void setRoutesCount(Integer routesCount) {
        this.routesCount = routesCount;
    }

    public Integer getFavoritesCount() {
        return favoritesCount;
    }

    public void setFavoritesCount(Integer favoritesCount) {
        this.favoritesCount = favoritesCount;
    }

    public String getMunicipality() {
        return municipality;
    }

    public void setMunicipality(String municipality) {
        this.municipality = municipality;
    }

    @Override
    public String toString() {
        return "Location [id=" + id + ", name=" + name + ", category=" + category + ", municipality=" + municipality
                + ", image=" + image + ", link=" + link + ", rating=" + rating + ", location=" + location
                + ", createdAt=" + createdAt + ", updatedAt=" + updatedAt + ", routesCount=" + routesCount
                + ", favoritesCount=" + favoritesCount + "]";
    }

}
