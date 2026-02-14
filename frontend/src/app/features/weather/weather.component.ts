import { Component, ChangeDetectorRef } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [FormsModule, TranslatePipe, DecimalPipe],
  template: `
    <div class="min-h-[calc(100vh-64px)] bg-gradient-to-b from-sky-50/40 to-[#f8faf8]">
      <div class="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-16">

        <!-- Header -->
        <div class="text-center mb-8 md:mb-12">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 bg-sky-100/80 rounded-full mb-3 md:mb-4 border border-sky-200/50">
            <span class="material-symbols-outlined filled text-sky-600" style="font-size:14px">cloud</span>
            <span class="text-[12px] md:text-[13px] font-semibold text-sky-800">Real-Time Data</span>
          </div>
          <h1 class="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-2 md:mb-3">{{ 'WEATHER.TITLE' | translate }}</h1>
          <p class="text-slate-500 text-[14px] md:text-[15px] px-2">{{ 'WEATHER.SUBTITLE' | translate }}</p>
        </div>

        <!-- Search -->
        <div class="max-w-xl mx-auto mb-8 md:mb-10">
          <form (ngSubmit)="search()" class="flex gap-2 md:gap-3">
            <div class="flex-1 relative">
              <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" style="font-size:20px">search</span>
              <input type="text" [(ngModel)]="city" name="city" required
                class="w-full pl-11 pr-4 py-3.5 md:py-3.5 bg-white border border-slate-200 rounded-xl text-[16px] md:text-[15px] font-medium text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition placeholder-slate-400"
                [placeholder]="'WEATHER.CITY' | translate">
            </div>
            <button type="submit" [disabled]="loading"
              class="px-5 md:px-8 py-3.5 bg-gradient-to-r from-sky-600 to-blue-600 text-white text-[15px] font-semibold rounded-xl hover:from-sky-500 hover:to-blue-500 transition-all active:scale-[0.98] cursor-pointer border-none shadow-lg shadow-sky-600/20 disabled:opacity-60">
              <span class="material-symbols-outlined md:hidden" style="font-size:20px">search</span>
              <span class="hidden md:inline">{{ 'WEATHER.SEARCH' | translate }}</span>
            </button>
          </form>
        </div>

        <!-- Current Weather Card -->
        @if (weather) {
          <div class="bg-white rounded-2xl border border-slate-200/80 shadow-lg shadow-sky-100/30 overflow-hidden mb-4 md:mb-6">
            <div class="p-5 md:p-8">
              <div class="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
                <!-- Left: Temp -->
                <div class="text-center md:text-left">
                  <p class="text-[12px] md:text-[13px] font-bold text-sky-600 uppercase tracking-wider mb-1 flex items-center gap-1.5 justify-center md:justify-start">
                    <span class="material-symbols-outlined" style="font-size:16px">location_on</span>
                    {{ weather.city }}, {{ weather.country }}
                  </p>
                  <div class="text-6xl md:text-7xl font-extralight text-slate-900 tracking-tighter">{{ weather.temperature | number:'1.0-0' }}°</div>
                  <p class="text-[14px] md:text-[15px] text-slate-500 capitalize mt-1 font-medium">{{ weather.description }}</p>
                </div>

                <!-- Right: Details -->
                <div class="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full">
                  @for (stat of getWeatherStats(); track stat.label) {
                    <div class="bg-slate-50/80 rounded-xl p-3.5 md:p-4 text-center border border-slate-100">
                      <span class="material-symbols-outlined text-sky-500 mb-1.5 md:mb-2" style="font-size:22px">{{ stat.icon }}</span>
                      <p class="text-[16px] md:text-[18px] font-bold text-slate-800">{{ stat.value }}</p>
                      <p class="text-[10px] md:text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">{{ stat.label }}</p>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        }

        <!-- Forecast -->
        @if (forecast.length) {
          <div class="bg-white rounded-2xl border border-slate-200/80 shadow-lg shadow-sky-100/30 overflow-hidden">
            <div class="px-5 md:px-8 py-4 border-b border-slate-100 flex items-center gap-2">
              <span class="material-symbols-outlined text-sky-600" style="font-size:20px">calendar_month</span>
              <h3 class="text-[14px] md:text-[15px] font-bold text-slate-900">5-Day Forecast</h3>
            </div>
            <div class="divide-y divide-slate-50">
              @for (day of forecast; track day.date) {
                <div class="px-5 md:px-8 py-3.5 md:py-4 flex items-center gap-3 md:gap-4">
                  <p class="w-20 md:w-28 text-[12px] md:text-[13px] font-semibold text-slate-500">{{ day.date }}</p>
                  <span class="material-symbols-outlined text-sky-500" style="font-size:22px">{{ getWeatherIcon(day.description) }}</span>
                  <p class="flex-1 text-[13px] md:text-[14px] text-slate-600 capitalize font-medium truncate">{{ day.description }}</p>
                  <div class="text-right shrink-0">
                    <span class="text-[14px] md:text-[15px] font-bold text-slate-800">{{ day.temp_max | number:'1.0-0' }}°</span>
                    <span class="text-[12px] md:text-[13px] text-slate-400 font-medium ml-1">{{ day.temp_min | number:'1.0-0' }}°</span>
                  </div>
                </div>
              }
            </div>
          </div>
        }

        @if (error) {
          <div class="mt-4 md:mt-6 bg-red-50 border border-red-100 rounded-xl p-4 text-center text-[14px] text-red-600 flex items-center justify-center gap-2">
            <span class="material-symbols-outlined" style="font-size:18px">error</span>
            {{ error }}
          </div>
        }
      </div>
    </div>
  `,
  styles: [`:host { display: block; }`],
})
export class WeatherComponent {
  city = '';
  weather: any = null;
  forecast: any[] = [];
  loading = false;
  error = '';

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {}

  processForecast(forecasts: any[]) {
    const grouped: { [date: string]: { temps: number[]; descriptions: string[] } } = {};
    for (const f of forecasts) {
      const date = f.datetime?.split(' ')[0] || '';
      if (!grouped[date]) grouped[date] = { temps: [], descriptions: [] };
      grouped[date].temps.push(f.temperature);
      grouped[date].descriptions.push(f.description);
    }
    this.forecast = Object.entries(grouped).slice(0, 5).map(([date, data]) => ({
      date: new Date(date).toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' }),
      temp_max: Math.max(...data.temps),
      temp_min: Math.min(...data.temps),
      description: data.descriptions[Math.floor(data.descriptions.length / 2)],
    }));
    this.cdr.detectChanges();
  }

  search() {
    if (!this.city.trim()) return;
    this.error = '';
    this.weather = null;
    this.forecast = [];
    this.loading = true;

    this.api.getWeather(this.city).subscribe({
      next: (res) => { this.weather = res; this.loading = false; this.cdr.detectChanges(); },
      error: (err) => { this.error = err.error?.detail || 'City not found.'; this.loading = false; this.cdr.detectChanges(); },
    });

    this.api.getForecast(this.city).subscribe({
      next: (res) => this.processForecast(res.forecasts || []),
      error: () => {},
    });
  }

  getWeatherStats() {
    if (!this.weather) return [];
    return [
      { icon: 'water_drop', value: this.weather.humidity + '%', label: 'Humidity' },
      { icon: 'air', value: this.weather.wind_speed + ' m/s', label: 'Wind' },
      { icon: 'thermostat', value: (this.weather.feels_like?.toFixed(0) || '--') + '°', label: 'Feels Like' },
      { icon: 'visibility', value: ((this.weather.visibility || 0) / 1000).toFixed(0) + ' km', label: 'Visibility' },
    ];
  }

  getWeatherIcon(desc: string): string {
    const d = (desc || '').toLowerCase();
    if (d.includes('clear') || d.includes('sunny')) return 'clear_day';
    if (d.includes('cloud')) return 'cloud';
    if (d.includes('rain') || d.includes('drizzle')) return 'rainy';
    if (d.includes('thunder') || d.includes('storm')) return 'thunderstorm';
    if (d.includes('snow')) return 'weather_snowy';
    if (d.includes('fog') || d.includes('mist') || d.includes('haze')) return 'foggy';
    return 'partly_cloudy_day';
  }
}
