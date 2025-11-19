import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../authentication-service';
import { InputField } from "@shared/input-field/input-field";
import { AnimatedButton } from "@shared/animated-button/animated-button";
import { Router } from '@angular/router';
import { Alert } from '@shared/alert/alert';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, InputField, AnimatedButton, Alert],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  @Output() createAccount = new EventEmitter<void>();
  @ViewChild('alert') alert!: Alert;
  usernameOrEmail = '';
  password = '';
  errorMessage = '';
  constructor(private authService: AuthenticationService, private router: Router) { }
  
  validateUsernameOrEmail(value: string) {
    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const usernameRegex =
      /^[a-zA-Z0-9_\-&$]+$/;

    const isEmail = value.includes("@");

    if (isEmail) {
      return {
        type: 'email',
        valid: emailRegex.test(value),
        message: emailRegex.test(value)
          ? 'Correo valido.'
          : 'Correo invalido.'
      };
    } else {
      return {
        type: 'username',
        valid: usernameRegex.test(value),
        message: usernameRegex.test(value)
          ? 'Nombre de usuario valido.'
          : 'Numero de usuario invalido: solo letras, numeros, _, -, &, $ estan permitidos.'
      };
    }
  }

  onLogin() {
    const result = this.validateUsernameOrEmail(this.usernameOrEmail);

    if (!result.valid) {
      this.errorMessage = result.message;
      return;
    } else {
      this.errorMessage = '';
    }
    this.authService.login(this.usernameOrEmail, this.password)
      .subscribe({
        next: (res) => {
          this.errorMessage = '';
        },
        error: (err) => {
          this.errorMessage = 'Credenciales inválidas';
        }
      });
  }

  onCreateAccount(event: Event) {
    event.preventDefault();
    this.createAccount.emit();
  }

  onForgotPassword(event: Event) {
    event.preventDefault();

    const result = this.validateUsernameOrEmail(this.usernameOrEmail)
    if (result.type != "email" && result) {
      this.errorMessage = 'Por favor ingresa tu email';
      return;
    }

    this.authService.forgotPassword(this.usernameOrEmail).subscribe({
      next: (msg) => {
        this.alert.show('Un correo de recuperacion ha sido enviado a '+this.usernameOrEmail, 'success');
      },
      error: err => {
        this.errorMessage = 'Error enviando el correo. Por favor intentalo de nuevo.';
      }

      
    });
  }
  
}
