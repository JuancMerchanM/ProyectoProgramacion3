import { Component, Input } from '@angular/core';
import { SimpleRoute } from 'app/interfaces/SimpleRoute.interface';

@Component({
  selector: 'app-route-simple-card',
  imports: [],
  templateUrl: './route-simple-card.html',
  styleUrl: './route-simple-card.css'
})
export class RouteSimpleCard {
  @Input() simpleRoute!: SimpleRoute;
}
