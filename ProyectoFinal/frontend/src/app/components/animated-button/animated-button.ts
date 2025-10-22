import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-animated-button',
  standalone: true,
  templateUrl: './animated-button.html',
  styleUrls: ['./animated-button.css']
})
export class AnimatedButton {
  @Input() text: string = 'Submit';
  @Output() clicked = new EventEmitter<void>();

  onClick() {
    this.clicked.emit();
  }
}
