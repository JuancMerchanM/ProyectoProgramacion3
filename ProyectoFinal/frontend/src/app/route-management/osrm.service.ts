import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Point } from 'app/interfaces/Point.interface';

export interface OSRMResponse {
  code: string;
  routes: Array<{
    distance: number;
    duration: number;
    geometry: {
      type: string;
      coordinates: number[][];
    };
  }>;
}

export interface RouteCalculation {
  distance: number;
  duration: number;
  geometry: string;
  coordinates: number[][];
  nearbyPoints?: Point[];
}

@Injectable({
  providedIn: 'root'
})
export class OsrmService {
  private readonly OSRM_URL = 'https://router.project-osrm.org/route/v1/driving/';
  private readonly NEARBY_DISTANCE_KM = 2.0; // 2km de distancia máxima

  constructor(private http: HttpClient) {}

  /**
   * Calcula una ruta usando OSRM
   * @param coordinates Array de [lng, lat]
   */
  calculateRoute(coordinates: number[][]): Observable<RouteCalculation> {
    // Construir la URL con las coordenadas
    const coordString = coordinates
      .map(coord => `${coord[0]},${coord[1]}`)
      .join(';');
    
    const url = `${this.OSRM_URL}${coordString}?overview=full&geometries=geojson&steps=true`;

    // IMPORTANTE: No enviar headers de autenticación a OSRM (servicio público)
    return this.http.get<OSRMResponse>(url, {
      headers: {} // Sin headers para evitar problemas de CORS
    }).pipe(
      map(response => {
        if (response.code !== 'Ok' || !response.routes || response.routes.length === 0) {
          throw new Error('No se pudo calcular la ruta');
        }

        const route = response.routes[0];
        
        return {
          distance: route.distance,
          duration: route.duration,
          geometry: JSON.stringify(route.geometry),
          coordinates: route.geometry.coordinates
        };
      })
    );
  }

  /**
   * Calcula una ruta simple entre dos puntos
   */
  calculateSimpleRoute(origin: number[], destination: number[]): Observable<RouteCalculation> {
    return this.calculateRoute([origin, destination]);
  }

  /**
   * Encuentra puntos cercanos a la ruta calculada
   * @param routeCoordinates Coordenadas de la ruta [lng, lat]
   * @param allPoints Todos los puntos disponibles
   * @param selectedPointIds IDs de puntos ya seleccionados (para excluirlos)
   */
  findNearbyPoints(
    routeCoordinates: number[][], 
    allPoints: Point[], 
    selectedPointIds: number[]
  ): Point[] {
    console.log('🔍 findNearbyPoints - Iniciando búsqueda');
    console.log('Coordenadas de ruta:', routeCoordinates.length);
    console.log('Total puntos disponibles:', allPoints.length);
    console.log('Puntos a excluir:', selectedPointIds);

    const nearbyPoints: Point[] = [];
    let pointsChecked = 0;

    for (const point of allPoints) {
      pointsChecked++;
      
      // Excluir puntos ya seleccionados en la ruta
      if (selectedPointIds.includes(point.id!)) {
        console.log(`⏭️ Saltando punto seleccionado: ${point.name}`);
        continue;
      }

      const geo = point.location;
      if (!geo || !geo.lat || !geo.lng) {
        console.log(`⚠️ Punto sin ubicación: ${point.name}`);
        continue;
      }

      let minDistance = Number.MAX_VALUE;

      // Calcular distancia mínima a cualquier punto de la ruta
      for (const routePoint of routeCoordinates) {
        const distance = this.calculateDistance(
          geo.lat, geo.lng,
          routePoint[1], routePoint[0] // routePoint es [lng, lat]
        );

        if (distance < minDistance) {
          minDistance = distance;
        }
      }

      // Si está a menos de NEARBY_DISTANCE_KM, agregarlo
      if (minDistance <= this.NEARBY_DISTANCE_KM) {
        console.log(`✅ Punto cercano encontrado: ${point.name} a ${minDistance.toFixed(2)}km`);
        nearbyPoints.push(point);
      }
    }

    console.log(`📊 Resultado: ${nearbyPoints.length} puntos cercanos de ${pointsChecked} verificados`);
    return nearbyPoints;
  }

  /**
   * Calcula distancia entre dos puntos geográficos usando fórmula Haversine
   * @returns Distancia en kilómetros
   */
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radio de la Tierra en km

    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);

    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}