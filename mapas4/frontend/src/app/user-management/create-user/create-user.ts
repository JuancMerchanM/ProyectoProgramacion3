import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { AnimatedButton } from '@shared/animated-button/animated-button';
import { InputField } from '@shared/input-field/input-field';
import { User } from 'app/interfaces/User.interface';
import { UserService } from '../user-service';

@Component({
  selector: 'app-create-user',
  imports: [FormsModule, InputField, AnimatedButton],
  templateUrl: './create-user.html',
  styleUrl: './create-user.css'
})
export class CreateUser {

  private userService = inject(UserService);

  user: User = {
    email: '',
    username: '',
    password: ''
  };

  confirmPassword: string = '';

  @Output() goToLogin = new EventEmitter<void>();

  message = '';
  isSuccess = false;

  onSubmit(form: any): void {
    if (form.invalid) {
      Object.values(form.controls).forEach((c: any) => c.markAsTouched());
      return;
    }

    if (this.user.password !== this.confirmPassword) {
      this.message = 'Passwords do not match.';
      this.isSuccess = false;
      return;
    }

    this.userService.createUser(this.user).subscribe({
      next: () => {
        this.message = 'Account created successfully!';
        this.isSuccess = true;

        setTimeout(() => this.goToLogin.emit(), 1500);
      },
      error: (err) => {
        console.error(err);
        this.message = 'Error creating account.';
        this.isSuccess = false;
      }
    });
  }

  onGoToLogin(event: Event) {
    event.preventDefault();
    this.goToLogin.emit();
  }
}
