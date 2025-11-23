import { Component, Input } from '@angular/core';
import { Point } from 'app/interfaces/Point.interface';
import { ListRoutes } from "app/route-management/list-routes/list-routes";
import { RatingComponent } from "@shared/rating-component/rating-component";

@Component({
  selector: 'app-show-site',
  imports: [ListRoutes, RatingComponent],
  templateUrl: './show-site.html',
  styleUrl: './show-site.css'
})
export class ShowSite {
  @Input() point!: Point|null;

  
}
