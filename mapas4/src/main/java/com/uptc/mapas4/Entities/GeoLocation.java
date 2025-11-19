package com.uptc.mapas4.Entities;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class GeoLocation {

    @Column(nullable = false)
    private Double lat;
    @Column(nullable = false)
    private Double lng;
    
    private Double altitude; // Optional

    public GeoLocation() {}

    public GeoLocation(Double lat, Double lng, Double altitude) {
        this.lat = lat;
        this.lng = lng;
        this.altitude = altitude;
    }

    public Double getLat() { return lat; }
    public void setLat(Double lat) { this.lat = lat; }

    public Double getLng() { return lng; }
    public void setLng(Double lng) { this.lng = lng; }

    public Double getAltitude() { return altitude; }
    public void setAltitude(Double altitude) { this.altitude = altitude; }
}
