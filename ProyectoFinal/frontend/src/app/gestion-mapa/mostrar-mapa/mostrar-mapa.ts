import { Component } from '@angular/core';
import * as L from 'leaflet';
import * as turf from '@turf/turf';
@Component({
  selector: 'app-mostrar-mapa',
  imports: [],
  templateUrl: './mostrar-mapa.html',
  styleUrl: './mostrar-mapa.css'
})
export class MostrarMapa {
  map!: L.Map;

  ngAfterViewInit(): void {
    // 1️⃣ Crear mapa
    this.map = L.map('map').setView([5.5, -73.4], 8);

    // 2️⃣ Capa base
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    // 3️⃣ Cargar archivo GeoJSON local
    fetch('boyaca_4326.geojson')
      .then(res => res.json())
      .then(boyacaGeoJSON => {
        // Crear polígono mundial
        const world = turf.polygon([
          [[-180, -90], [-180, 90], [180, 90], [180, -90], [-180, -90]]
        ]);

        // Crear máscara (opcional)
        // const mask = turf.difference(turf.featureCollection([world, boyacaGeoJSON.features[0]]));

        // Dibujar Boyacá
        const boyacaLayer = L.geoJSON(boyacaGeoJSON, {
          style: {
            color: 'red',
            weight: 2,
            fillOpacity: 0.1
          }
        }).addTo(this.map);

        // Ajustar zoom al departamento
        this.map.fitBounds(boyacaLayer.getBounds());
      })
      .catch(err => console.error('Error cargando GeoJSON:', err));
  }


}
