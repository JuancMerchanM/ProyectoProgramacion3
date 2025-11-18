import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Auth } from '@pages/auth/auth';
import { Home } from '@pages/home/home';
import { authGuard } from './guards/auth-guard';
import { noAuthGuard } from './guards/no-auth-guard';
import { ResetPassword } from '@pages/reset-password/reset-password';

export const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: 'auth', component: Auth, canActivate: [noAuthGuard]},
  { path: 'home', component: Home , canActivate: [authGuard]},
  { path: 'reset-password', component: ResetPassword}
];

@NgModule({
imports: [RouterModule.forRoot(routes)],
exports: []
})
export class App{};