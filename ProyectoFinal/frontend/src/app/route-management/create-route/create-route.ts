import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MarkbookSimpleCard } from "@shared/markbook-simple-card/markbook-simple-card";

@Component({
  selector: 'app-create-route',
  imports: [FormsModule, MarkbookSimpleCard],
  templateUrl: './create-route.html',
  styleUrl: './create-route.css'
})
export class CreateRoute {
  startPoint: string = '';
  routeName: string = '';
  distance: number = 0;

}
