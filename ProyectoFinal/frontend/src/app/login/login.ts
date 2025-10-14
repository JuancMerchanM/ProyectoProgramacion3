import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth';
import { InputField } from "../input-field/input-field";
import { AnimatedButton } from "../animated-button/animated-button";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, InputField, AnimatedButton],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  username = '';
  password = '';
  constructor(private authService: AuthService) {}

  onLogin() {
    this.authService.login(this.username, this.password);
  }
}
