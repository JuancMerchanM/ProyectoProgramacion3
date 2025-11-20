import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import L from 'leaflet';
import { Observable } from 'rxjs';

export interface RouteCalculationRequest {
  originId: string;
  destinationId: string;
  waypointIds?: string[];
}

export interface RouteCreationRequest {
  name: string;
  originId: string;
  destinationId: string;
  waypointIds?: string[];
}

export interface RouteResponse {
  distance: number;
  duration: number;
  geometry: string;
  coordinates: number[][];
}

export interface Route {
  id: string;
  name: string;
  distance: number;
  duration: number;
  path: string;
  numPoints: number;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class RouteService {
  private baseUrl = 'http://localhost:8035/routes';
  private routeLayer: L.Polyline | null = null;

  constructor(private http: HttpClient) {}

  calculateRoute(request: RouteCalculationRequest): Observable<RouteResponse> {
    return this.http.post<RouteResponse>(`${this.baseUrl}/calculate`, request);
  }

  createFromCalculation(request: RouteCreationRequest): Observable<Route> {
    return this.http.post<Route>(`${this.baseUrl}/create-from-calculation`, request);
  }

  getUserRoutes(): Observable<Route[]> {
    return this.http.get<Route[]>(this.baseUrl);
  }

  getRouteById(id: string): Observable<Route> {
    return this.http.get<Route>(`${this.baseUrl}/${id}`);
  }

  deleteRoute(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  drawRouteOnMap(map: L.Map, routeResponse: RouteResponse) {
    // Limpiar ruta anterior si existe
    this.clearRouteFromMap(map);

    // Parsear la geometría GeoJSON
    const geometry = JSON.parse(routeResponse.geometry);
    const coordinates = geometry.coordinates;

    // Convertir coordenadas [lng, lat] a [lat, lng] para Leaflet
    const latLngs: L.LatLngExpression[] = coordinates.map((coord: number[]) => [coord[1], coord[0]]);

    // Crear y agregar la polyline al mapa
    this.routeLayer = L.polyline(latLngs, {
      color: '#3b82f6',
      weight: 5,
      opacity: 0.7
    }).addTo(map);

    // Ajustar el mapa para mostrar toda la ruta
    map.fitBounds(this.routeLayer.getBounds(), { padding: [50, 50] });
  }

  clearRouteFromMap(map: L.Map) {
    if (this.routeLayer) {
      map.removeLayer(this.routeLayer);
      this.routeLayer = null;
    }
  }
}