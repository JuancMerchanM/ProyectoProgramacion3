import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Point } from 'app/interfaces/Point.interface';
import L from 'leaflet';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private baseUrl = 'http://localhost:8035/location';
  private map!: L.Map;

  private icons: Record<string, L.Icon> = {
    MONTAÑA: this.createIcon('assets/icons/montana.png'),
    RIO: this.createIcon('assets/icons/rio.png'),
    PUEBLO: this.createIcon('assets/icons/pueblo.png'),
    DEFAULT: this.createIcon('assets/icons/default.png'),
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
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -35]
    });
  }

  addPoint(point: Point) {
    const icon = this.icons[point.category] ?? this.icons['DEFAULT'];

    const marker = L.marker([point.location.lat, point.location.lng], { icon })
      .addTo(this.map)
      .bindPopup(point.name);

    marker.on('click', () => {
      console.log('Clic en marcador:', point);
    });
  }

  addPoints(points: Point[]) {
    points.forEach(p => this.addPoint(p));
  }

  getAll(): Observable<Point[]> {
    return this.http.get<Point[]>(`${this.baseUrl}/`);
  }
}
