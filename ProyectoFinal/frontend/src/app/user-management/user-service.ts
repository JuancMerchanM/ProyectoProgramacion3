import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { User } from 'app/interfaces/User.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8035/auth';

  // Opcional: estado reactivo si quieres mostrar feedback global
  creating = signal(false);

  constructor(private http: HttpClient) {}

  createUser(data: User) {
    this.creating.set(true);

    return this.http.post(`${this.apiUrl}/register`, data, {
      observe: 'response'
    });
  }
}
