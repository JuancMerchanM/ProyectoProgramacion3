import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from 'app/authentication/authentication-service';
import { LoggedInUser } from 'app/interfaces/LoggedInUser.interface';
import { ShowMap } from 'app/map-management/show-map/show-map';
import { ListPosts } from 'app/post-management/list-posts/list-posts';
import { CreateRoute } from 'app/route-management/create-route/create-route';
import { UserList } from 'app/user-management/user-list/user-list';
import { ListRoutes, RouteAction } from 'app/route-management/list-routes/list-routes';
import { Route, RouteService } from 'app/route-management/route-service';
import { SimpleRoute } from 'app/interfaces/SimpleRoute.interface';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';


import { MapService } from 'app/map-management/map-service';
import { OsrmService } from 'app/route-management/osrm.service';
@Component({
  selector: 'app-home',
  imports: [CommonModule, ShowMap, UserList, ListPosts, CreateRoute],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit, OnDestroy {
  @ViewChild(CreateRoute) createRouteComponent!: CreateRoute;
  
  panelOpen = false;
  activePanel: string | null = null;
  user: LoggedInUser | null = null;
  userRoutes: SimpleRoute[] = [];
  fullRoutes: Route[] = [];
  routeIdMap: Map<string, string> = new Map();
  
  private routesSubscription?: Subscription;
  
  constructor(
    private authService: AuthenticationService,
    private routeService: RouteService,
    private mapService: MapService,
    private osrmService: OsrmService
  ) {
    this.user = this.authService.user();
  }

  ngOnInit() {
    this.loadUserRoutes();
    
    this.routesSubscription = this.routeService.routesChanged$.subscribe(() => {
      console.log('ðŸ”” NotificaciÃ³n de cambio recibida, recargando rutas...');
      this.loadUserRoutes();
    });
  }

  ngOnDestroy() {
    if (this.routesSubscription) {
      this.routesSubscription.unsubscribe();
    }
  }

  loadUserRoutes() {
    console.log('ðŸ”„ Cargando rutas del usuario...');
    this.routeService.getUserRoutes().subscribe({
      next: (routes) => {
        console.log('ðŸ“¦ Rutas recibidas del backend:', routes);
        
        this.fullRoutes = routes;
        this.routeIdMap.clear();
        
        this.userRoutes = routes.map(route => {
          this.routeIdMap.set(route.name, route.id);
          
          return {
            name: route.name,
            date: this.formatDate(route.createdAt),
            privacy: route.isPublic ? 'PÃºblica' : 'Privada',
            distance: Math.round(route.distance / 1000),
            spots: route.numPoints || 0
          };
        });
        console.log('âœ… Rutas convertidas:', this.userRoutes);
      },
      error: (err) => {
        console.error('âŒ Error al cargar rutas:', err);
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  togglePanel(panel: string) {
    if (this.activePanel === panel) {
      this.panelOpen = !this.panelOpen;
    } else {
      this.panelOpen = true;
      this.activePanel = panel;
    }
  }

  onRouteAction(event: RouteAction) {
    console.log('ðŸŽ¬ Home - AcciÃ³n recibida:', event);
    
    switch(event.action) {
      case 'view':
        this.viewRoute(event.route);
        break;
      case 'edit':
        this.editRoute(event.route);
        break;
      case 'delete':
        this.deleteRoute(event.route);
        break;
    }
  }

  viewRoute(route: SimpleRoute) {
    console.log('ðŸ‘ï¸ Ver ruta:', route.name);
    
    const routeId = this.routeIdMap.get(route.name);
    
    if (!routeId) {
      console.error('âŒ No se encontrÃ³ el ID para la ruta:', route.name);
      return;
    }

    // Cerrar el panel para ver mejor el mapa
    this.panelOpen = false;

    this.routeService.getRouteById(routeId).subscribe({
      next: (fullRoute) => {
        console.log('ðŸ“ Ruta completa obtenida:', fullRoute);
        
        // Extraer coordenadas de los puntos
        const coordinates = fullRoute.points.map(point => [
          point.location.lng,
          point.location.lat
        ]);

        // Recalcular la ruta con OSRM para obtener la geometrÃ­a
        this.osrmService.calculateRoute(coordinates).subscribe({
          next: (routeCalculation) => {
            const map = this.mapService.getMap();
            
            // Dibujar la ruta en el mapa
            this.routeService.drawRouteOnMap(
              map,
              routeCalculation.geometry,
              routeCalculation.coordinates,
              [], // Sin puntos cercanos
              {
                origin: fullRoute.points[0],
                destination: fullRoute.points[fullRoute.points.length - 1],
                waypoints: fullRoute.points.slice(1, -1)
              }
            );

            // Mostrar marcadores solo de los puntos de la ruta
            this.mapService.clearAllMarkers();
            this.mapService.addPoints(fullRoute.points);

            console.log('âœ… Ruta dibujada en el mapa');
          },
          error: (err) => {
            console.error('âŒ Error al calcular geometrÃ­a:', err);
            alert('Error al dibujar la ruta en el mapa');
          }
        });
      },
      error: (err) => {
        console.error('âŒ Error al obtener ruta:', err);
        alert('Error al cargar la ruta');
      }
    });
  }

  editRoute(route: SimpleRoute) {
    console.log('âœï¸ Editar ruta:', route.name);
    
    const routeId = this.routeIdMap.get(route.name);
    
    if (!routeId) {
      console.error('âŒ No se encontrÃ³ el ID para la ruta:', route.name);
      return;
    }

    // Obtener la ruta completa
    this.routeService.getRouteById(routeId).subscribe({
      next: (fullRoute) => {
        console.log('ðŸ“ Cargando ruta para ediciÃ³n:', fullRoute);
        
        // Abrir el panel de crear ruta
        this.togglePanel('createRoute');
        
        // Esperar a que el componente se renderice
        setTimeout(() => {
          if (this.createRouteComponent) {
            this.createRouteComponent.loadRouteForEdit(fullRoute);
          }
        }, 100);
      },
      error: (err) => {
        console.error('âŒ Error al cargar ruta para ediciÃ³n:', err);
        alert('Error al cargar la ruta para ediciÃ³n');
      }
    });
  }

  deleteRoute(route: SimpleRoute) {
    console.log('ðŸ—‘ï¸ Eliminar ruta:', route.name);
    
    const routeId = this.routeIdMap.get(route.name);
    
    if (!routeId) {
      console.error('âŒ No se encontrÃ³ el ID para la ruta:', route.name);
      return;
    }
    
    if (confirm(`Â¿EstÃ¡s seguro de que deseas eliminar la ruta "${route.name}"?\n\nEsta acciÃ³n no se puede deshacer.`)) {
      this.routeService.deleteRoute(routeId).subscribe({
        next: () => {
          console.log('âœ… Ruta eliminada exitosamente');
          alert(`La ruta "${route.name}" ha sido eliminada.`);
        },
        error: (err) => {
          console.error('âŒ Error al eliminar ruta:', err);
          alert('Error al eliminar la ruta. Por favor intenta de nuevo.');
        }
      });
    }
  }

  onCreateRouteClick() {
    console.log('âž• Crear nueva ruta');
    this.togglePanel('createRoute');
  }

  filterCategory(category: string) {
    console.log("Filtrando por " + category);
  }

  logout() {
    this.authService.logout();
  }
}