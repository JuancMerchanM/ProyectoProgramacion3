import { HttpClient } from '@angular/common/http';
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

  private icons: Record<string, L.DivIcon> = {
    CASCADA: this.createIcon('categories/cascada.png'),
    SENDERO: this.createIcon('categories/sendero.png'),
    MONTAÑA: this.createIcon('categories/montana.png'),
    MIRADOR : this.createIcon('categories/mirador.png'),
    MUSEO: this.createIcon('categories/museo.png'),
    LAGUNA: this.createIcon('categories/lago.png'),
    SITIO_HISTORICO: this.createIcon('categories/sitioHistorico.png'),
    PARQUE: this.createIcon('categories/parque.png'),
    RELIGIOSO: this.createIcon('categories/religion.png'),
    DEFAULT: this.createIcon('categories/other.png'),
  };

  constructor(private http: HttpClient) { }

  setMap(map: L.Map) {
    this.map = map;
  }

  getMap(): L.Map {
    return this.map;
  }

  private getSvg(iconSrc: string): string {
    return `
  <svg viewBox="0 0 100 140" width="40" height="56">
    <circle cx="50" cy="50" r="45" fill="#001A8E"/>
    <circle cx="50" cy="50" r="38" fill="white"/>
    <image href="${iconSrc}" x="25" y="25" width="50" height="50"/>
    <polygon points="50,140 20,80 80,80" fill="#001A8E"/>
  </svg>`;
  }

  private createIcon(url: string): L.DivIcon {
    return L.divIcon({
      html: this.getSvg(url),
      className: '',
      iconSize: [40, 56]
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
  }

  addPoints(points: Point[]) {
    points.forEach(p => this.addPoint(p));
  }

  getAll(): Observable<Point[]> {
    return this.http.get<Point[]>(`${this.baseUrl}/`);
  }
}
