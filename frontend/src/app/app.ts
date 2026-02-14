import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AuthService } from './core/services/auth.service';
import { ChatbotComponent } from './features/chatbot/chatbot.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, TranslatePipe, ChatbotComponent],
  template: `
    <div class="min-h-screen flex flex-col bg-[#f8faf8]">

      <!-- Top Navbar -->
      <nav class="sticky top-0 z-50 backdrop-blur-2xl bg-white/75 border-b border-emerald-100/60 shadow-[0_1px_3px_rgba(0,0,0,0.04)] safe-top">
        <div class="max-w-7xl mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center justify-between">
          <!-- Logo -->
          <a routerLink="/" class="flex items-center gap-2.5 no-underline group">
            <div class="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-gradient-to-br from-emerald-500 via-green-600 to-teal-700 flex items-center justify-center shadow-md shadow-emerald-600/25">
              <span class="material-symbols-outlined filled text-white" style="font-size:18px">eco</span>
            </div>
            <span class="text-[16px] md:text-[17px] font-bold tracking-tight text-slate-800">Cultivate <span class="text-emerald-600">365</span></span>
          </a>

          <!-- Desktop Links -->
          <div class="hidden md:flex items-center gap-0.5 bg-slate-100/60 rounded-full p-1">
            <a routerLink="/crop" routerLinkActive="!bg-white !text-emerald-700 !shadow-sm"
               class="px-4 py-1.5 rounded-full text-[13px] font-semibold text-slate-500 hover:text-slate-700 transition-all no-underline flex items-center gap-1.5">
              <span class="material-symbols-outlined" style="font-size:16px">grass</span>
              {{ 'NAV.CROP' | translate }}
            </a>
            <a routerLink="/fertilizer" routerLinkActive="!bg-white !text-emerald-700 !shadow-sm"
               class="px-4 py-1.5 rounded-full text-[13px] font-semibold text-slate-500 hover:text-slate-700 transition-all no-underline flex items-center gap-1.5">
              <span class="material-symbols-outlined" style="font-size:16px">science</span>
              {{ 'NAV.FERTILIZER' | translate }}
            </a>
            <a routerLink="/disease" routerLinkActive="!bg-white !text-emerald-700 !shadow-sm"
               class="px-4 py-1.5 rounded-full text-[13px] font-semibold text-slate-500 hover:text-slate-700 transition-all no-underline flex items-center gap-1.5">
              <span class="material-symbols-outlined" style="font-size:16px">biotech</span>
              {{ 'NAV.DISEASE' | translate }}
            </a>
            <a routerLink="/weather" routerLinkActive="!bg-white !text-emerald-700 !shadow-sm"
               class="px-4 py-1.5 rounded-full text-[13px] font-semibold text-slate-500 hover:text-slate-700 transition-all no-underline flex items-center gap-1.5">
              <span class="material-symbols-outlined" style="font-size:16px">partly_cloudy_day</span>
              {{ 'NAV.WEATHER' | translate }}
            </a>
          </div>

          <!-- Right side -->
          <div class="flex items-center gap-1.5 md:gap-2">
            <!-- Language -->
            <button (click)="toggleLang()" class="text-[11px] md:text-[12px] font-bold text-slate-400 hover:text-emerald-600 px-2 py-2 md:px-2.5 md:py-1.5 rounded-lg hover:bg-emerald-50 transition cursor-pointer bg-transparent border-none tracking-wide min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 flex items-center justify-center">
              {{ langLabel }}
            </button>

            @if (auth.isAuthenticated()) {
              <a routerLink="/dashboard" class="hidden md:flex items-center gap-1.5 text-[13px] font-semibold text-slate-600 hover:text-emerald-700 no-underline px-3 py-1.5 rounded-lg hover:bg-emerald-50 transition">
                <span class="material-symbols-outlined" style="font-size:16px">dashboard</span>
                Dashboard
              </a>
              <button (click)="auth.logout()"
                class="text-slate-400 hover:text-red-500 transition cursor-pointer bg-transparent border-none p-2 rounded-lg hover:bg-red-50 min-w-[44px] min-h-[44px] flex items-center justify-center">
                <span class="material-symbols-outlined" style="font-size:20px">logout</span>
              </button>
            } @else {
              <a routerLink="/login" class="hidden md:block text-[13px] font-semibold text-slate-600 hover:text-emerald-700 no-underline px-3 py-1.5 rounded-lg hover:bg-emerald-50 transition">
                {{ 'NAV.LOGIN' | translate }}
              </a>
              <a routerLink="/signup"
                class="text-[12px] md:text-[13px] font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 px-4 py-2 md:px-5 rounded-full transition-all no-underline shadow-md shadow-emerald-600/20">
                {{ 'AUTH.SIGNUP_BUTTON' | translate }}
              </a>
            }
          </div>
        </div>
      </nav>

      <!-- Content (with bottom padding for mobile nav) -->
      <main class="flex-1 pb-20 md:pb-0">
        <router-outlet></router-outlet>
      </main>

      <!-- Footer (hidden on mobile, visible on desktop) -->
      <footer class="hidden md:block border-t border-emerald-100/60 bg-gradient-to-b from-white to-emerald-50/30">
        <div class="max-w-7xl mx-auto px-6 py-10">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-[13px]">
            <div>
              <h4 class="font-bold text-slate-800 mb-3 flex items-center gap-1.5">
                <span class="material-symbols-outlined text-emerald-600" style="font-size:16px">build</span>
                Tools
              </h4>
              <div class="space-y-2.5">
                <a routerLink="/crop" class="block text-slate-500 hover:text-emerald-700 no-underline transition">Crop Recommendation</a>
                <a routerLink="/fertilizer" class="block text-slate-500 hover:text-emerald-700 no-underline transition">Fertilizer Advice</a>
                <a routerLink="/disease" class="block text-slate-500 hover:text-emerald-700 no-underline transition">Disease Detection</a>
                <a routerLink="/weather" class="block text-slate-500 hover:text-emerald-700 no-underline transition">Weather</a>
              </div>
            </div>
            <div>
              <h4 class="font-bold text-slate-800 mb-3 flex items-center gap-1.5">
                <span class="material-symbols-outlined text-emerald-600" style="font-size:16px">person</span>
                Account
              </h4>
              <div class="space-y-2.5">
                <a routerLink="/login" class="block text-slate-500 hover:text-emerald-700 no-underline transition">Sign In</a>
                <a routerLink="/signup" class="block text-slate-500 hover:text-emerald-700 no-underline transition">Create Account</a>
                <a routerLink="/dashboard" class="block text-slate-500 hover:text-emerald-700 no-underline transition">Dashboard</a>
              </div>
            </div>
            <div>
              <h4 class="font-bold text-slate-800 mb-3 flex items-center gap-1.5">
                <span class="material-symbols-outlined text-emerald-600" style="font-size:16px">code</span>
                Built With
              </h4>
              <div class="space-y-2.5 text-slate-500">
                <p>Angular &middot; FastAPI</p>
                <p>PyTorch &middot; scikit-learn</p>
                <p>Google Gemini AI</p>
              </div>
            </div>
            <div>
              <h4 class="font-bold text-slate-800 mb-3 flex items-center gap-1.5">
                <span class="material-symbols-outlined filled text-emerald-600" style="font-size:16px">eco</span>
                Cultivate 365
              </h4>
              <p class="text-slate-500 leading-relaxed">AI-powered agricultural decision support for modern Indian farmers.</p>
            </div>
          </div>
          <div class="mt-10 pt-6 border-t border-emerald-100/60 flex items-center justify-center gap-2 text-[12px] text-slate-400">
            <span class="material-symbols-outlined filled text-emerald-400" style="font-size:14px">eco</span>
            &copy; 2026 Cultivate 365. All rights reserved.
          </div>
        </div>
      </footer>

      <!-- Mobile Bottom Navigation -->
      <nav class="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-2xl border-t border-slate-200/60 safe-bottom">
        <div class="grid grid-cols-5 h-16 max-w-lg mx-auto">
          <a routerLink="/" routerLinkActive="text-emerald-600" [routerLinkActiveOptions]="{exact: true}"
             class="flex flex-col items-center justify-center gap-0.5 no-underline text-slate-400 active:scale-95 transition-transform touch-action-manipulation">
            <span class="material-symbols-outlined" style="font-size:24px">home</span>
            <span class="text-[10px] font-semibold">Home</span>
          </a>
          <a routerLink="/crop" routerLinkActive="text-emerald-600"
             class="flex flex-col items-center justify-center gap-0.5 no-underline text-slate-400 active:scale-95 transition-transform touch-action-manipulation">
            <span class="material-symbols-outlined" style="font-size:24px">grass</span>
            <span class="text-[10px] font-semibold">Crop</span>
          </a>
          <a routerLink="/disease" routerLinkActive="text-emerald-600"
             class="flex flex-col items-center justify-center gap-0.5 no-underline text-slate-400 active:scale-95 transition-transform touch-action-manipulation">
            <span class="material-symbols-outlined" style="font-size:24px">biotech</span>
            <span class="text-[10px] font-semibold">Disease</span>
          </a>
          <a routerLink="/weather" routerLinkActive="text-emerald-600"
             class="flex flex-col items-center justify-center gap-0.5 no-underline text-slate-400 active:scale-95 transition-transform touch-action-manipulation">
            <span class="material-symbols-outlined" style="font-size:24px">partly_cloudy_day</span>
            <span class="text-[10px] font-semibold">Weather</span>
          </a>
          @if (auth.isAuthenticated()) {
            <a routerLink="/dashboard" routerLinkActive="text-emerald-600"
               class="flex flex-col items-center justify-center gap-0.5 no-underline text-slate-400 active:scale-95 transition-transform touch-action-manipulation">
              <span class="material-symbols-outlined" style="font-size:24px">dashboard</span>
              <span class="text-[10px] font-semibold">Dashboard</span>
            </a>
          } @else {
            <a routerLink="/login" routerLinkActive="text-emerald-600"
               class="flex flex-col items-center justify-center gap-0.5 no-underline text-slate-400 active:scale-95 transition-transform touch-action-manipulation">
              <span class="material-symbols-outlined" style="font-size:24px">person</span>
              <span class="text-[10px] font-semibold">Login</span>
            </a>
          }
        </div>
      </nav>

      <app-chatbot></app-chatbot>
    </div>
  `,
  styles: [`
    :host { display: block; }
    a { text-decoration: none; }
    .safe-top { padding-top: env(safe-area-inset-top); }
    .safe-bottom { padding-bottom: env(safe-area-inset-bottom); }
  `],
})
export class App {
  currentLang = 'en';
  private langs = ['en', 'hi', 'mr'];
  private langLabels: Record<string, string> = { en: 'हिन्दी', hi: 'मराठी', mr: 'EN' };

  get langLabel(): string {
    return this.langLabels[this.currentLang] || 'EN';
  }

  constructor(public auth: AuthService, private translate: TranslateService) {
    this.currentLang = localStorage.getItem('lang') || 'en';
    translate.setDefaultLang('en');
    translate.use(this.currentLang);
  }

  toggleLang() {
    const idx = this.langs.indexOf(this.currentLang);
    this.currentLang = this.langs[(idx + 1) % this.langs.length];
    this.translate.use(this.currentLang);
    localStorage.setItem('lang', this.currentLang);
  }
}
