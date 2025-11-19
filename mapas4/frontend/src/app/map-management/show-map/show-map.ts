import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';

interface Location {
  id: string;
  name: string;
  category: string;
  municipality: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

@Component({
  selector: 'app-show-map',
  standalone: true,
  templateUrl: './show-map.html',
  styleUrl: './show-map.css'
})
export class ShowMapComponent implements OnInit {
  map!: L.Map;
  currentRouteLayer?: L.Polyline;
  currentMarkersLayer: L.LayerGroup = L.layerGroup();
  locationsLayer: L.LayerGroup = L.layerGroup();
  locations: Location[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadLocations();
  }

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  initializeMap(): void {
    // Crear mapa centrado en Boyacá
    this.map = L.map('map').setView([5.5, -73.4], 9);

    // Capa base de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    // Agregar capas de marcadores
    this.locationsLayer.addTo(this.map);
    this.currentMarkersLayer.addTo(this.map);

    // Cargar GeoJSON de Boyacá (opcional)
    this.loadBoyacaBoundary();
  }

  loadBoyacaBoundary(): void {
    fetch('boyaca_4326.geojson')
      .then(res => res.json())
      .then(boyacaGeoJSON => {
        const boyacaLayer = L.geoJSON(boyacaGeoJSON, {
          style: {
            color: '#e74c3c',
            weight: 2,
            fillOpacity: 0.05,
            fillColor: '#e74c3c'
          }
        }).addTo(this.map);

        // Opcional: ajustar vista al departamento
        // this.map.fitBounds(boyacaLayer.getBounds());
      })
      .catch(err => console.warn('No se pudo cargar el GeoJSON de Boyacá:', err));
  }

  loadLocations(): void {
    this.http.get<Location[]>('http://localhost:8035/location')
      .subscribe({
        next: (data) => {
          this.locations = data;
          this.displayLocationMarkers();
          console.log('✅ Locations cargadas:', this.locations.length);
        },
        error: (err) => console.error('❌ Error cargando locations:', err)
      });
  }

  displayLocationMarkers(): void {
    if (!this.map) return;

    this.locationsLayer.clearLayers();

    this.locations.forEach(location => {
      if (location.location && location.location.latitude && location.location.longitude) {
        const marker = L.marker(
          [location.location.latitude, location.location.longitude],
          {
            icon: this.getIconByCategory(location.category)
          }
        );

        marker.bindPopup(`
          <div style="min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; color: #2c3e50;">${location.name}</h3>
            <p style="margin: 4px 0; color: #7f8c8d;">
              <strong>Categoría:</strong> ${this.translateCategory(location.category)}
            </p>
            <p style="margin: 4px 0; color: #7f8c8d;">
              <strong>Municipio:</strong> ${location.municipality}
            </p>
          </div>
        `);

        this.locationsLayer.addLayer(marker);
      }
    });

    console.log('📍 Marcadores mostrados:', this.locations.length);
  }

  getIconByCategory(category: string): L.Icon {
    const iconMap: { [key: string]: string } = {
      'WATER_ATTRACTION': 'blue',
      'WATERFALL': 'blue',
      'LAKE': 'blue',
      'RESTAURANT': 'red',
      'HOTEL': 'orange',
      'VIEWPOINT': 'green',
      'MUSEUM': 'violet',
      'CHURCH': 'gold',
      'PARK': 'green',
      'MONUMENT': 'grey'
    };

    const color = iconMap[category] || 'grey';

    return L.icon({
      iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
  }

  translateCategory(category: string): string {
    const translations: { [key: string]: string } = {
      'WATER_ATTRACTION': 'Atracción Acuática',
      'WATERFALL': 'Cascada',
      'LAKE': 'Lago',
      'RESTAURANT': 'Restaurante',
      'HOTEL': 'Hotel',
      'VIEWPOINT': 'Mirador',
      'MUSEUM': 'Museo',
      'CHURCH': 'Iglesia',
      'PARK': 'Parque',
      'MONUMENT': 'Monumento'
    };
    return translations[category] || category;
  }

  /**
   * Dibuja una ruta en el mapa siguiendo las vías reales
   */
  displayRoute(routeData: any): void {
    if (!routeData) {
      this.clearRoute();
      return;
    }

    console.log('🗺️ Dibujando ruta en el mapa:', routeData);

    // Remover ruta anterior
    this.clearRoute();

    try {
      // Parsear geometría GeoJSON
      const geometry = JSON.parse(routeData.geometry);
      
      // Convertir coordenadas [lng, lat] a [lat, lng] para Leaflet
      const coordinates = geometry.coordinates.map((coord: number[]) => 
        [coord[1], coord[0]]
      );

      // Crear polyline con la ruta
      this.currentRouteLayer = L.polyline(coordinates, {
        color: '#3498db',
        weight: 5,
        opacity: 0.8,
        lineJoin: 'round',
        lineCap: 'round'
      }).addTo(this.map);

      // Agregar marcadores de inicio y fin
      if (coordinates.length > 0) {
        // Marcador de inicio (verde)
        const startMarker = L.marker(coordinates[0], {
          icon: L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34]
          })
        }).bindPopup('<strong>🚩 Inicio</strong>');

        // Marcador de fin (rojo)
        const endMarker = L.marker(coordinates[coordinates.length - 1], {
          icon: L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34]
          })
        }).bindPopup('<strong>🏁 Destino</strong>');

        this.currentMarkersLayer.addLayer(startMarker);
        this.currentMarkersLayer.addLayer(endMarker);
      }

      // Ajustar vista a la ruta
      this.map.fitBounds(this.currentRouteLayer.getBounds(), {
        padding: [50, 50]
      });

      console.log('✅ Ruta dibujada exitosamente');

    } catch (error) {
      console.error('❌ Error dibujando ruta:', error);
    }
  }

  /**
   * Limpia la ruta actual del mapa
   */
  clearRoute(): void {
    if (this.currentRouteLayer) {
      this.map.removeLayer(this.currentRouteLayer);
      this.currentRouteLayer = undefined;
    }
    
    this.currentMarkersLayer.clearLayers();
    
    console.log('🧹 Ruta limpiada del mapa');
  }

  /**
   * Filtra marcadores por categoría
   */
  filterByCategory(category: string): void {
    this.locationsLayer.clearLayers();

    const filtered = this.locations.filter(loc => 
      loc.category.toLowerCase().includes(category.toLowerCase())
    );

    filtered.forEach(location => {
      if (location.location && location.location.latitude && location.location.longitude) {
        const marker = L.marker(
          [location.location.latitude, location.location.longitude],
          { icon: this.getIconByCategory(location.category) }
        );

        marker.bindPopup(`
          <div style="min-width: 200px;">
            <h3 style="margin: 0 0 8px 0;">${location.name}</h3>
            <p style="margin: 4px 0;"><strong>Categoría:</strong> ${this.translateCategory(location.category)}</p>
            <p style="margin: 4px 0;"><strong>Municipio:</strong> ${location.municipality}</p>
          </div>
        `);

        this.locationsLayer.addLayer(marker);
      }
    });

    console.log(`🔍 Filtrados ${filtered.length} lugares por categoría: ${category}`);
  }

  /**
   * Muestra todos los marcadores
   */
  showAllMarkers(): void {
    this.displayLocationMarkers();
  }
}