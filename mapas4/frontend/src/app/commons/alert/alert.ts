import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-alert',
  imports: [],
  templateUrl: './alert.html',
  styleUrl: './alert.css'
})
export class Alert {
  visible = signal(false);
  message = signal('');
  type = signal<'success' | 'error'>('success');

  show(msg: string, type: 'success' | 'error' = 'success') {
    this.message.set(msg);
    this.type.set(type);
    this.visible.set(true);

    setTimeout(() => this.visible.set(false), 3000);
  }
}
