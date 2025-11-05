import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../authentication-service';
import { InputField } from "@shared/input-field/input-field";
import { AnimatedButton } from "@shared/animated-button/animated-button";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, InputField, AnimatedButton],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  @Output() createAccount = new EventEmitter<void>();
  username = '';
  password = '';
  constructor(private authService: AuthenticationService) {}

  onLogin() {
    this.authService.login(this.username, this.password);
  }

  onCreateAccount(event: Event) {
    event.preventDefault();
    this.createAccount.emit();
  }
}
