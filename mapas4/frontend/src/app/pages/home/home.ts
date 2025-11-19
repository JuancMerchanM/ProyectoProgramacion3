
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ShowMapComponent } from '../../map-management/show-map/show-map';
import { CreateRouteComponent } from '../../route-management/create-route/create-route';
// Importa otros componentes según los tengas

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    ShowMapComponent, 
    CreateRouteComponent
    // Agrega tus otros componentes aquí
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements AfterViewInit {
  @ViewChild(ShowMapComponent) mapComponent!: ShowMapComponent;

  panelOpen = false;
  activePanel: string | null = null;
  user: any = null;

  constructor(private router: Router) {
    // Cargar usuario del localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        this.user = JSON.parse(userData);
        console.log('👤 Usuario cargado:', this.user);
      } catch (e) {
        console.error('Error parseando usuario:', e);
      }
    }
  }

  ngAfterViewInit(): void {
    console.log('🗺️ Mapa inicializado');
  }

  togglePanel(panel: string) {
    if (this.activePanel === panel) {
      // Si el mismo panel está abierto, cerrarlo
      this.panelOpen = false;
      this.activePanel = null;
      
      // Si estamos cerrando el panel de crear ruta, limpiar el mapa
      if (panel === 'createRoute' && this.mapComponent) {
        this.mapComponent.clearRoute();
      }
    } else {
      // Abrir el panel seleccionado
      this.panelOpen = true;
      this.activePanel = panel;
      console.log('📂 Panel abierto:', panel);
    }
  }

  logout() {
    console.log('👋 Cerrando sesión');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  filterCategory(category: string) {
    console.log('🔍 Filtrando por categoría:', category);
    if (this.mapComponent) {
      this.mapComponent.filterByCategory(category);
    }
  }

  showAllLocations() {
    console.log('📍 Mostrando todas las ubicaciones');
    if (this.mapComponent) {
      this.mapComponent.showAllMarkers();
    }
  }

  /**
   * Se ejecuta cuando se calcula una ruta
   */
  onRouteCalculated(routeData: any) {
    console.log('✅ Ruta calculada:', routeData);
    
    if (this.mapComponent && routeData) {
      this.mapComponent.displayRoute(routeData);
    } else if (!routeData) {
      // Si routeData es null, limpiar la ruta
      this.mapComponent?.clearRoute();
    }
  }

  /**
   * Se ejecuta cuando se guarda una ruta
   */
  onRouteSaved(route: any) {
    console.log('💾 Ruta guardada:', route);
    
    // Opcional: cerrar el panel después de guardar
    setTimeout(() => {
      this.panelOpen = false;
      this.activePanel = null;
    }, 1500);

    // Opcional: mostrar notificación
    this.showNotification('Ruta guardada exitosamente');
  }

  /**
   * Muestra una notificación temporal
   */
  private showNotification(message: string) {
    // Puedes implementar tu propio sistema de notificaciones
    // o usar una librería como Angular Material Snackbar
    console.log('🔔', message);
  }
}