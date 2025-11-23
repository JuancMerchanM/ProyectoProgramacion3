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
  templateUrl: './list-posts.html',
  styleUrls: ['./list-posts.css']
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