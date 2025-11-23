import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputField } from '@shared/input-field/input-field';
import { UserService } from '../user-service';
import { AuthenticationService } from 'app/authentication/authentication-service';

@Component({
  selector: 'app-delete-user',
  imports: [FormsModule, InputField],
  templateUrl: './delete-user.html',
  styleUrl: './delete-user.css'
})
export class DeleteUser {
  id: number = 0;
  password: string = "";
  errorMessage: string = "";

  private userService = inject(UserService);
  private authService = inject(AuthenticationService);

  ngOnInit(){
    const saved = localStorage.getItem('user');
    if (saved) {
      const parseSaved = JSON.parse(saved);
      this.id = Number.parseInt(parseSaved.id ?? "0");
    }
  }

  onSubmit(form: any): void {
    if (form.invalid) {
      Object.values(form.controls).forEach((c: any) => c.markAsTouched());
      return;
    }
    this.userService.deleteUser(this.id, this.password).subscribe({
      next: () => {
        this.errorMessage = '';
        
        this.authService.logout();
      },
      error: (err) => {
        this.errorMessage = err.error.error;
      }
    });
  }
}
