import { Component, Input } from '@angular/core';
import { MarkbookSimple } from 'app/interfaces/MarkbookSimple.interface';

@Component({
  selector: 'app-markbook-simple-card',
  imports: [],
  templateUrl: './markbook-simple-card.html',
  styleUrl: './markbook-simple-card.css'
})
export class MarkbookSimpleCard {
  @Input() data?: MarkbookSimple;
}
