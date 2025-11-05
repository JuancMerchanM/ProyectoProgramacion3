import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input-field',
  standalone: true,
  imports: [CommonModule],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputField),
    multi: true
  }],
  templateUrl: './input-field.html',
  styleUrls: ['./input-field.css']
})
export class InputField implements ControlValueAccessor{
  @Input() label!: string;
  @Input() type: string = 'text';
  @Input() name!: string;
  @Input() id!: string;
  @Input() required: boolean = false;
  @Input() autocomplete: string = 'off';
  @Input() placeholder: string = ' ';

  value: any = '';
  disabled: boolean = false;

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.onChange(this.value); // Notifica a Angular del cambio
  }

  // Método llamado cuando el input pierde el foco
  onBlur(): void {
    this.onTouched(); // Notifica a Angular que fue tocado
  }

  // ===== Métodos de ControlValueAccessor (OBLIGATORIOS) =====
  
  // Angular llama este método para establecer el valor inicial
  writeValue(value: any): void {
    this.value = value || '';
  }

  // Angular registra una función para ser notificado de cambios
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // Angular registra una función para ser notificado cuando el input es tocado
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // Angular llama este método cuando cambia el estado disabled del form
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
