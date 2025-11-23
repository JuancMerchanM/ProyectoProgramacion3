import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PostService } from '../post.service';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="create-post-container">
      <div class="header">
        <h2>Publicar Ruta</h2>
        <button class="close-btn" (click)="onCancel()">×</button>
      </div>

      <div class="form-content">
        <!-- Información de la ruta seleccionada -->
        <div class="route-info">
          <h3>{{ routeName }}</h3>
          <div class="route-details">
            <span>📍 {{ routePoints }} lugares</span>
            <span>📏 {{ routeDistance }} km</span>
          </div>
        </div>

        <!-- Descripción -->
        <div class="form-group">
          <label for="description">Descripción de tu experiencia</label>
          <textarea
            id="description"
            [(ngModel)]="description"
            placeholder="Cuéntanos sobre esta ruta... ¿Qué te gustó? ¿Qué recomendaciones darías?"
            rows="6"
            maxlength="1000"
          ></textarea>
          <small class="char-count">{{ description.length }}/1000 caracteres</small>
        </div>

        <!-- Rating opcional -->
        <div class="form-group">
          <label>Calificación (opcional)</label>
          <div class="rating-container">
            @for (star of [1, 2, 3, 4, 5]; track star) {
              <button
                type="button"
                class="star-btn"
                [class.selected]="star <= (rating || 0)"
                (click)="setRating(star)"
              >
                ⭐
              </button>
            }
            @if (rating) {
              <button type="button" class="clear-rating" (click)="clearRating()">
                Limpiar
              </button>
            }
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="action-buttons">
          <button class="btn-cancel" (click)="onCancel()">
            Cancelar
          </button>
          <button 
            class="btn-publish" 
            (click)="onPublish()"
            [disabled]="!description.trim() || isPublishing"
          >
            {{ isPublishing ? 'Publicando...' : 'Publicar Ruta' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .create-post-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: white;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-bottom: 1px solid #e5e5e5;
    }

    .header h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: #1a1a1a;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 32px;
      cursor: pointer;
      color: #666;
      line-height: 1;
      padding: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.2s;
    }

    .close-btn:hover {
      color: #1a1a1a;
    }

    .form-content {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .route-info {
      background: #f5f5f5;
      padding: 16px;
      border-radius: 8px;
    }

    .route-info h3 {
      margin: 0 0 8px 0;
      font-size: 18px;
      font-weight: 600;
      color: #1a1a1a;
    }

    .route-details {
      display: flex;
      gap: 16px;
      font-size: 14px;
      color: #666;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-group label {
      font-weight: 600;
      font-size: 14px;
      color: #1a1a1a;
    }

    textarea {
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 14px;
      font-family: inherit;
      resize: vertical;
      transition: border-color 0.2s;
    }

    textarea:focus {
      outline: none;
      border-color: #2196F3;
    }

    .char-count {
      font-size: 12px;
      color: #999;
      text-align: right;
    }

    .rating-container {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .star-btn {
      background: none;
      border: none;
      font-size: 28px;
      cursor: pointer;
      padding: 0;
      transition: transform 0.2s;
      filter: grayscale(100%);
      opacity: 0.3;
    }

    .star-btn.selected {
      filter: grayscale(0%);
      opacity: 1;
    }

    .star-btn:hover {
      transform: scale(1.2);
    }

    .clear-rating {
      background: none;
      border: none;
      color: #666;
      font-size: 12px;
      cursor: pointer;
      text-decoration: underline;
      padding: 4px 8px;
    }

    .clear-rating:hover {
      color: #1a1a1a;
    }

    .action-buttons {
      display: flex;
      gap: 12px;
      margin-top: auto;
      padding-top: 20px;
    }

    .btn-cancel,
    .btn-publish {
      flex: 1;
      padding: 12px;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-cancel {
      background: #f5f5f5;
      color: #666;
    }

    .btn-cancel:hover {
      background: #e5e5e5;
    }

    .btn-publish {
      background: #2196F3;
      color: white;
    }

    .btn-publish:hover:not(:disabled) {
      background: #1976D2;
    }

    .btn-publish:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
  `]
})
export class CreatePost {
  @Input() routeId: string = '';
  @Input() routeName: string = '';
  @Input() routeDistance: number = 0;
  @Input() routePoints: number = 0;
  
  @Output() cancel = new EventEmitter<void>();
  @Output() published = new EventEmitter<void>();

  description: string = '';
  rating: number | null = null;
  isPublishing: boolean = false;

  constructor(private postService: PostService) {}

  setRating(value: number) {
    this.rating = value;
  }

  clearRating() {
    this.rating = null;
  }

  onCancel() {
    this.cancel.emit();
  }

  onPublish() {
    if (!this.description.trim() || this.isPublishing) {
      return;
    }

    this.isPublishing = true;

    const request = {
      routeId: this.routeId,
      description: this.description.trim(),
      rating: this.rating || undefined
    };

    this.postService.createPost(request).subscribe({
      next: (post) => {
        console.log('✅ Publicación creada:', post);
        alert('¡Ruta publicada exitosamente!');
        this.published.emit();
      },
      error: (err) => {
        console.error('❌ Error al publicar:', err);
        alert('Error al publicar la ruta. Por favor intenta de nuevo.');
        this.isPublishing = false;
      }
    });
  }
}