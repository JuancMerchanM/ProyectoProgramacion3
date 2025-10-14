import { Component } from '@angular/core';
import { InputField } from "../input-field/input-field";
import { AnimatedButton } from "../animated-button/animated-button";

@Component({
  selector: 'app-signin',
  imports: [InputField, AnimatedButton],
  templateUrl: './signin.html',
  styleUrl: './signin.css'
})
export class Signin {

}
