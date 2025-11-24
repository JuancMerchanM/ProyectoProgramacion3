import { Component, EventEmitter, inject, Output, ViewChild } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { AnimatedButton } from '@shared/animated-button/animated-button';
import { InputField } from '@shared/input-field/input-field';
import { User } from 'app/interfaces/User.interface';
import { UserService } from '../user-service';
import { Alert } from '@shared/alert/alert';

@Component({
  selector: 'app-create-user',
  imports: [FormsModule, InputField, AnimatedButton, Alert],
  templateUrl: './create-user.html',
  styleUrl: './create-user.css'
})
export class CreateUser {

  private userService = inject(UserService);
  @ViewChild('alertCreate') alert!: Alert;

  user: User = {
    email: '',
    username: '',
    password: ''
  };

  confirmPassword: string = '';

  @Output() goToLogin = new EventEmitter<void>();

  errorMessage = '';
  isSuccess = false;

  validateUsername(username: string) {
    const usernameRegex =
      /^[a-zA-Z0-9_\-&$]+$/;

    return usernameRegex.test(username);
  }


 onSubmit(form: any): void {
  if (form.invalid) {
    Object.values(form.controls).forEach((c: any) => c.markAsTouched());
    return;
  }

  if (!this.validateUsername(this.user.username)) {
    this.errorMessage = 'Nombre de usuario invalido: solo letras, numeros, _, -, &, $ estan permitidos.';
    return;
  }

  if (this.user.password !== this.confirmPassword) {
    this.errorMessage = 'Las contraseñas no coinciden.';
    this.isSuccess = false;
    return;
  }
  
  this.userService.createUser(this.user).subscribe({
    next: () => {
      this.errorMessage = '';
      this.alert.show("Cuenta creada exitosamente", "success", 1200);
      this.isSuccess = true;

      setTimeout(() => this.goToLogin.emit(), 1500);
    },
    error: (err) => {
      console.log('Error completo:', err);
      
      // Manejo seguro del error basado en el status
      if (err.status === 401) {
        this.errorMessage = 'No autorizado. Verifica tus credenciales.';
      } else if (err.status === 409) {
        this.errorMessage = 'El usuario o email ya existe.';
      } else if (err.error?.error) {
        this.errorMessage = err.error.error;
      } else if (typeof err.error === 'string') {
        this.errorMessage = err.error;
      } else {
        this.errorMessage = 'Error al crear la cuenta. Por favor intenta de nuevo.';
      }
      
      this.isSuccess = false;
    }
  });
}

  onGoToLogin(event: Event) {
    event.preventDefault();
    this.goToLogin.emit();
  }
}
