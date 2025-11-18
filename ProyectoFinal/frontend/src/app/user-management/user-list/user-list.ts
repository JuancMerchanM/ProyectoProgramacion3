import { Component, Input } from '@angular/core';
import { InputBox } from "app/commons/input-box/input-box";
import { ListRoutes } from "app/route-management/list-routes/list-routes";

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

  createStars(length: number): string {
    return '*'.repeat(length);
  }
}
