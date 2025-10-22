import { Component, EventEmitter, Output } from '@angular/core';
import { InputField } from "@shared/input-field/input-field";
import { AnimatedButton } from "@shared/animated-button/animated-button";

@Component({
  selector: 'app-signin',
  imports: [InputField, AnimatedButton],
  templateUrl: './signin.html',
  styleUrl: './signin.css'
})
export class Signin {
  @Output() goToLogin = new EventEmitter<void>();

  onGoToLogin(event: Event) {
    event.preventDefault();
    this.goToLogin.emit();
  }
}
