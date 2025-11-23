import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-input-box',
  imports: [],
  templateUrl: './input-box.html',
  styleUrl: './input-box.css'
})
export class InputBox {
  @Input() label: string = "";
  @Input() value: string = "";
  @Input() editable: boolean = false;

  @Output() valueChange = new EventEmitter<string>();

  onInput(event: any) {
    this.valueChange.emit(event.target.value);
  }
}
