import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PointSimpleCard } from "@shared/point-simple-card/point-simple-card";

@Component({
  selector: 'app-create-route',
  imports: [FormsModule, PointSimpleCard],
  templateUrl: './create-route.html',
  styleUrl: './create-route.css'
})
export class CreateRoute {
  startPoint: string = '';
  routeName: string = '';
  distance: number = 0;

}
