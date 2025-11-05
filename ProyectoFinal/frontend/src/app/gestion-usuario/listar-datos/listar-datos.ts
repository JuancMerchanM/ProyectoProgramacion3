import { Component } from '@angular/core';
import { InputBox } from "app/commons/input-box/input-box";

@Component({
  selector: 'app-listar-datos',
  imports: [InputBox],
  templateUrl: './listar-datos.html',
  styleUrl: './listar-datos.css'
})
export class ListarDatos {
  username: string = "MyUsername";
  email: string = "asdfasd@gmail.com";
  password: string = "**********";
}
