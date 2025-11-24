import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, throwError, tap } from 'rxjs';
import { LoggedInUser } from 'app/interfaces/LoggedInUser.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private apiUrl = 'http://localhost:8035/auth';

  user = signal<LoggedInUser | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    const saved = localStorage.getItem('user');
    if (saved) {
      this.user.set(JSON.parse(saved));
    }
   }

login(usernameOrEmail: string, password: string) {
  return this.http.post<{ token: string; username: string; email: string; id: number }>(`${this.apiUrl}/login`, { usernameOrEmail, password })
    .pipe(
    tap(res => {
      console.log('===== DEBUG LOGIN =====');
      console.log('Respuesta completa:', res);
      console.log('res.id:', res.id);
      console.log('Tipo de res.id:', typeof res.id);
      console.log('=======================');
      
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify({ 
        id: res.id,
        username: res.username, 
        email: res.email, 
        lenPassword: password.length 
      }));
      this.router.navigate(['/home']);
    }),
    catchError(err => {
      return throwError(() => err); 
    })
  );
}

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/auth']);
  }

  forgotPassword(email: string): Observable<string> {
    const params = new HttpParams().set('email', email);
    return this.http.post(`${this.apiUrl}/forgot-password`, null, { 
      params,
      responseType: 'text' 
    });
  }

  resetPassword(resetToken: string, newPassword: string) {
    return this.http.post(`${this.apiUrl}/reset-password`, { resetToken, newPassword });
  }
}
