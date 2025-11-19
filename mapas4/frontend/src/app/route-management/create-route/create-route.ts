import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouteService } from '../../services/route.service';

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
  selector: 'app-create-route',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-route.html',
  styleUrl: './create-route.css'
})
export class CreateRouteComponent implements OnInit {
  @Output() routeCalculated = new EventEmitter<any>();
  @Output() routeSaved = new EventEmitter<any>();

  locations: Location[] = [];
  selectedOrigin = '';
  selectedDestination = '';
  waypoints: string[] = [];
  routeName = '';
  routeInfo: any = null;
  error = '';
  isLoading = false;

  constructor(
    private http: HttpClient,
    private routeService: RouteService
  ) {}

  ngOnInit() {
    this.loadLocations();
  }

  loadLocations() {
    this.http.get<Location[]>('http://localhost:8035/location')
      .subscribe({
        next: (data) => {
          this.locations = data;
          console.log('Locations cargadas:', this.locations.length);
        },
        error: (err) => {
          console.error('Error cargando locations:', err);
          this.error = 'Error al cargar las ubicaciones';
        }
      });
  }

  addWaypoint() {
    this.waypoints.push('');
  }

  removeWaypoint(index: number) {
    this.waypoints.splice(index, 1);
  }

  canPreview(): boolean {
    return this.selectedOrigin !== '' && 
           this.selectedDestination !== '' && 
           this.selectedOrigin !== this.selectedDestination;
  }

  canSave(): boolean {
    return this.canPreview() && 
           this.routeName.trim() !== '' && 
           this.routeInfo !== null;
  }

  previewRoute() {
    if (!this.canPreview()) return;
    
    this.error = '';
    this.isLoading = true;
    
    const request = {
      originId: this.selectedOrigin,
      destinationId: this.selectedDestination,
      waypointIds: this.waypoints.filter(wp => wp !== '' && wp !== this.selectedOrigin && wp !== this.selectedDestination)
    };

    console.log('Calculando ruta con:', request);

    this.routeService.calculateRoute(request).subscribe({
      next: (response) => {
        console.log('Ruta calculada:', response);
        this.routeInfo = response;
        this.isLoading = false;
        this.routeCalculated.emit(response);
      },
      error: (err) => {
        this.isLoading = false;
        this.error = 'Error al calcular la ruta. Verifica que las ubicaciones tengan coordenadas válidas.';
        console.error('Error:', err);
      }
    });
  }

  saveRoute() {
    if (!this.canSave()) return;

    this.isLoading = true;
    this.error = '';

    const request = {
      name: this.routeName,
      originId: this.selectedOrigin,
      destinationId: this.selectedDestination,
      waypointIds: this.waypoints.filter(wp => wp !== '' && wp !== this.selectedOrigin && wp !== this.selectedDestination)
    };

    console.log('Guardando ruta:', request);

    this.routeService.createRouteFromCalculation(request).subscribe({
      next: (route) => {
        console.log('Ruta guardada:', route);
        this.isLoading = false;
        alert('✅ Ruta guardada exitosamente!');
        this.routeSaved.emit(route);
        this.resetForm();
      },
      error: (err) => {
        this.isLoading = false;
        this.error = 'Error al guardar la ruta: ' + (err.error?.message || err.message);
        console.error('Error:', err);
      }
    });
  }

  formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes} minutos`;
  }

  resetForm() {
    this.routeName = '';
    this.selectedOrigin = '';
    this.selectedDestination = '';
    this.waypoints = [];
    this.routeInfo = null;
    this.error = '';
  }

  clearRoute() {
    this.routeInfo = null;
    this.routeCalculated.emit(null);
  }
}