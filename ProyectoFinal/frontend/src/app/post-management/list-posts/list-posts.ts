import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { PostService, RoutePost } from '../post.service';
import { PointSimpleCard } from "@shared/point-simple-card/point-simple-card";
import { AuthenticationService } from 'app/authentication/authentication-service';

@Component({
  selector: 'app-list-posts',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="posts-container">
      <div class="posts-header">
        <h2>Últimas Publicaciones</h2>
      </div>
      
      @if (loading) {
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Cargando publicaciones...</p>
        </div>
      } @else if (posts.length === 0) {
        <div class="empty-state">
          <div class="empty-icon">📍</div>
          <p class="empty-title">No hay publicaciones todavía</p>
          <p class="empty-subtitle">¡Sé el primero en compartir una ruta!</p>
        </div>
      } @else {
        <div class="posts-list">
          @for(post of posts; track post.id) {
            <div class="post-card">
              <!-- Header con usuario y fecha -->
              <div class="post-user-info">
                <div class="user-avatar">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                  </svg>
                </div>
                <div class="user-details">
                  <span class="username">{{ post.route.createdBy.username || 'Usuario' }}</span>
                  <span class="post-date">{{ formatDate(post.publishedAt) }}</span>
                </div>
                @if (isPostOwner(post)) {
                  <button class="delete-post-btn" (click)="deletePost(post)" title="Eliminar publicación">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  </button>
                }
              </div>

              <!-- Contenido principal -->
              <div class="post-content">
                <div class="post-main">
                  <!-- Imagen/Thumbnail -->
                  <div class="post-thumbnail">
                    <div class="thumbnail-gradient"></div>
                    <div class="thumbnail-icon">🗺️</div>
                  </div>

                  <!-- Información de la ruta -->
                  <div class="post-info">
                    <h3 class="route-name">{{ post.route.name }}</h3>
                    <p class="route-location">
                      {{ post.route.points[0]?.name || 'Múltiples ubicaciones' }}
                    </p>
                    <div class="route-stats">
                      <span class="stat-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                        {{ post.route.numPoints }} Lugares
                      </span>
                      <span class="stat-divider">•</span>
                      <span class="stat-item">Distancia: {{ formatDistance(post.route.distance) }} km</span>
                    </div>
                  </div>
                </div>

                <!-- Rating -->
                @if (post.rating) {
                  <div class="post-rating">
                    @for (star of [1, 2, 3, 4, 5]; track star) {
                      <span class="star" [class.filled]="star <= post.rating!">
                        {{ star <= post.rating! ? '★' : '☆' }}
                      </span>
                    }
                  </div>
                }
              </div>

              <!-- Descripción -->
              <div class="post-description" [class.expanded]="expandedPosts.has(post.id)">
                <p>{{ post.description }}</p>
              </div>

              <!-- Botón de expandir -->
              <button 
                class="expand-btn"
                (click)="togglePostExpansion(post.id)"
              >
                <span>{{ expandedPosts.has(post.id) ? 'Ver menos' : 'Ver más' }}</span>
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  stroke-width="2"
                  [class.rotated]="expandedPosts.has(post.id)"
                >
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>

              <!-- Lugares (expandible) -->
              @if (expandedPosts.has(post.id) && post.route.points && post.route.points.length > 0) {
                <div class="post-locations">
                  <div class="locations-header">
                    <h4>Lugares en esta ruta</h4>
                  </div>
                  <div class="locations-list">
                    @for (point of post.route.points; track point.id) {
                      <div class="location-item">
                        <div class="location-marker">📍</div>
                        <div class="location-info">
                          <span class="location-name">{{ point.name || 'Lugar sin nombre' }}</span>
                          <span class="location-category">{{ point.category || 'Sin categoría' }}</span>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              }
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .posts-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
      max-height: 100%;
      background: #f8f9fa;
      overflow: hidden;
    }

    .posts-header {
      padding: 20px;
      background: white;
      border-bottom: 1px solid #e9ecef;
      flex-shrink: 0;
    }

    .posts-header h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 700;
      color: #212529;
    }

    /* Loading y Empty States */
    .loading-state,
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      text-align: center;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #e9ecef;
      border-top-color: #007bff;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin-bottom: 16px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .empty-icon {
      font-size: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .empty-title {
      margin: 0 0 8px 0;
      font-size: 16px;
      font-weight: 600;
      color: #495057;
    }

    .empty-subtitle {
      margin: 0;
      font-size: 14px;
      color: #868e96;
    }

    /* Lista de Posts */
    .posts-list {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-height: 0;
    }

    /* Card del Post */
    .post-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;
    }

    .post-card:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
      transform: translateY(-2px);
    }

    /* Header con usuario */
    .post-user-info {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 16px 12px 16px;
      position: relative;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      flex-shrink: 0;
    }

    .user-details {
      display: flex;
      flex-direction: column;
      gap: 2px;
      flex: 1;
    }

    .username {
      font-size: 14px;
      font-weight: 600;
      color: #212529;
    }

    .post-date {
      font-size: 12px;
      color: #868e96;
    }

    /* Botón eliminar publicación */
    .delete-post-btn {
      background: none;
      border: none;
      padding: 8px;
      cursor: pointer;
      color: #868e96;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      transition: all 0.2s ease;
      margin-left: auto;
    }

    .delete-post-btn:hover {
      background: #fee;
      color: #dc3545;
    }

    .delete-post-btn svg {
      width: 18px;
      height: 18px;
    }

    /* Contenido Principal */
    .post-content {
      padding: 0 16px;
    }

    .post-main {
      display: flex;
      gap: 12px;
      margin-bottom: 12px;
    }

    /* Thumbnail */
    .post-thumbnail {
      width: 80px;
      height: 80px;
      border-radius: 8px;
      position: relative;
      overflow: hidden;
      flex-shrink: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .thumbnail-gradient {
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, 
        rgba(102, 126, 234, 0.8) 0%, 
        rgba(118, 75, 162, 0.8) 100%);
    }

    .thumbnail-icon {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
    }

    /* Info de la ruta */
    .post-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 0;
    }

    .route-name {
      margin: 0;
      font-size: 16px;
      font-weight: 700;
      color: #212529;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .route-location {
      margin: 0;
      font-size: 13px;
      color: #6c757d;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .route-stats {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: #868e96;
      margin-top: 4px;
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .stat-item svg {
      width: 14px;
      height: 14px;
      stroke-width: 2;
    }

    .stat-divider {
      color: #dee2e6;
    }

    /* Rating */
    .post-rating {
      display: flex;
      gap: 2px;
      margin-bottom: 12px;
    }

    .star {
      font-size: 16px;
      color: #ffc107;
    }

    .star:not(.filled) {
      color: #dee2e6;
    }

    /* Descripción */
    .post-description {
      padding: 0 16px 12px 16px;
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease;
    }

    .post-description.expanded {
      max-height: 500px;
    }

    .post-description p {
      margin: 0;
      font-size: 14px;
      line-height: 1.6;
      color: #495057;
      white-space: pre-wrap;
    }

    /* Botón expandir */
    .expand-btn {
      width: 100%;
      padding: 12px 16px;
      background: none;
      border: none;
      border-top: 1px solid #e9ecef;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-size: 13px;
      font-weight: 600;
      color: #667eea;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .expand-btn:hover {
      background: #f8f9fa;
      color: #5568d3;
    }

    .expand-btn svg {
      transition: transform 0.3s ease;
    }

    .expand-btn svg.rotated {
      transform: rotate(180deg);
    }

    /* Lugares */
    .post-locations {
      padding: 16px;
      background: #f8f9fa;
      border-top: 1px solid #e9ecef;
    }

    .locations-header h4 {
      margin: 0 0 12px 0;
      font-size: 14px;
      font-weight: 600;
      color: #495057;
    }

    .locations-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .location-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px;
      background: white;
      border-radius: 8px;
      transition: background 0.2s ease;
    }

    .location-item:hover {
      background: #e9ecef;
    }

    .location-marker {
      font-size: 20px;
      flex-shrink: 0;
    }

    .location-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
      flex: 1;
    }

    .location-name {
      font-size: 14px;
      font-weight: 600;
      color: #212529;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .location-category {
      font-size: 12px;
      color: #868e96;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    /* Scrollbar personalizado */
    .posts-list::-webkit-scrollbar {
      width: 6px;
    }

    .posts-list::-webkit-scrollbar-track {
      background: transparent;
    }

    .posts-list::-webkit-scrollbar-thumb {
      background: #ced4da;
      border-radius: 3px;
    }

    .posts-list::-webkit-scrollbar-thumb:hover {
      background: #adb5bd;
    }

    /* Asegurar que los posts no crezcan */
    .post-card {
      flex-shrink: 0;
    }
  `]
})
export class ListPosts implements OnInit, OnDestroy {
  posts: RoutePost[] = [];
  loading: boolean = true;
  expandedPosts = new Set<string>();
  
  private postsSubscription?: Subscription;
  private currentUserEmail: string | null = null;

  constructor(
    private postService: PostService,
    private authService: AuthenticationService
  ) {
    const user = this.authService.user();
    this.currentUserEmail = user?.email || null;
  }

  ngOnInit() {
    this.loadPosts();
    
    this.postsSubscription = this.postService.postsChanged$.subscribe(() => {
      console.log('🔔 Recargando posts...');
      this.loadPosts();
    });
  }

  ngOnDestroy() {
    if (this.postsSubscription) {
      this.postsSubscription.unsubscribe();
    }
  }

  loadPosts() {
    this.loading = true;
    this.postService.getAllPosts().subscribe({
      next: (posts) => {
        console.log('📦 Posts recibidos:', posts);
        this.posts = posts;
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error al cargar posts:', err);
        this.loading = false;
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffMinutes < 1) return 'Ahora mismo';
    if (diffMinutes < 60) return `Hace ${diffMinutes} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short'
    });
  }

  formatDistance(meters: number): string {
    const km = meters / 1000;
    return km >= 10 ? Math.round(km).toString() : km.toFixed(1);
  }

  togglePostExpansion(postId: string) {
    if (this.expandedPosts.has(postId)) {
      this.expandedPosts.delete(postId);
    } else {
      this.expandedPosts.add(postId);
    }
  }

  isPostOwner(post: RoutePost): boolean {
    if (!this.currentUserEmail || !post.route.createdBy?.email) {
      return false;
    }
    return post.route.createdBy.email === this.currentUserEmail;
  }

  deletePost(post: RoutePost) {
    if (!this.isPostOwner(post)) {
      return;
    }

    const confirmMessage = `¿Estás seguro de que deseas eliminar esta publicación de "${post.route.name}"?\n\nEsta acción no se puede deshacer.`;
    
    if (confirm(confirmMessage)) {
      this.postService.deactivatePost(post.id).subscribe({
        next: () => {
          console.log('✅ Publicación eliminada exitosamente');
          // La recarga se hará automáticamente gracias a postsChanged$
        },
        error: (err) => {
          console.error('❌ Error al eliminar publicación:', err);
          alert('Error al eliminar la publicación. Por favor intenta de nuevo.');
        }
      });
    }
  }
}