import { Component } from '@angular/core';
import { MostrarMapa } from "app/gestion-mapa/mostrar-mapa/mostrar-mapa";

@Component({
  selector: 'app-home',
  imports: [MostrarMapa],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  panelOpen = false;
  activePanel: string | null = null;

  togglePanel(panel: string) {
    if (this.activePanel === panel) {
      this.panelOpen = !this.panelOpen;
    } else {
      this.panelOpen = true;
      this.activePanel = panel;
    }
  }
}
