import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { Signin } from './signin/signin';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signin', component: Signin }
];