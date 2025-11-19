import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RouteCalculationRequest {
  originId: string;
  destinationId: string;
  waypointIds?: string[];
}

export interface RouteCalculationResponse {
  distance: number;
  duration: number;
  geometry: string;
  coordinates: number[][];
}

export interface CreateRouteRequest {
  name: string;
  originId: string;
  destinationId: string;
  waypointIds?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class RouteService {
  private apiUrl = 'http://localhost:8035/routes';

  constructor(private http: HttpClient) {}

  calculateRoute(request: RouteCalculationRequest): Observable<RouteCalculationResponse> {
    return this.http.post<RouteCalculationResponse>(`${this.apiUrl}/calculate`, request);
  }

  createRouteFromCalculation(request: CreateRouteRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-from-calculation`, request);
  }

  getUserRoutes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  deleteRoute(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}