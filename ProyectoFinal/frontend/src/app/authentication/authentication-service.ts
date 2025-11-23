import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, throwError, tap } from 'rxjs';
import { LoggedInUser } from 'app/interfaces/LoggedInUser.interface';
import { UserService } from 'app/user-management/user-service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private apiUrl = 'http://localhost:8035/auth';

  constructor(private http: HttpClient, private router: Router, private userService: UserService) { }

  login(usernameOrEmail: string, password: string) {
    return this.http.post<{ id: number, token: string; username: string, email: string }>(`${this.apiUrl}/login`, { usernameOrEmail, password })
      .pipe(
        tap(res => {

          const logged: LoggedInUser = {
            id: res.id,
            username: res.username,
            email: res.email,
            lenPassword: password.length
          };

          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(logged));
          this.userService.updateLocalUser(logged);

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
