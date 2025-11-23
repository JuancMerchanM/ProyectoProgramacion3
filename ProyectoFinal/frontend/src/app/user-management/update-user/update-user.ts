import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { UserService } from '../user-service';
import { Alert } from '@shared/alert/alert';
import { InputField } from '@shared/input-field/input-field';
import { UpdateUser } from 'app/interfaces/UpdateUser.interface';
import { AuthenticationService } from 'app/authentication/authentication-service';

@Component({
  selector: 'app-update-user',
  imports: [FormsModule, Alert, InputField],
  templateUrl: './update-user.html',
  styleUrl: './update-user.css'
})
export class UpdateUserComponent {

  updatedUser: UpdateUser = {
    username: '',
    email: '',
    password: '',
    oldPassword: ''
  };

  id: number = 0;
  errorMessage: string = '';

  private userService = inject(UserService);

  @ViewChild('alertUpdate') alert!: Alert;

  ngOnInit() {
    const userData = localStorage.getItem('user');

    if (userData) {
      const user = JSON.parse(userData);

      this.id = Number.parseInt(user.id ?? "0");
      this.updatedUser.username = user.username ?? "";
      this.updatedUser.email = user.email ?? "";
    }
  }

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

    if (!this.validateUsername(this.updatedUser.username)) {
      this.errorMessage = 'Nombre de usuario invalido: solo letras, numeros, _, -, &, $ estan permitidos.';
      return;
    }

    this.userService.updateUser(this.id, this.updatedUser).subscribe({
      next: () => {
        this.errorMessage = '';
        this.alert.show("Cuenta actualizada exitosamente", "success", 1200);
        this.userService.updateLocalUser({
          username: this.updatedUser.username,
          email: this.updatedUser.email
        });
      },
      error: (err) => {
        this.errorMessage = err.error.error;
      }
    });
  }
}
