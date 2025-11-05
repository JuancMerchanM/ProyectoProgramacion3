import { Component } from '@angular/core';
import { LoginComponent } from '../../authentication/login/login';
import { CrearUsuario } from '../../gestion-usuario/crear-usuario/crear-usuario';
import Carousel from "@shared/carousel/carousel";
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-auth',
  imports: [LoginComponent, Carousel, CrearUsuario, CommonModule],
  templateUrl: './auth.html',
  styleUrl: './auth.css'
})
export class Auth {
  showLogin = true;

  togglePanel() {
    this.showLogin = !this.showLogin;
  }
}
