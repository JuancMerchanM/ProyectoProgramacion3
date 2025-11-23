import { Component, Input, Output, EventEmitter } from '@angular/core';
import { InputBox } from "app/commons/input-box/input-box";
import { ListRoutes, RouteAction } from "app/route-management/list-routes/list-routes";
import { SimpleRoute } from 'app/interfaces/SimpleRoute.interface';

@Component({
  selector: 'app-user-list',
  imports: [InputBox, ListRoutes],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css'
})
export class UserList {
  @Input() username?: string;
  @Input() email?: string;
  @Input() lenPassword!: number;
  @Input() routes: SimpleRoute[] = [];
  @Output() routeAction = new EventEmitter<RouteAction>();
  @Output() createRoute = new EventEmitter<void>();

  createStars(length: number): string {
    return '*'.repeat(length);
  }

  onRouteAction(event: RouteAction) {
    this.routeAction.emit(event);
  }

  onCreateRoute() {
    this.createRoute.emit();
  }
}