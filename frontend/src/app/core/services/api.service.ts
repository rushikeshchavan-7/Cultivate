import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private get lang(): string {
    return localStorage.getItem('lang') || 'en';
  }

  // Auth
  signup(data: { email: string; name: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/signup`, data);
  }

  login(data: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, data);
  }

  refreshToken(refreshToken: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/refresh`, { refresh_token: refreshToken });
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.baseUrl}/auth/profile`);
  }

  // Crop
  predictCrop(data: any, authenticated = false): Observable<any> {
    const endpoint = authenticated ? '/crop/predict/auth' : '/crop/predict';
    return this.http.post(`${this.baseUrl}${endpoint}?lang=${this.lang}`, data);
  }

  // Fertilizer
  getAvailableCrops(): Observable<any> {
    return this.http.get(`${this.baseUrl}/fertilizer/crops?lang=${this.lang}`);
  }

  predictFertilizer(data: any, authenticated = false): Observable<any> {
    const endpoint = authenticated ? '/fertilizer/predict/auth' : '/fertilizer/predict';
    return this.http.post(`${this.baseUrl}${endpoint}?lang=${this.lang}`, data);
  }

  // Disease
  predictDisease(file: File, authenticated = false): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    const endpoint = authenticated ? '/disease/predict/auth' : '/disease/predict';
    return this.http.post(`${this.baseUrl}${endpoint}?lang=${this.lang}`, formData);
  }

  // Weather
  getWeather(city: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/weather/${city}?lang=${this.lang}`);
  }

  getForecast(city: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/weather/${city}/forecast?lang=${this.lang}`);
  }

  // Chatbot
  sendMessage(message: string, history?: any[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/chatbot/message`, { message, history, lang: this.lang });
  }

  // Dashboard
  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.baseUrl}/dashboard/stats`);
  }

  getPredictionHistory(page = 1, pageSize = 10, type?: string): Observable<any> {
    let url = `${this.baseUrl}/dashboard/history?page=${page}&page_size=${pageSize}`;
    if (type) url += `&prediction_type=${type}`;
    return this.http.get(url);
  }
}
