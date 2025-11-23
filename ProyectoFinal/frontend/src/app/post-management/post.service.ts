import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface CreatePostRequest {
  routeId: string;
  description: string;
  rating?: number;
}

export interface UserInfo {
  username: string;
  email: string;
}

export interface RouteInfo {
  id: string;
  name: string;
  distance: number;
  numPoints: number;
  points: any[];
  createdBy: UserInfo;
}

export interface RoutePost {
  id: string;
  route: RouteInfo;
  description: string;
  isActive: boolean;
  rating?: number;
  publishedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'http://localhost:8035/posts';
  private postsChangedSubject = new Subject<void>();
  
  public postsChanged$ = this.postsChangedSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Crear una nueva publicación
  createPost(request: CreatePostRequest): Observable<RoutePost> {
    return this.http.post<RoutePost>(this.apiUrl, request).pipe(
      tap(() => {
        console.log('✅ Post creado, notificando cambios...');
        this.postsChangedSubject.next();
      })
    );
  }

  // Obtener todas las publicaciones activas
  getAllPosts(): Observable<RoutePost[]> {
    return this.http.get<RoutePost[]>(`${this.apiUrl}/active`);
  }

  // Obtener publicaciones del usuario actual
  getUserPosts(): Observable<RoutePost[]> {
    return this.http.get<RoutePost[]>(`${this.apiUrl}/user`);
  }

  // Desactivar una publicación
  deactivatePost(postId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${postId}`).pipe(
      tap(() => {
        console.log('✅ Post desactivado, notificando cambios...');
        this.postsChangedSubject.next();
      })
    );
  }

  // Actualizar rating de una publicación
  updateRating(postId: string, rating: number): Observable<RoutePost> {
    return this.http.patch<RoutePost>(`${this.apiUrl}/${postId}/rating`, { rating });
  }
}