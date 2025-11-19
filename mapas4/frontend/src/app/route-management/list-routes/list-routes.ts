import { Component, Input } from '@angular/core';
import { SimpleRoute } from 'app/interfaces/SimpleRoute.interface';
import { RouteSimpleCard } from "@shared/route-simple-card/route-simple-card";

@Component({
  selector: 'app-list-routes',
  imports: [RouteSimpleCard],
  templateUrl: './list-routes.html',
  styleUrl: './list-routes.css'
})
export class ListRoutes {
  @Input() routes: SimpleRoute[] = [];
}
