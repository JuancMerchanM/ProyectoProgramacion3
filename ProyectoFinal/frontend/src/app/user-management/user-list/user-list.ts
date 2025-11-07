import { Component } from '@angular/core';
import { InputBox } from "app/commons/input-box/input-box";
import { ListRoutes } from "app/route-management/list-routes/list-routes";

@Component({
  selector: 'app-user-list',
  imports: [InputBox, ListRoutes],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css'
})
export class UserList {
  username: string = "MyUsername";
  email: string = "asdfasd@gmail.com";
  password: string = "**********";
}
