import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <h1>Proyecto Final</h1>
    <router-outlet></router-outlet>
  `,
  styleUrls: ['./app.css']
})
export class AppComponent {}