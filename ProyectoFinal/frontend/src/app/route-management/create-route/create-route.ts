import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MapService } from 'app/map-management/map-service';
import { Route, RouteService } from '../route-service';
import { OsrmService, RouteCalculation } from '../osrm.service';
import { Point } from 'app/interfaces/Point.interface';

@Component({
  selector: 'app-create-route',
  imports: [FormsModule, CommonModule],
  templateUrl: './create-route.html',
  styleUrl: './create-route.css'
})
export class CreateRoute implements OnInit {
loadRouteForEdit(fullRoute: Route) {
  console.log('📝 Cargando ruta para edición:', fullRoute);
  console.log('🔑 ID recibido:', fullRoute.id);
  
  // 1. PRIMERO guardar el ID (antes de cualquier otra cosa)
  this.editingRouteId = fullRoute.id;
  
  // 2. Limpiar estado SIN llamar a resetForm()
  this.routeName = '';
  this.originPoint = null;
  this.destinationPoint = null;
  this.waypointPoints = [];
  this.calculatedRoute = null;
  this.distance = 0;
  this.duration = 0;
  this.nearbyPoints = [];
  
  // 3. Limpiar mapa
  const map = this.mapService.getMap();
  if (map) {
    this.routeService.clearRouteFromMap(map);
  }
  
  // 4. Cargar datos de la ruta
  this.routeName = fullRoute.name;
  
  if (!fullRoute.points || fullRoute.points.length === 0) {
    console.error('❌ La ruta no tiene puntos');
    return;
  }
  
  // 5. Asignar puntos
  this.originPoint = fullRoute.points[0];
  
  if (fullRoute.points.length > 1) {
    this.destinationPoint = fullRoute.points[fullRoute.points.length - 1];
  }
  
  if (fullRoute.points.length > 2) {
    this.waypointPoints = fullRoute.points.slice(1, -1);
  }
  
  console.log('✅ Datos cargados, editingRouteId:', this.editingRouteId);
  
  // 6. Calcular ruta
  if (this.originPoint && this.destinationPoint) {
    this.calculateRoute();
  }
}
  routeName: string = '';
  distance: number = 0;
  duration: number = 0;
  editingRouteId: string | null = null;
  
  // Puntos disponibles
  availablePoints: Point[] = [];
  filteredPoints: Point[] = [];
  
  // Puntos seleccionados
  originPoint: Point | null = null;
  destinationPoint: Point | null = null;
  waypointPoints: Point[] = [];
  
  // Filtro de categorÃ­a
  selectedCategory: string = '';
  categories = ['CASCADA', 'SENDERO', 'MONTAÃ‘A', 'MIRADOR', 'MUSEO', 'LAGUNA', 
                'SITIO_HISTORICO', 'PARQUE', 'RELIGIOSO', 'OTRO'];
  
  // Estado
  isCalculating: boolean = false;
  calculatedRoute: RouteCalculation | null = null;
  nearbyPoints: Point[] = [];

  constructor(
    private mapService: MapService,
    private routeService: RouteService,
    private osrmService: OsrmService
  ) {}

  ngOnInit() {
    // Cargar todos los puntos disponibles
    this.mapService.getAll().subscribe(points => {
      this.availablePoints = points;
      this.filteredPoints = [...points];
    });
  }

  // Filtrar puntos por categorÃ­a
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

  // Seleccionar punto automÃ¡ticamente
  selectPoint(point: Point) {
    console.log('ðŸŽ¯ Punto seleccionado:', point.name);

    // Si no hay origen, este es el origen
    if (!this.originPoint) {
      this.originPoint = point;
      console.log('âœ… Asignado como ORIGEN');
      return;
    }

    // Si ya hay origen pero no destino, este es el destino
    if (!this.destinationPoint) {
      this.destinationPoint = point;
      console.log('âœ… Asignado como DESTINO');
      // Calcular ruta automÃ¡ticamente
      this.calculateRoute();
      return;
    }

    // Si ya hay origen y destino, agregar como waypoint
    if (!this.waypointPoints.find(p => p.id === point.id)) {
      this.waypointPoints.push(point);
      console.log('âœ… Agregado como WAYPOINT');
      // Recalcular ruta con el nuevo waypoint
      this.calculateRoute();
    }
  }

  // Remover punto especÃ­fico
  removePoint(point: Point, type: 'origin' | 'destination' | 'waypoint', index?: number) {
    if (type === 'origin') {
      // Si removemos origen, destino pasa a ser origen
      this.originPoint = this.destinationPoint;
      this.destinationPoint = this.waypointPoints.length > 0 ? this.waypointPoints.shift()! : null;
    } else if (type === 'destination') {
      // Si removemos destino, Ãºltimo waypoint pasa a ser destino
      this.destinationPoint = this.waypointPoints.length > 0 ? this.waypointPoints.pop()! : null;
    } else if (type === 'waypoint' && index !== undefined) {
      this.waypointPoints.splice(index, 1);
    }

    // Recalcular si aÃºn hay origen y destino
    if (this.originPoint && this.destinationPoint) {
      this.calculateRoute();
    } else {
      this.clearCalculatedRoute();
    }
  }

  // Calcular ruta usando OSRM directamente
 calculateRoute() {
  if (!this.originPoint || !this.destinationPoint) {
    return;
  }

  this.isCalculating = true;

  // Construir array de coordenadas [lng, lat]
  const coordinates: number[][] = [];
  
  // Agregar origen
  coordinates.push([
    this.originPoint.location.lng,
    this.originPoint.location.lat
  ]);
  
  // Agregar waypoints
  this.waypointPoints.forEach(wp => {
    coordinates.push([
      wp.location.lng,
      wp.location.lat
    ]);
  });
  
  // Agregar destino
  coordinates.push([
    this.destinationPoint.location.lng,
    this.destinationPoint.location.lat
  ]);

  // Llamar a OSRM directamente desde el frontend
  this.osrmService.calculateRoute(coordinates).subscribe({
    next: (response) => {
      console.log('=== RUTA CALCULADA ===');
      
      this.calculatedRoute = response;
      this.distance = Math.round(response.distance / 1000 * 100) / 100;
      this.duration = Math.round(response.duration / 60);
      
      // Detectar puntos cercanos a la ruta
      const selectedIds = [
        this.originPoint!.id!,
        ...this.waypointPoints.map(wp => wp.id!),
        this.destinationPoint!.id!
      ];
      
      this.nearbyPoints = this.osrmService.findNearbyPoints(
        response.coordinates,
        this.availablePoints,
        selectedIds
      );
      
      console.log(`âœ… Encontrados ${this.nearbyPoints.length} puntos cercanos`);
      
      // ðŸŽ¯ NUEVA LÃ“GICA: Mantener solo marcadores relevantes
      const idsToKeep = [
        ...selectedIds,  // Puntos seleccionados
        ...this.nearbyPoints.map(p => p.id!)  // Puntos cercanos (naranjas)
      ];
      
      this.mapService.keepOnlyMarkers(idsToKeep);
      console.log('ðŸ—ºï¸ Marcadores filtrados - Solo visibles los relevantes');
      
      // Dibujar ruta en el mapa
      const map = this.mapService.getMap();
      this.routeService.drawRouteOnMap(
        map, 
        response.geometry, 
        response.coordinates,
        this.nearbyPoints,
        {
          origin: this.originPoint!,
          destination: this.destinationPoint!,
          waypoints: this.waypointPoints
        }
      );
      
      this.isCalculating = false;
    },
    error: (error) => {
      console.error('Error calculando ruta:', error);
      alert('Error al calcular la ruta. Verifica que los puntos sean accesibles.');
      this.isCalculating = false;
    }
  });
}
saveRoute() {
  if (!this.calculatedRoute || !this.routeName) {
    alert('Debes calcular la ruta y darle un nombre');
    return;
  }

  const pointIds: string[] = [];
  
  if (this.originPoint?.id) {
    pointIds.push(this.originPoint.id.toString());
  }
  
  this.waypointPoints.forEach(wp => {
    if (wp.id) {
      pointIds.push(wp.id.toString());
    }
  });
  
  if (this.destinationPoint?.id) {
    pointIds.push(this.destinationPoint.id.toString());
  }

  if (pointIds.length < 2) {
    alert('La ruta debe tener al menos un origen y un destino');
    return;
  }

  const request = {
    name: this.routeName.trim(),
    pointIds: pointIds,
    distance: this.calculatedRoute.distance,
    duration: this.calculatedRoute.duration,
    geometry: this.calculatedRoute.geometry
  };

  console.log('📤 Enviando petición:', request);
  console.log('🔑 editingRouteId:', this.editingRouteId);

  // ⭐ IMPORTANTE: Verificar si estamos editando
  if (this.editingRouteId !== null && this.editingRouteId !== '') {
    console.log('🔄 ACTUALIZANDO ruta existente:', this.editingRouteId);
    
    this.routeService.updateRoute(this.editingRouteId, request).subscribe({
      next: (route) => {
        console.log('✅ Ruta actualizada:', route);
        alert(`¡Ruta actualizada exitosamente! 🎉\n\nNombre: ${route.name}`);
        this.editingRouteId = null;
        this.resetForm();
      },
      error: (error) => {
        console.error('❌ Error actualizando:', error);
        alert('Error al actualizar la ruta.');
      }
    });
  } else {
    console.log('➕ CREANDO nueva ruta');
    
    this.routeService.createWithData(request).subscribe({
      next: (route) => {
        console.log('✅ Ruta creada:', route);
        alert(`¡Ruta guardada exitosamente! 🎉\n\nNombre: ${route.name}`);
        this.resetForm();
      },
      error: (error) => {
        console.error('❌ Error creando:', error);
        alert('Error al guardar la ruta.');
      }
    });
  }
}

// 5. Modifica resetForm para limpiar también el editingRouteId:


  // Limpiar ruta calculada
 clearCalculatedRoute() {
  this.calculatedRoute = null;
  this.distance = 0;
  this.duration = 0;
  this.nearbyPoints = [];
  const map = this.mapService.getMap();
  if (map) {
    this.routeService.clearRouteFromMap(map);
    
    // Restaurar todos los marcadores originales
    this.mapService.clearAllMarkers();
    this.mapService.addPoints(this.availablePoints);
    console.log('âœ… Marcadores originales restaurados');
  }
}

  // Resetear formulario
resetForm() {
  this.routeName = '';
  this.originPoint = null;
  this.destinationPoint = null;
  this.waypointPoints = [];
  this.editingRouteId = null;  // ← Esto borra el ID
  this.clearCalculatedRoute();
}
cancelEdit() {
  if (confirm('¿Estás seguro de cancelar la edición? Los cambios no guardados se perderán.')) {
    this.editingRouteId = null;
    this.resetForm();
    console.log('❌ Edición cancelada');
  }
}

  // Verificar si un punto estÃ¡ siendo usado
  isPointUsed(point: Point): boolean {
    return this.originPoint?.id === point.id || 
           this.destinationPoint?.id === point.id ||
           this.waypointPoints.some(p => p.id === point.id);
  }

  // Obtener el orden de un punto
  getPointOrder(point: Point): number {
    if (this.originPoint?.id === point.id) return 1;
    if (this.destinationPoint?.id === point.id) {
      return 2 + this.waypointPoints.length;
    }
    const waypointIndex = this.waypointPoints.findIndex(p => p.id === point.id);
    if (waypointIndex >= 0) return 2 + waypointIndex;
    return 0;
  }
}