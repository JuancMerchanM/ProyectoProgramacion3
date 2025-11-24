import { Component, EventEmitter, Input, Output, signal, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-rating-component',
  imports: [],
  templateUrl: './rating-component.html',
  styleUrl: './rating-component.css'
})
export class RatingComponent {
  @Input() rating = 0; // estado inicial desde el padre
  @Output() rated = new EventEmitter<number>();

  // Signals para controlar el estado interno
  hoverIndex = signal<number>(0);
  selectedIndex = signal<number>(0);
  allowHover = signal<boolean>(true);

  ngOnInit() {
    // Al iniciar, establecemos el seleccionado según el rating inicial
    this.selectedIndex.set(this.rating);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['rating']) {
      const newValue = changes['rating'].currentValue;
      this.selectedIndex.set(newValue);
      this.hoverIndex.set(0);
      this.allowHover.set(true);
    }
  }

  onMouseEnter(index: number) {
    if (!this.allowHover()) return;
    this.hoverIndex.set(index);
  }

  onMouseLeave() {
    if (!this.allowHover()) return;
    this.hoverIndex.set(0);
  }

  onClick(index: number) {
    this.selectedIndex.set(index);
    this.allowHover.set(false); // deshabilitar hover cuando se selecciona
  }

  confirm() {
    this.rated.emit(this.selectedIndex());
    this.allowHover.set(true); // Cambio aquí: permitir hover nuevamente después de confirmar
  }

  cancel() {
    // revertir al estado inicial
    this.selectedIndex.set(this.rating);
    this.hoverIndex.set(0);
    this.allowHover.set(true);
  }

  // Determinar si una estrella está "activa"
  isActive(index: number): boolean {
    if (this.allowHover() && this.hoverIndex() > 0) {
      // Si está en modo hover, mostrar solo hasta el hover
      return index <= this.hoverIndex();
    }
    // Si no hay hover, mostrar el seleccionado
    return index <= this.selectedIndex();
  }
}