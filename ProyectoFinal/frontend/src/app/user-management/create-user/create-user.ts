import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AnimatedButton } from '@shared/animated-button/animated-button';
import { InputField } from '@shared/input-field/input-field';

@Component({
  selector: 'app-create-user',
  imports: [FormsModule, InputField, AnimatedButton],
  templateUrl: './create-user.html',
  styleUrl: './create-user.css'
})
export class CreateUser {

  user = {
    email: '',
    username: '',
    password: ''
  };

  @Output() goToLogin = new EventEmitter<void>();
  confirmPassword: string = '';

  onSubmit(form: any): void {
    if (form.invalid) {
      console.log('Formulario inválido');
      Object.keys(form.controls).forEach(key => {
        form.controls[key].markAsTouched();
      });
      return;
    }

    console.log('Datos enviados:', this.user);
  }

  onGoToLogin(event: Event) {
    event.preventDefault();
    this.goToLogin.emit();
  }
}
