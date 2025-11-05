import { Component } from '@angular/core';
import * as L from 'leaflet';
@Component({
  selector: 'app-mostrar-mapa',
  imports: [],
  templateUrl: './mostrar-mapa.html',
  styleUrl: './mostrar-mapa.css'
})
export class MostrarMapa {
  map!: L.Map;

  ngOnInit(): void {
    this.map = L.map('map').setView([5.825, -73.034], 13); // Centro Duitama

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);
  }
}
