import { Component } from '@angular/core';
import * as L from 'leaflet';
import * as turf from '@turf/turf';
import { MapService } from '../map-service';
@Component({
  selector: 'app-show-map',
  imports: [],
  templateUrl: './show-map.html',
  styleUrl: './show-map.css'
})
export class ShowMap {
  map!: L.Map;

  constructor(private mapService: MapService) { }

  ngAfterViewInit(): void {
    this.map = L.map('map').setView([5.5, -73.4], 8);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    fetch('boyaca_4326.geojson')
      .then(res => res.json())
      .then(boyacaGeoJSON => {

        const boyacaLayer = L.geoJSON(boyacaGeoJSON, {
          style: {
            color: 'red',
            weight: 2,
            fillOpacity: 0.1
          }
        }).addTo(this.map);

        this.map.fitBounds(boyacaLayer.getBounds());

        this.mapService.setMap(this.map);

        this.mapService.getAll().subscribe(points => {
          this.mapService.addPoints(points);
        });
      })
      .catch(err => console.error('Error cargando GeoJSON:', err));
  }


}
