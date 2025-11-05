import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-input-box',
  imports: [],
  templateUrl: './input-box.html',
  styleUrl: './input-box.css'
})
export class InputBox {
  @Input() text: string = "";
  @Input() lbText: string = "";
}
