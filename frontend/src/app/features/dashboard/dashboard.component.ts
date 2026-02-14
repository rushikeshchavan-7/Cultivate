import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  template: `
    <div class="min-h-[calc(100vh-64px)] bg-[#f8faf8]">
      <div class="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10">

        <!-- Header -->
        <div class="mb-6 md:mb-10">
          <h1 class="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span class="material-symbols-outlined filled text-emerald-600" style="font-size:28px">dashboard</span>
            {{ 'DASH.TITLE' | translate }}
          </h1>
          <p class="text-slate-500 mt-1 font-medium text-[14px]">{{ 'DASH.WELCOME' | translate }}, {{ auth.user()?.name || 'User' }}</p>
        </div>

        <!-- Stats Row -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          @for (stat of stats; track stat.label) {
            <div class="bg-white rounded-xl border border-slate-200/80 p-4 md:p-5 shadow-sm">
              <div class="flex items-center justify-between mb-2.5 md:mb-3">
                <div class="w-9 md:w-10 h-9 md:h-10 rounded-xl flex items-center justify-center" [style.background]="stat.bg">
                  <span class="material-symbols-outlined" [style.color]="stat.color" style="font-size:20px">{{ stat.icon }}</span>
                </div>
                <span class="text-[11px] md:text-[12px] font-bold px-2 py-0.5 md:py-1 rounded-full" [style.background]="stat.bg" [style.color]="stat.color">{{ stat.count }}</span>
              </div>
              <p class="text-[12px] md:text-[13px] font-semibold text-slate-500">{{ stat.label }}</p>
            </div>
          }
        </div>

        <!-- Quick Actions + Distribution -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          <!-- Quick Actions -->
          <div class="bg-white rounded-xl border border-slate-200/80 p-5 md:p-6 shadow-sm">
            <h3 class="text-[14px] md:text-[15px] font-bold text-slate-900 mb-3 md:mb-4 flex items-center gap-2">
              <span class="material-symbols-outlined text-emerald-600" style="font-size:20px">bolt</span>
              {{ 'DASH.QUICK_ACTIONS' | translate }}
            </h3>
            <div class="grid grid-cols-2 gap-2.5 md:gap-3">
              <a routerLink="/crop" class="flex items-center gap-2.5 md:gap-3 p-3 md:p-3.5 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition no-underline border border-emerald-100/50 active:scale-[0.97]">
                <span class="material-symbols-outlined text-emerald-600" style="font-size:20px">grass</span>
                <span class="text-[12px] md:text-[13px] font-semibold text-emerald-800">Crop</span>
              </a>
              <a routerLink="/fertilizer" class="flex items-center gap-2.5 md:gap-3 p-3 md:p-3.5 bg-blue-50 rounded-xl hover:bg-blue-100 transition no-underline border border-blue-100/50 active:scale-[0.97]">
                <span class="material-symbols-outlined text-blue-600" style="font-size:20px">science</span>
                <span class="text-[12px] md:text-[13px] font-semibold text-blue-800">Fertilizer</span>
              </a>
              <a routerLink="/disease" class="flex items-center gap-2.5 md:gap-3 p-3 md:p-3.5 bg-amber-50 rounded-xl hover:bg-amber-100 transition no-underline border border-amber-100/50 active:scale-[0.97]">
                <span class="material-symbols-outlined text-amber-600" style="font-size:20px">biotech</span>
                <span class="text-[12px] md:text-[13px] font-semibold text-amber-800">Disease</span>
              </a>
              <a routerLink="/weather" class="flex items-center gap-2.5 md:gap-3 p-3 md:p-3.5 bg-sky-50 rounded-xl hover:bg-sky-100 transition no-underline border border-sky-100/50 active:scale-[0.97]">
                <span class="material-symbols-outlined text-sky-600" style="font-size:20px">partly_cloudy_day</span>
                <span class="text-[12px] md:text-[13px] font-semibold text-sky-800">Weather</span>
              </a>
            </div>
          </div>

          <!-- Distribution -->
          <div class="bg-white rounded-xl border border-slate-200/80 p-5 md:p-6 shadow-sm">
            <h3 class="text-[14px] md:text-[15px] font-bold text-slate-900 mb-3 md:mb-4 flex items-center gap-2">
              <span class="material-symbols-outlined text-emerald-600" style="font-size:20px">pie_chart</span>
              {{ 'DASH.DISTRIBUTION' | translate }}
            </h3>
            @if (totalPredictions > 0) {
              <div class="space-y-3.5 md:space-y-4">
                @for (bar of distributionBars; track bar.label) {
                  <div>
                    <div class="flex items-center justify-between mb-1.5">
                      <span class="text-[12px] md:text-[13px] font-semibold text-slate-600 flex items-center gap-1.5">
                        <span class="material-symbols-outlined" [style.color]="bar.color" style="font-size:16px">{{ bar.icon }}</span>
                        {{ bar.label }}
                      </span>
                      <span class="text-[11px] md:text-[12px] font-bold text-slate-400">{{ bar.count }}</span>
                    </div>
                    <div class="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div class="h-full rounded-full transition-all duration-700 ease-out" [style.width.%]="bar.pct" [style.background]="bar.color"></div>
                    </div>
                  </div>
                }
              </div>
            } @else {
              <div class="text-center py-6 md:py-8 text-slate-400 text-[13px] md:text-[14px] flex flex-col items-center gap-2">
                <span class="material-symbols-outlined" style="font-size:32px">bar_chart</span>
                {{ 'DASH.NO_PREDICTIONS' | translate }}
              </div>
            }
          </div>
        </div>

        <!-- Recent History -->
        <div class="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-sm">
          <div class="px-4 md:px-6 py-3.5 md:py-4 border-b border-slate-100 flex items-center gap-2">
            <span class="material-symbols-outlined text-emerald-600" style="font-size:20px">history</span>
            <h3 class="text-[14px] md:text-[15px] font-bold text-slate-900">{{ 'DASH.RECENT' | translate }}</h3>
          </div>

          @if (history.length) {
            <div class="divide-y divide-slate-50">
              @for (item of history; track item.id) {
                <div class="px-4 md:px-6 py-3.5 md:py-4 flex items-center gap-3 md:gap-4">
                  <div class="w-9 md:w-10 h-9 md:h-10 rounded-xl flex items-center justify-center border shrink-0"
                    [style.background]="getTypeBg(item.prediction_type)"
                    [style.border-color]="getTypeBg(item.prediction_type)">
                    <span class="material-symbols-outlined" [style.color]="getTypeColor(item.prediction_type)" style="font-size:18px">{{ getTypeIcon(item.prediction_type) }}</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-[13px] md:text-[14px] font-semibold text-slate-800 truncate">{{ item.result }}</p>
                    <p class="text-[11px] md:text-[12px] text-slate-400 font-medium">{{ item.prediction_type }} &middot; {{ formatDate(item.created_at) }}</p>
                  </div>
                </div>
              }
            </div>
          } @else {
            <div class="p-8 md:p-12 text-center text-slate-400 text-[13px] md:text-[14px] flex flex-col items-center gap-2">
              <span class="material-symbols-outlined" style="font-size:32px">inbox</span>
              {{ 'DASH.NO_PREDICTIONS' | translate }}
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`:host { display: block; } a { text-decoration: none; }`],
})
export class DashboardComponent implements OnInit {
  stats: any[] = [];
  history: any[] = [];
  distributionBars: any[] = [];
  totalPredictions = 0;

  constructor(public auth: AuthService, private api: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.api.getDashboardStats().subscribe({
      next: (res) => {
        const s = res;
        this.totalPredictions = s.total_predictions || 0;
        this.stats = [
          { icon: 'analytics', label: 'Total', count: s.total_predictions || 0, bg: '#ecfdf5', color: '#059669' },
          { icon: 'grass', label: 'Crop', count: s.crop_predictions || 0, bg: '#ecfdf5', color: '#059669' },
          { icon: 'science', label: 'Fertilizer', count: s.fertilizer_predictions || 0, bg: '#eff6ff', color: '#2563eb' },
          { icon: 'biotech', label: 'Disease', count: s.disease_predictions || 0, bg: '#fef9ee', color: '#b45309' },
        ];
        this.distributionBars = [
          { label: 'Crop', icon: 'grass', count: s.crop_predictions || 0, pct: this.totalPredictions ? ((s.crop_predictions || 0) / this.totalPredictions * 100) : 0, color: '#059669' },
          { label: 'Fertilizer', icon: 'science', count: s.fertilizer_predictions || 0, pct: this.totalPredictions ? ((s.fertilizer_predictions || 0) / this.totalPredictions * 100) : 0, color: '#2563eb' },
          { label: 'Disease', icon: 'biotech', count: s.disease_predictions || 0, pct: this.totalPredictions ? ((s.disease_predictions || 0) / this.totalPredictions * 100) : 0, color: '#b45309' },
        ];
        this.cdr.detectChanges();
      },
      error: () => {},
    });

    this.api.getPredictionHistory(1, 10).subscribe({
      next: (res) => { this.history = res.items || res.history || []; this.cdr.detectChanges(); },
      error: () => {},
    });
  }

  getTypeIcon(type: string): string {
    if (type === 'crop') return 'grass';
    if (type === 'fertilizer') return 'science';
    if (type === 'disease') return 'biotech';
    return 'analytics';
  }

  getTypeBg(type: string): string {
    if (type === 'crop') return '#ecfdf5';
    if (type === 'fertilizer') return '#eff6ff';
    if (type === 'disease') return '#fef9ee';
    return '#f8fafc';
  }

  getTypeColor(type: string): string {
    if (type === 'crop') return '#059669';
    if (type === 'fertilizer') return '#2563eb';
    if (type === 'disease') return '#b45309';
    return '#64748b';
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }
}
