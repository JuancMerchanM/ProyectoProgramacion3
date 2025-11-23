import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimpleRoute } from 'app/interfaces/SimpleRoute.interface';

export interface RouteAction {
  action: 'view' | 'edit' | 'delete';
  route: SimpleRoute;
}

@Component({
  selector: 'app-list-routes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-routes.html',
  styleUrls: ['./list-routes.css']
})
export class ListRoutes implements OnChanges {
  @Input() routes: SimpleRoute[] = [];
  @Output() routeAction = new EventEmitter<RouteAction>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['routes']) {
      console.log('📄 ListRoutes - Rutas recibidas:', this.routes);
      console.log('📊 Cantidad de rutas:', this.routes.length);
    }
  }

  onAction(action: 'view' | 'edit' | 'delete', route: SimpleRoute) {
    console.log(`🎬 Acción: ${action} en ruta:`, route.name);
    this.routeAction.emit({ action, route });
  }
}