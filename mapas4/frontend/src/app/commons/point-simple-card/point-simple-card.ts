import { Component, Input } from '@angular/core';
import { Point } from 'app/interfaces/Point.interface';

@Component({
  selector: 'app-point-simple-card',
  imports: [],
  templateUrl: './point-simple-card.html',
  styleUrl: './point-simple-card.css'
})
export class PointSimpleCard {
  @Input() data?: Point;
}
