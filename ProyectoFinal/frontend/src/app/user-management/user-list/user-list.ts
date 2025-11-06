import { Component } from '@angular/core';
import { InputBox } from "app/commons/input-box/input-box";

@Component({
  selector: 'app-user-list',
  imports: [InputBox],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css'
})
export class UserList {
  username: string = "MyUsername";
  email: string = "asdfasd@gmail.com";
  password: string = "**********";
}
