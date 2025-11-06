import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-list-routes',
  imports: [],
  templateUrl: './list-routes.html',
  styleUrl: './list-routes.css'
})
export class ListRoutes {
  @Input() name!: string;
  @Input() date!: string;
  @Input() privacy!: string;
  @Input() distance!: number;
  @Input() spots!: number;
}
