import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { LoggedInUser } from 'app/interfaces/LoggedInUser.interface';
import { UpdateUser } from 'app/interfaces/UpdateUser.interface';
import { User } from 'app/interfaces/User.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:8035/user';

  user = signal<LoggedInUser | null>(null);

  creating = signal(false);

  constructor(private http: HttpClient) {
    const saved = localStorage.getItem('user');
    if (saved) {
      this.user.set(JSON.parse(saved));
    }
  }

  createUser(data: User) {
    this.creating.set(true);

    return this.http.post(`${this.baseUrl}/register`, data, {
      observe: 'response'
    });
  }

  updateLocalUser(newData: Partial<LoggedInUser>) {
    const current = this.user();

    if (current) {
      const updated = { ...current, ...newData };
      this.user.set(updated);
      localStorage.setItem('user', JSON.stringify(updated));
    }
  }

  updateUser(id: number, data: UpdateUser){
    return this.http.put(`${this.baseUrl}/${id}`, data, {
      observe: 'response'
    })
  }

  deleteUser(id: number, password: string){
    return this.http.post(`${this.baseUrl}/delete-user`, {id, password},{
      observe: 'response'
    })
  }
}
