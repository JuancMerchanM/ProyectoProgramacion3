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

  // Íconos con DivIcon (SVG personalizado)
  private divIcons: Record<string, L.DivIcon> = {
    CASCADA: this.createDivIcon('categories/CASCADA.png'),
    SENDERO: this.createDivIcon('categories/sendero.png'),
    MONTAÑA: this.createDivIcon('categories/montana.png'),
    MIRADOR: this.createDivIcon('categories/mirador.png'),
    MUSEO: this.createDivIcon('categories/museo.png'),
    LAGUNA: this.createDivIcon('categories/lago.png'),
    SITIO_HISTORICO: this.createDivIcon('categories/sitioHistorico.png'),
    PARQUE: this.createDivIcon('categories/parque.png'),
    RELIGIOSO: this.createDivIcon('categories/religion.png'),
    DEFAULT_DIV: this.createDivIcon('categories/other.png'),
  };

  // Íconos con Icon (imágenes PNG directas)
  private pngIcons: Record<string, L.Icon> = {
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

  // Método para crear SVG personalizado (DivIcon)
  private getSvg(iconSrc: string): string {
    return `
  <svg viewBox="0 0 100 140" width="40" height="56">
    <circle cx="50" cy="50" r="45" fill="#001A8E"/>
    <circle cx="50" cy="50" r="38" fill="white"/>
    <image href="${iconSrc}" x="25" y="25" width="50" height="50"/>
    <polygon points="50,140 20,80 80,80" fill="#001A8E"/>
  </svg>`;
  }

  private createDivIcon(url: string): L.DivIcon {
    return L.divIcon({
      html: this.getSvg(url),
      className: '',
      iconSize: [40, 56],
      iconAnchor: [20, 56],
      popupAnchor: [0, -56]
    });
  }

  // Método para crear ícono PNG directo
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

  /**
   * Agrega un punto al mapa
   * @param point Punto a agregar
   * @param useDivIcon Si es true, usa DivIcon (SVG), si es false usa Icon (PNG)
   */
  addPoint(point: Point, useDivIcon: boolean = true) {
    let icon: L.Icon | L.DivIcon;

    if (useDivIcon) {
      icon = this.divIcons[point.category] ?? this.divIcons['DEFAULT_DIV'];
    } else {
      icon = this.pngIcons[point.category] ?? this.pngIcons['DEFAULT'];
    }

    const marker = L.marker([point.location.lat, point.location.lng], { icon })
      .addTo(this.map)
      .bindPopup(point.name);

    marker.on('click', () => {
      console.log(point);
      this.selectedPoint.set(point);
    });

    // Guardar el marcador en el array y en el mapa
    this.allMarkers.push(marker);
    if (point.id) {
      this.markerMap.set(point.id, marker);
    }
  }

  /**
   * Agrega múltiples puntos al mapa
   * @param points Array de puntos
   * @param useDivIcon Si es true, usa DivIcon (SVG), si es false usa Icon (PNG)
   */
  addPoints(points: Point[], useDivIcon: boolean = true) {
    points.forEach(p => this.addPoint(p, useDivIcon));
  }

  /**
   * Elimina todos los marcadores del mapa
   */
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

  // Métodos HTTP para obtener puntos
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