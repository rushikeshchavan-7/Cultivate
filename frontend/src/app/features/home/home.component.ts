import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  template: `
    <!-- Hero -->
    <section class="relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-emerald-50 via-green-50/80 to-teal-50/60"></div>
      <div class="absolute top-16 right-8 md:right-16 w-60 md:w-80 h-60 md:h-80 bg-emerald-300/20 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 left-0 w-72 md:w-[500px] h-72 md:h-[500px] bg-teal-200/15 rounded-full blur-3xl"></div>

      <div class="relative max-w-5xl mx-auto px-5 md:px-6 pt-16 md:pt-28 pb-16 md:pb-24 text-center">
        <div class="inline-flex items-center gap-2 px-3.5 md:px-4 py-1.5 md:py-2 bg-emerald-100/80 backdrop-blur-sm rounded-full mb-6 md:mb-8 border border-emerald-200/50">
          <span class="material-symbols-outlined filled text-emerald-600" style="font-size:14px">auto_awesome</span>
          <span class="text-[12px] md:text-[13px] font-semibold text-emerald-800 tracking-wide">AI-Powered Agriculture</span>
        </div>

        <h1 class="text-3xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1] md:leading-[1.05] mb-4 md:mb-6">
          {{ 'HOME.HERO_TITLE' | translate }}
        </h1>

        <p class="text-[15px] md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-8 md:mb-12 px-2">
          {{ 'HOME.HERO_SUBTITLE' | translate }}
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
          <a routerLink="/crop"
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 md:px-8 py-3.5 md:py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[15px] font-semibold rounded-full hover:from-emerald-500 hover:to-teal-500 transition-all active:scale-[0.97] no-underline shadow-xl shadow-emerald-600/25">
            <span class="material-symbols-outlined" style="font-size:18px">arrow_forward</span>
            {{ 'HOME.GET_STARTED' | translate }}
          </a>
          <a routerLink="/signup"
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 md:px-8 py-3.5 md:py-4 text-[15px] font-semibold text-slate-700 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-full hover:bg-white transition-all active:scale-[0.97] no-underline">
            <span class="material-symbols-outlined" style="font-size:18px">person_add</span>
            {{ 'HOME.CREATE_ACCOUNT' | translate }}
          </a>
        </div>
      </div>
    </section>

    <!-- Features Grid -->
    <section class="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-28">
      <div class="text-center mb-10 md:mb-16">
        <h2 class="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3 md:mb-4">{{ 'HOME.FEATURES_TITLE' | translate }}</h2>
        <p class="text-slate-500 text-[15px] md:text-lg max-w-xl mx-auto px-2">{{ 'HOME.FEATURES_SUBTITLE' | translate }}</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        @for (feature of features; track feature.title) {
          <a [routerLink]="feature.route"
            class="group relative p-6 md:p-8 rounded-2xl border border-slate-200/80 bg-white hover:border-emerald-200 hover:shadow-2xl hover:shadow-emerald-100/50 transition-all duration-300 no-underline overflow-hidden active:scale-[0.98]">
            <div class="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300" [style.background]="'linear-gradient(135deg, ' + feature.bg + '33, transparent)'"></div>
            <div class="relative flex items-start gap-4">
              <div class="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm" [style.background]="feature.bg">
                <span class="material-symbols-outlined" [style.color]="feature.iconColor" style="font-size:24px">{{ feature.icon }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-[15px] md:text-[17px] font-bold text-slate-900 mb-1">{{ feature.title | translate }}</h3>
                <p class="text-[13px] md:text-[14px] text-slate-500 leading-relaxed">{{ feature.desc | translate }}</p>
              </div>
              <span class="material-symbols-outlined text-emerald-500 opacity-0 group-hover:opacity-100 transition-all shrink-0 mt-1 hidden md:block" style="font-size:20px">arrow_forward</span>
            </div>
          </a>
        }
      </div>
    </section>

    <!-- How It Works -->
    <section class="bg-gradient-to-b from-emerald-50/40 to-white border-y border-emerald-100/60">
      <div class="max-w-5xl mx-auto px-4 md:px-6 py-16 md:py-28">
        <div class="text-center mb-10 md:mb-16">
          <h2 class="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3 md:mb-4">{{ 'HOME.HOW_TITLE' | translate }}</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          @for (step of steps; track step.num; let i = $index) {
            <div class="text-center">
              <div class="w-14 md:w-16 h-14 md:h-16 rounded-2xl bg-white border border-emerald-100 shadow-lg shadow-emerald-100/50 flex items-center justify-center mx-auto mb-4 md:mb-6">
                <span class="material-symbols-outlined filled text-emerald-600" style="font-size:26px">{{ step.icon }}</span>
              </div>
              <div class="text-[11px] font-bold text-emerald-500 uppercase tracking-widest mb-2">Step 0{{ step.num }}</div>
              <h3 class="text-[15px] md:text-[16px] font-bold text-slate-900 mb-2">{{ step.title | translate }}</h3>
              <p class="text-[13px] md:text-[14px] text-slate-500 leading-relaxed px-4 md:px-0">{{ step.desc | translate }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="max-w-5xl mx-auto px-4 md:px-6 py-16 md:py-28 text-center">
      <div class="relative p-8 md:p-20 rounded-3xl bg-gradient-to-br from-emerald-800 via-green-800 to-teal-900 overflow-hidden">
        <div class="absolute top-0 right-0 w-48 md:w-72 h-48 md:h-72 bg-emerald-400/10 rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 left-0 w-48 md:w-72 h-48 md:h-72 bg-teal-400/10 rounded-full blur-3xl"></div>
        <div class="relative">
          <h2 class="text-2xl md:text-4xl font-extrabold text-white tracking-tight mb-3 md:mb-4">{{ 'HOME.CTA_TITLE' | translate }}</h2>
          <p class="text-emerald-200/70 text-[15px] md:text-lg mb-8 md:mb-10 max-w-lg mx-auto">{{ 'HOME.CTA_SUBTITLE' | translate }}</p>
          <a routerLink="/signup"
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 md:py-4 bg-white text-emerald-800 text-[15px] font-bold rounded-full hover:bg-emerald-50 transition-all active:scale-[0.97] no-underline shadow-2xl shadow-black/20">
            {{ 'HOME.CTA_BUTTON' | translate }}
            <span class="material-symbols-outlined" style="font-size:18px">arrow_forward</span>
          </a>
        </div>
      </div>
    </section>
  `,
  styles: [`:host { display: block; } a { text-decoration: none; }`],
})
export class HomeComponent {
  features = [
    { icon: 'grass', title: 'HOME.FEAT_CROP_TITLE', desc: 'HOME.FEAT_CROP_DESC', route: '/crop', bg: '#ecfdf5', iconColor: '#059669' },
    { icon: 'science', title: 'HOME.FEAT_FERT_TITLE', desc: 'HOME.FEAT_FERT_DESC', route: '/fertilizer', bg: '#eff6ff', iconColor: '#2563eb' },
    { icon: 'biotech', title: 'HOME.FEAT_DISEASE_TITLE', desc: 'HOME.FEAT_DISEASE_DESC', route: '/disease', bg: '#fef9ee', iconColor: '#b45309' },
    { icon: 'partly_cloudy_day', title: 'HOME.FEAT_WEATHER_TITLE', desc: 'HOME.FEAT_WEATHER_DESC', route: '/weather', bg: '#f0f9ff', iconColor: '#0284c7' },
  ];

  steps = [
    { num: 1, title: 'HOME.STEP1_TITLE', desc: 'HOME.STEP1_DESC', icon: 'edit_note' },
    { num: 2, title: 'HOME.STEP2_TITLE', desc: 'HOME.STEP2_DESC', icon: 'model_training' },
    { num: 3, title: 'HOME.STEP3_TITLE', desc: 'HOME.STEP3_DESC', icon: 'task_alt' },
  ];
}
