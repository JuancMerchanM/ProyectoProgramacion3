import { Component, effect, EventEmitter, inject, Output } from '@angular/core';
import { InputBox } from "app/commons/input-box/input-box";
import { ListRoutes } from "app/route-management/list-routes/list-routes";
import { UserService } from '../user-service';

@Component({
  selector: 'app-user-list',
  imports: [InputBox, ListRoutes],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css'
})
export class UserList {

  constructor (private userService: UserService) {}

  @Output() manageAccount = new EventEmitter<void>();

  userEffect = effect(() => {
    const u = this.userService.user();

    if (u) {
      this.username = u.username;
      this.email = u.email;
      this.password = this.createStars(u.lenPassword);
    }
  });

  username: string = "";
  email: string = "";
  password: string = "";

  createStars(length: number): string {
    return "*".repeat(length);
  }
}
