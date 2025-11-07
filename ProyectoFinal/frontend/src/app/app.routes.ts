import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Auth } from '@pages/auth/auth';
import { Home } from '@pages/home/home';

export const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: 'auth', component: Auth },
  { path: 'home', component: Home },
  // {
  //   path: 'autenticacion',
  //   loadChildren: () => import('./autenticacion/autenticacion-module').then((m) => m.AutenticacionModule)
  // },
  // {
  //   path: 'gestion-estudiantes',
  //   loadChildren: () => import('./gestion-estudiantes/gestion-estudiantes-module').then((m) => m.GetionEstudiantesModule)
  // },
  // {
  //   path: 'gestion-materias',
  //   loadChildren: () => import('./gestion-materias/gestion-materias-module').then((m) => m.GestionMateriasModule)
  // },
];

@NgModule({
imports: [RouterModule.forRoot(routes)],
exports: []
})
export class App{};