import { Component } from '@angular/core';
import { LoginComponent } from '../../authentication/login/login';
import Carousel from "@shared/carousel/carousel";
import { CommonModule } from '@angular/common';
import { CreateUser } from 'app/user-management/create-user/create-user';


@Component({
  selector: 'app-auth',
  imports: [LoginComponent, Carousel, CreateUser, CommonModule],
  templateUrl: './auth.html',
  styleUrl: './auth.css'
})
export class Auth {
  showLogin = true;

  togglePanel() {
    this.showLogin = !this.showLogin;
  }
}
