import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { firstValueFrom } from 'rxjs';

export interface User {
  id: number;
  email: string;
  name: string;
  created_at: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSignal = signal<User | null>(null);
  readonly user = this.userSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.userSignal() !== null);

  constructor(private api: ApiService, private router: Router) {
    this.loadUser();
  }

  private loadUser() {
    const token = this.getAccessToken();
    if (token) {
      this.fetchProfile();
    }
  }

  async fetchProfile() {
    try {
      const user = await firstValueFrom(this.api.getProfile());
      this.userSignal.set(user);
    } catch {
      this.clearTokens();
      this.userSignal.set(null);
    }
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(this.api.login({ email, password }));
      this.setTokens(response.access_token, response.refresh_token);
      await this.fetchProfile();
      return true;
    } catch {
      return false;
    }
  }

  async signup(email: string, name: string, password: string): Promise<boolean> {
    try {
      await firstValueFrom(this.api.signup({ email, name, password }));
      return await this.login(email, password);
    } catch {
      return false;
    }
  }

  logout() {
    this.clearTokens();
    this.userSignal.set(null);
    this.router.navigate(['/']);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  setTokens(access: string, refresh: string) {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
  }

  clearTokens() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  async refreshAccessToken(): Promise<boolean> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return false;
    try {
      const response = await firstValueFrom(this.api.refreshToken(refreshToken));
      this.setTokens(response.access_token, response.refresh_token);
      return true;
    } catch {
      this.clearTokens();
      this.userSignal.set(null);
      return false;
    }
  }
}
