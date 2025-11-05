import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-listar-rutas',
  imports: [],
  templateUrl: './listar-rutas.html',
  styleUrl: './listar-rutas.css'
})
export class ListarRutas {
  @Input() name!: string;
  @Input() date!: string;
  @Input() privacy!: string;
  @Input() distance!: number;
  @Input() spots!: number;
}
