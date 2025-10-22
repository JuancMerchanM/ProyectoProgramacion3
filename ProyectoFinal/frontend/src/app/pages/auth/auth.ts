import { Component } from '@angular/core';
import { LoginComponent } from './login/login';
import { Signin } from './signin/signin';
import Carousel from "@shared/carousel/carousel";
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-auth',
  imports: [LoginComponent, Carousel, Signin, CommonModule],
  templateUrl: './auth.html',
  styleUrl: './auth.css'
})
export class Auth {
  showLogin = true;

  togglePanel() {
    this.showLogin = !this.showLogin;
  }
}
