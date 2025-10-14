import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input-field',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './input-field.html',
  styleUrls: ['./input-field.css']
})
export class InputField {
  @Input() label!: string;
  @Input() type: string = 'text';
  @Input() name!: string;
  @Input() id!: string;
  @Input() required: boolean = false;
  @Input() autocomplete: string = 'off';
  @Input() placeholder: string = ' ';
}
