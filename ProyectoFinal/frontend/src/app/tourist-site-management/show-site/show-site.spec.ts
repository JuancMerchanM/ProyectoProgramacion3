import { Component, Input } from '@angular/core';
import { Point } from '../../interfaces/Point.interface';
import { RatingComponent } from '../../commons/rating-component/rating-component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-show-site',
  imports: [RatingComponent],
  templateUrl: './show-site.html',
  styleUrl: './show-site.css'
})
export class ShowSite {
  @Input() point!: Point|null;
  
  routes = [
    { name: 'Ruta del Café Boyacense', date: '2025-03-21', privacy: 'Pública', distance: 125, spots: 8 },
    { name: 'Aventura en la Sierra Nevada', date: '2025-04-10', privacy: 'Privada', distance: 312, spots: 12 },
    { name: 'Tour por los Pueblos Patrimonio', date: '2025-05-02', privacy: 'Pública', distance: 450, spots: 15 },
    { name: 'Ruta Ecológica del Cocuy', date: '2025-06-15', privacy: 'Privada', distance: 210, spots: 9 },
    { name: 'Costa Caribe Express', date: '2025-07-08', privacy: 'Pública', distance: 580, spots: 11 }
  ];

  constructor(private http: HttpClient) {}

  onRatingChange(newRating: number) {
    if (!this.point || !this.point.id) {
      console.error('No hay punto seleccionado para calificar');
      return;
    }

    const apiUrl = `http://localhost:8080/location/${this.point.id}/rating`;
    
    this.http.put<Point>(apiUrl, { rating: newRating })
      .subscribe({
        next: (updatedLocation) => {
          console.log('Calificación actualizada:', updatedLocation);
          if (this.point) {
            this.point.rating = updatedLocation.rating;
          }
        },
        error: (error) => {
          console.error('Error al actualizar calificación:', error);
          alert('No se pudo guardar la calificación. Intenta de nuevo.');
        }
      });
  }
}