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
import { CreatePost } from 'app/post-management/create-post/create-post';
@Component({
  selector: 'app-home',
  imports: [CommonModule, ShowMap, UserList, ListPosts, CreateRoute, CreatePost],
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
  
  // Datos para publicar ruta
  publishingRoute: {
    id: string;
    name: string;
    distance: number;
    points: number;
  } | null = null;
  
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
      console.log('🔔 Notificación de cambio recibida, recargando rutas...');
      this.loadUserRoutes();
    });
  }

  ngOnDestroy() {
    if (this.routesSubscription) {
      this.routesSubscription.unsubscribe();
    }
  }

  loadUserRoutes() {
    console.log('🔄 Cargando rutas del usuario...');
    this.routeService.getUserRoutes().subscribe({
      next: (routes) => {
        console.log('📦 Rutas recibidas del backend:', routes);
        
        this.fullRoutes = routes;
        this.routeIdMap.clear();
        
        this.userRoutes = routes.map(route => {
          this.routeIdMap.set(route.name, route.id);
          
          return {
            name: route.name,
            date: this.formatDate(route.createdAt),
            privacy: route.isPublic ? 'Pública' : 'Privada',
            distance: Math.round(route.distance / 1000),
            spots: route.numPoints || 0
          };
        });
        console.log('✅ Rutas convertidas:', this.userRoutes);
      },
      error: (err) => {
        console.error('❌ Error al cargar rutas:', err);
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
    console.log('🎬 Home - Acción recibida:', event);
    
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
      case 'publish':
        this.publishRoute(event.route);
        break;
    }
  }

  publishRoute(route: SimpleRoute) {
    console.log('📤 Publicar ruta:', route.name);
    
    const routeId = this.routeIdMap.get(route.name);
    
    if (!routeId) {
      console.error('❌ No se encontró el ID para la ruta:', route.name);
      return;
    }

    // Preparar datos para el componente de publicación
    this.publishingRoute = {
      id: routeId,
      name: route.name,
      distance: route.distance,
      points: route.spots
    };

    // Abrir el panel de publicación
    this.togglePanel('createPost');
  }

  onPostPublished() {
    console.log('✅ Post publicado exitosamente');
    this.publishingRoute = null;
    this.activePanel = 'posts';
  }

  onCancelPost() {
    console.log('❌ Cancelar publicación');
    this.publishingRoute = null;
    this.panelOpen = false;
  }

  viewRoute(route: SimpleRoute) {
    console.log('👁️ Ver ruta:', route.name);
    
    const routeId = this.routeIdMap.get(route.name);
    
    if (!routeId) {
      console.error('❌ No se encontró el ID para la ruta:', route.name);
      return;
    }

    this.panelOpen = false;

    this.routeService.getRouteById(routeId).subscribe({
      next: (fullRoute) => {
        console.log('🗺 Ruta completa obtenida:', fullRoute);
        
        const coordinates = fullRoute.points.map(point => [
          point.location.lng,
          point.location.lat
        ]);

        this.osrmService.calculateRoute(coordinates).subscribe({
          next: (routeCalculation) => {
            const map = this.mapService.getMap();
            
            this.routeService.drawRouteOnMap(
              map,
              routeCalculation.geometry,
              routeCalculation.coordinates,
              [],
              {
                origin: fullRoute.points[0],
                destination: fullRoute.points[fullRoute.points.length - 1],
                waypoints: fullRoute.points.slice(1, -1)
              }
            );

            this.mapService.clearAllMarkers();
            this.mapService.addPoints(fullRoute.points);

            console.log('✅ Ruta dibujada en el mapa');
          },
          error: (err) => {
            console.error('❌ Error al calcular geometría:', err);
            alert('Error al dibujar la ruta en el mapa');
          }
        });
      },
      error: (err) => {
        console.error('❌ Error al obtener ruta:', err);
        alert('Error al cargar la ruta');
      }
    });
  }

  editRoute(route: SimpleRoute) {
    console.log('✏️ Editar ruta:', route.name);
    
    const routeId = this.routeIdMap.get(route.name);
    
    if (!routeId) {
      console.error('❌ No se encontró el ID para la ruta:', route.name);
      return;
    }

    this.routeService.getRouteById(routeId).subscribe({
      next: (fullRoute) => {
        console.log('🗺 Cargando ruta para edición:', fullRoute);
        
        this.togglePanel('createRoute');
        
        setTimeout(() => {
          if (this.createRouteComponent) {
            this.createRouteComponent.loadRouteForEdit(fullRoute);
          }
        }, 100);
      },
      error: (err) => {
        console.error('❌ Error al cargar ruta para edición:', err);
        alert('Error al cargar la ruta para edición');
      }
    });
  }

  deleteRoute(route: SimpleRoute) {
    console.log('🗑️ Eliminar ruta:', route.name);
    
    const routeId = this.routeIdMap.get(route.name);
    
    if (!routeId) {
      console.error('❌ No se encontró el ID para la ruta:', route.name);
      return;
    }
    
    if (confirm(`¿Estás seguro de que deseas eliminar la ruta "${route.name}"?\n\nEsta acción no se puede deshacer.`)) {
      this.routeService.deleteRoute(routeId).subscribe({
        next: () => {
          console.log('✅ Ruta eliminada exitosamente');
          alert(`La ruta "${route.name}" ha sido eliminada.`);
        },
        error: (err) => {
          console.error('❌ Error al eliminar ruta:', err);
          alert('Error al eliminar la ruta. Por favor intenta de nuevo.');
        }
      });
    }
  }

  onCreateRouteClick() {
    console.log('➕ Crear nueva ruta');
    this.togglePanel('createRoute');
  }

  filterCategory(category: string) {
    console.log("Filtrando por " + category);
  }

  logout() {
    this.authService.logout();
  }
}