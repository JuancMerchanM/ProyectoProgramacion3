import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private apiUrl = 'http://localhost:8035/api/auth';

  // Estado reactivo con signals
  isLoggedIn = signal(false);
  token = signal<string | null>(null);

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { username, password })
      .subscribe({
        next: (res) => {
          this.token.set(res.token);
          this.isLoggedIn.set(true);
        },
        error: (err) => {
          console.error('Login failed', err);
        }
      });
  }

  logout() {
    this.token.set(null);
    this.isLoggedIn.set(false);
    this.router.navigate(['/login']);
  }
}
