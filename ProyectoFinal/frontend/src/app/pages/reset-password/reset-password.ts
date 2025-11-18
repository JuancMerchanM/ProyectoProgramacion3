import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'app/authentication/authentication-service';
import { InputField } from "@shared/input-field/input-field";

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule, FormsModule, InputField],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPassword {
  private route = inject(ActivatedRoute);
  private authService = inject(AuthenticationService);
  private router = inject(Router);

  token: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  message: string = '';
  isSuccess = false;
  isLoading = false;

  rules = {
    minLength: false,
    number: false,
    special: false
  };

  constructor() {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] ?? '';
    });
  }

  validatePassword() {
    const pass = this.newPassword || '';

    this.rules.minLength = pass.length >= 8;
    this.rules.number = /\d/.test(pass);
    this.rules.special = /[^A-Za-z0-9]/.test(pass);
  }

  canSubmit() {
    return (
      this.rules.minLength &&
      this.rules.number &&
      this.rules.special &&
      this.newPassword === this.confirmPassword &&
      !this.isLoading
    );
  }

  resetPassword() {
    if (!this.canSubmit()) return;
    console.log("Cambiando contrase;a");
    this.isLoading = true;

    this.authService.resetPassword(this.token, this.newPassword).subscribe({
      next: () => {
        this.message = 'Contraseña cambiada correctamente.';
        this.isSuccess = true;

        setTimeout(() => this.router.navigate(['/auth']), 2000);
      },
      error: () => {
        this.message = 'El token es inválido o expiró.';
        this.isSuccess = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
    console.log(this.message);
  }
}