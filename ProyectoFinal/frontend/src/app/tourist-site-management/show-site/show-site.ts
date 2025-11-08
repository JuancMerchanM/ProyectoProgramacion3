import { Component, Input } from '@angular/core';
import { Markbook } from 'app/interfaces/Markbook.interface';
import { ListRoutes } from "app/route-management/list-routes/list-routes";

@Component({
  selector: 'app-tourist-site-list',
  imports: [ListRoutes],
  templateUrl: './show-site.html',
  styleUrl: './show-site.css'
})
export class TouristSiteList {
  @Input() markbook?: Markbook;
}
