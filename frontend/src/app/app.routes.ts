import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent) },
  { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'signup', loadComponent: () => import('./features/auth/signup/signup.component').then(m => m.SignupComponent) },
  { path: 'crop', loadComponent: () => import('./features/crop/crop.component').then(m => m.CropComponent) },
  { path: 'fertilizer', loadComponent: () => import('./features/fertilizer/fertilizer.component').then(m => m.FertilizerComponent) },
  { path: 'disease', loadComponent: () => import('./features/disease/disease.component').then(m => m.DiseaseComponent) },
  { path: 'weather', loadComponent: () => import('./features/weather/weather.component').then(m => m.WeatherComponent) },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '' },
];
