import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Point } from 'app/interfaces/Point.interface';
import L from 'leaflet';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private baseUrl = 'http://localhost:8035/location';
  private map!: L.Map;
  selectedPoint = signal<Point | null>(null);
  
  private allMarkers: L.Marker[] = []; // Todos los marcadores del mapa
  private markerMap: Map<number, L.Marker> = new Map(); // Mapeo de ID a marcador

  private icons: Record<string, L.Icon> = {
    CASCADA: this.createIcon('categories/CASCADApoint.png'),
    SENDERO: this.createIcon('categories/SENDERO.png'),
    DEFAULT: this.createIcon('categories/CASCADApoint.png'),
  };

  constructor(private http: HttpClient) {}

  setMap(map: L.Map) {
    this.map = map;
  }

  getMap(): L.Map {
    return this.map;
  }

  private createIcon(url: string): L.Icon {
    return L.icon({
      iconUrl: url,
      iconSize: [40, 50],
      iconAnchor: [20, 50],
      popupAnchor: [0, -35]
    });
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  addPoint(point: Point) {
    const icon = this.icons[point.category] ?? this.icons['DEFAULT'];

    const marker = L.marker([point.location.lat, point.location.lng], { icon })
      .addTo(this.map)
      .bindPopup(point.name);

    marker.on('click', () => {
      console.log(point)
      this.selectedPoint.set(point);
    });

    // Guardar el marcador en el array y en el mapa
    this.allMarkers.push(marker);
    if (point.id) {
      this.markerMap.set(point.id, marker);
    }
  }

  addPoints(points: Point[]) {
    points.forEach(p => this.addPoint(p));
  }

  clearAllMarkers() {
    this.allMarkers.forEach(marker => {
      if (this.map) {
        this.map.removeLayer(marker);
      }
    });
    
    this.allMarkers = [];
    this.markerMap.clear();
    console.log('✅ Todos los marcadores eliminados del mapa');
  }

  /**
   * Mantiene solo los marcadores de los IDs especificados
   * @param keepIds IDs de los puntos que deben permanecer visibles
   */
  keepOnlyMarkers(keepIds: number[]) {
    console.log('🎯 Manteniendo solo marcadores de IDs:', keepIds);
    
    const markersToRemove: L.Marker[] = [];
    
    // Identificar marcadores a remover
    this.markerMap.forEach((marker, id) => {
      if (!keepIds.includes(id)) {
        markersToRemove.push(marker);
      }
    });
    
    // Remover marcadores del mapa
    markersToRemove.forEach(marker => {
      if (this.map) {
        this.map.removeLayer(marker);
      }
    });
    
    // Actualizar arrays
    this.allMarkers = this.allMarkers.filter(marker => 
      !markersToRemove.includes(marker)
    );
    
    // Limpiar del mapa de IDs
    this.markerMap.forEach((marker, id) => {
      if (!keepIds.includes(id)) {
        this.markerMap.delete(id);
      }
    });
    
    console.log(`✅ Se removieron ${markersToRemove.length} marcadores`);
    console.log(`📍 Quedan ${this.allMarkers.length} marcadores visibles`);
  }

  getAll(): Observable<Point[]> {
    return this.http.get<Point[]>(`${this.baseUrl}/`, {
      headers: this.getHeaders()
    });
  }

  getByCategory(category: string): Observable<Point[]> {
    return this.http.get<Point[]>(`${this.baseUrl}/category/${category}`, {
      headers: this.getHeaders()
    });
  }
}