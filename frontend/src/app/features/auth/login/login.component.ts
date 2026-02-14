import { Component, ChangeDetectorRef } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule, TranslatePipe],
  template: `
    <div class="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-slate-50 via-emerald-50/20 to-teal-50/30 px-4 md:px-6 py-8 md:py-12">
      <div class="w-full max-w-[400px]">

        <!-- Header -->
        <div class="text-center mb-6 md:mb-8">
          <div class="w-14 md:w-16 h-14 md:h-16 rounded-2xl bg-gradient-to-br from-emerald-500 via-green-600 to-teal-700 flex items-center justify-center mx-auto mb-4 md:mb-5 shadow-xl shadow-emerald-600/20">
            <span class="material-symbols-outlined text-white" style="font-size:28px">person</span>
          </div>
          <h1 class="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">{{ 'AUTH.LOGIN_TITLE' | translate }}</h1>
          <p class="text-[13px] md:text-[14px] text-slate-500 mt-2 font-medium">{{ 'AUTH.LOGIN_SUBTITLE' | translate }}</p>
        </div>

        <!-- Card -->
        <div class="bg-white rounded-2xl border border-slate-200/80 shadow-lg shadow-emerald-100/20 p-6 md:p-8">
          @if (error) {
            <div class="mb-5 md:mb-6 p-3.5 bg-red-50 border border-red-100 rounded-xl text-[13px] text-red-600 text-center font-medium flex items-center justify-center gap-2">
              <span class="material-symbols-outlined" style="font-size:16px">error</span>
              {{ error }}
            </div>
          }

          <form (ngSubmit)="onLogin()" class="space-y-4 md:space-y-5">
            <div>
              <label class="block text-[13px] font-semibold text-slate-700 mb-1.5">{{ 'AUTH.EMAIL' | translate }}</label>
              <div class="relative">
                <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" style="font-size:18px">mail</span>
                <input type="email" [(ngModel)]="email" name="email" required
                  class="w-full pl-11 pr-4 py-3.5 md:py-3 bg-slate-50 border border-slate-200 rounded-xl text-[16px] md:text-[15px] font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                  placeholder="you@example.com">
              </div>
            </div>

            <div>
              <label class="block text-[13px] font-semibold text-slate-700 mb-1.5">{{ 'AUTH.PASSWORD' | translate }}</label>
              <div class="relative">
                <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" style="font-size:18px">lock</span>
                <input type="password" [(ngModel)]="password" name="password" required
                  class="w-full pl-11 pr-4 py-3.5 md:py-3 bg-slate-50 border border-slate-200 rounded-xl text-[16px] md:text-[15px] font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                  placeholder="Enter your password">
              </div>
            </div>

            <button type="submit" [disabled]="loading"
              class="w-full py-3.5 md:py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[15px] font-semibold rounded-xl hover:from-emerald-500 hover:to-teal-500 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer border-none shadow-lg shadow-emerald-600/20">
              @if (loading) {
                <span class="inline-flex items-center gap-2">
                  <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"/><path fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" class="opacity-75"/></svg>
                  Signing in...
                </span>
              } @else {
                {{ 'AUTH.LOGIN_BUTTON' | translate }}
              }
            </button>
          </form>
        </div>

        <!-- Bottom link -->
        <p class="text-center mt-5 md:mt-6 text-[14px] text-slate-500 font-medium">
          {{ 'AUTH.NO_ACCOUNT' | translate }}
          <a routerLink="/signup" class="text-emerald-600 font-semibold hover:text-emerald-700 no-underline ml-1">{{ 'AUTH.SIGNUP_LINK' | translate }}</a>
        </p>
      </div>
    </div>
  `,
  styles: [`:host { display: block; } a { text-decoration: none; }`],
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(private auth: AuthService, private router: Router, private cdr: ChangeDetectorRef) {}

  async onLogin() {
    this.error = '';
    this.loading = true;
    this.cdr.detectChanges();
    const success = await this.auth.login(this.email, this.password);
    this.loading = false;
    if (success) {
      this.router.navigate(['/dashboard']);
    } else {
      this.error = 'Invalid email or password. Please try again.';
    }
    this.cdr.detectChanges();
  }
}
