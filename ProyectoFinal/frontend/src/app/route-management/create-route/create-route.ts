
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MapService } from 'app/map-management/map-service';
import { RouteService } from '../route-service';
import { Point } from 'app/interfaces/Point.interface';

@Component({
  selector: 'app-create-route',
  imports: [FormsModule, CommonModule],
  templateUrl: './create-route.html',
  styleUrl: './create-route.css'
})
export class CreateRoute implements OnInit {
  routeName: string = '';
  distance: number = 0;
  duration: number = 0;
  
  // Puntos disponibles
  availablePoints: Point[] = [];
  filteredPoints: Point[] = [];
  
  // Puntos seleccionados
  originPoint: Point | null = null;
  destinationPoint: Point | null = null;
  waypointPoints: Point[] = [];
  
  // Filtro de categoría
  selectedCategory: string = '';
  categories = ['CASCADA', 'SENDERO', 'MONTAÑA', 'MIRADOR', 'MUSEO', 'LAGUNA', 
                'SITIO_HISTORICO', 'PARQUE', 'RELIGIOSO', 'OTRO'];
  
  // Estado
  isCalculating: boolean = false;
  calculatedRoute: any = null;

  constructor(
    private mapService: MapService,
    private routeService: RouteService
  ) {}

  ngOnInit() {
    // Cargar todos los puntos disponibles
    this.mapService.getAll().subscribe(points => {
      this.availablePoints = points;
      this.filteredPoints = [...points];
    });
  }

  // Filtrar puntos por categoría
  filterByCategory(category: string) {
    if (this.selectedCategory === category) {
      this.selectedCategory = '';
      this.filteredPoints = [...this.availablePoints];
    } else {
      this.selectedCategory = category;
      this.filteredPoints = this.availablePoints.filter(
        p => p.category === category
      );
    }
  }

  // Seleccionar origen
  selectOrigin(point: Point) {
    this.originPoint = point;
    this.clearCalculatedRoute();
  }

  // Seleccionar destino
  selectDestination(point: Point) {
    this.destinationPoint = point;
    this.clearCalculatedRoute();
  }

  // Agregar punto intermedio
  addWaypoint(point: Point) {
    if (!this.waypointPoints.find(p => p.id === point.id)) {
      this.waypointPoints.push(point);
      this.clearCalculatedRoute();
    }
  }

  // Remover punto intermedio
  removeWaypoint(index: number) {
    this.waypointPoints.splice(index, 1);
    this.clearCalculatedRoute();
  }

  // Calcular ruta
  calculateRoute() {
    if (!this.originPoint || !this.destinationPoint) {
      alert('Debes seleccionar punto de partida y destino');
      return;
    }

    this.isCalculating = true;

    const request = {
      originId: this.originPoint.id!.toString(),
      destinationId: this.destinationPoint.id!.toString(),
      waypointIds: this.waypointPoints.map(p => p.id!.toString())
    };

    this.routeService.calculateRoute(request).subscribe({
      next: (response) => {
        this.calculatedRoute = response;
        this.distance = Math.round(response.distance / 1000 * 100) / 100; // km
        this.duration = Math.round(response.duration / 60); // minutos
        
        // Dibujar ruta en el mapa
        const map = this.mapService.getMap();
        this.routeService.drawRouteOnMap(map, response);
        
        this.isCalculating = false;
      },
      error: (error) => {
        console.error('Error calculando ruta:', error);
        alert('Error al calcular la ruta: ' + (error.error?.message || 'Error desconocido'));
        this.isCalculating = false;
      }
    });
  }

  // Guardar ruta calculada
  saveRoute() {
    if (!this.calculatedRoute || !this.routeName) {
      alert('Debes calcular la ruta y darle un nombre');
      return;
    }

    const request = {
      name: this.routeName,
      originId: this.originPoint!.id!.toString(),
      destinationId: this.destinationPoint!.id!.toString(),
      waypointIds: this.waypointPoints.map(p => p.id!.toString())
    };

    this.routeService.createFromCalculation(request).subscribe({
      next: (route) => {
        alert('Ruta guardada exitosamente: ' + route.name);
        this.resetForm();
      },
      error: (error) => {
        console.error('Error guardando ruta:', error);
        alert('Error al guardar la ruta: ' + (error.error?.message || 'Error desconocido'));
      }
    });
  }

  // Limpiar ruta calculada
  clearCalculatedRoute() {
    this.calculatedRoute = null;
    this.distance = 0;
    this.duration = 0;
    const map = this.mapService.getMap();
    if (map) {
      this.routeService.clearRouteFromMap(map);
    }
  }

  // Resetear formulario
  resetForm() {
    this.routeName = '';
    this.originPoint = null;
    this.destinationPoint = null;
    this.waypointPoints = [];
    this.clearCalculatedRoute();
  }

  // Verificar si un punto está siendo usado
  isPointUsed(point: Point): boolean {
    return this.originPoint?.id === point.id || 
           this.destinationPoint?.id === point.id ||
           this.waypointPoints.some(p => p.id === point.id);
  }
}