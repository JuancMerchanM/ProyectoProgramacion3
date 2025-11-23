import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import L from 'leaflet';
import { Point } from 'app/interfaces/Point.interface';
export interface RouteCreationRequest {
  name: string;
  pointIds: string[];
  distance: number;
  duration: number;
  geometry: string;
}

export interface Route {
  id: string;
  name: string;
  distance: number;
  duration: number;
  path?: string;
  geometry?: string;
  numPoints: number;
  createdAt: string;
  isPublic: boolean;
  createdBy?: any;
  points: Point[];  // 👈 CORREGIDO: Array de puntos de la ruta
}

@Injectable({
  providedIn: 'root'
})
export class RouteService {

  //==============================
  //   URL BASE
  //==============================
  private baseUrl = 'http://localhost:8035/routes';

  //==============================
  //   LEAFLET / MAPA
  //==============================
  private routeLayer: L.Polyline | null = null;
  private nearbyMarkers: L.CircleMarker[] = [];

  //==============================
  //   SISTEMA DE NOTIFICACIÓN
  //==============================
  private routesChanged = new Subject<void>();
  public routesChanged$ = this.routesChanged.asObservable();

  constructor(private http: HttpClient) {}

  //==============================
  //   HEADERS CON TOKEN
  //==============================
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  //==============================
  //   CREATE
  //==============================
  createRoute(request: RouteCreationRequest): Observable<Route> {
    return this.http.post<Route>(`${this.baseUrl}/create-with-data`, request, {
      headers: this.getHeaders()
    }).pipe(
      tap(() => this.routesChanged.next())
    );
  }

  // Alias para mantener compatibilidad
  createWithData(request: RouteCreationRequest): Observable<Route> {
    return this.createRoute(request);
  }

  //==============================
  //   GET ALL ROUTES
  //==============================
  getUserRoutes(): Observable<Route[]> {
    return this.http.get<Route[]>(this.baseUrl, {
      headers: this.getHeaders()
    });
  }

  //==============================
  //   GET ROUTE BY ID
  //==============================
  getRouteById(id: string): Observable<Route> {
    return this.http.get<Route>(`${this.baseUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  //==============================
  //   UPDATE
  //==============================
  updateRoute(id: string, routeData: any): Observable<Route> {
    return this.http.put<Route>(`${this.baseUrl}/${id}`, routeData, {
      headers: this.getHeaders()
    }).pipe(
      tap(() => this.routesChanged.next())
    );
  }

  //==============================
  //   DELETE
  //==============================
  deleteRoute(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      tap(() => this.routesChanged.next())
    );
  }

  //==============================
  //   NOTIFICAR CAMBIOS MANUALMENTE
  //==============================
  notifyRoutesChanged(): void {
    this.routesChanged.next();
  }

  //==============================
  //   MAPA: DIBUJAR RUTA
  //==============================
  drawRouteOnMap(
    map: L.Map,
    geometry: string,
    coordinates: number[][],
    nearbyPoints?: Point[],
    p0?: { origin: Point; destination: Point; waypoints: Point[] }
  ) {

    console.log('🧭 Dibujando ruta...');
    this.clearRouteFromMap(map);

    const latLngs: L.LatLngExpression[] =
      coordinates.map(coord => [coord[1], coord[0]]);

    this.routeLayer = L.polyline(latLngs, {
      color: '#3b82f6',
      weight: 5,
      opacity: 0.7
    }).addTo(map);

    console.log('✔️ Ruta dibujada');

    //=========== MARCADORES DE PUNTOS CERCANOS ===========
    if (nearbyPoints && nearbyPoints.length > 0) {
      nearbyPoints.forEach(point => {

        const marker = L.circleMarker(
          [point.location.lat, point.location.lng],
          {
            radius: 8,
            fillColor: '#ff9800',
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
          }
        ).addTo(map);

        marker.bindPopup(`
          <div style="text-align:center;">
            <strong>${point.name}</strong><br>
            <small style="color:#ff9800">${point.category}</small>
          </div>
        `);

        this.nearbyMarkers.push(marker);
      });
    }

    map.fitBounds(this.routeLayer.getBounds(), { padding: [50, 50] });
  }

  //==============================
  //   LIMPIAR MAPA
  //==============================
  clearRouteFromMap(map: L.Map) {
    if (this.routeLayer) {
      map.removeLayer(this.routeLayer);
      this.routeLayer = null;
    }

    this.nearbyMarkers.forEach(marker => map.removeLayer(marker));
    this.nearbyMarkers = [];
  }
}