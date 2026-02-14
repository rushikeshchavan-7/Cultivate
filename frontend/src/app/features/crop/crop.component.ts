import { Component, ChangeDetectorRef } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-crop',
  standalone: true,
  imports: [FormsModule, TranslatePipe, DecimalPipe],
  template: `
    <div class="min-h-[calc(100vh-64px)] bg-gradient-to-b from-emerald-50/40 to-[#f8faf8]">
      <div class="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-16">

        <!-- Header -->
        <div class="text-center mb-8 md:mb-12">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-100/80 rounded-full mb-3 md:mb-4 border border-emerald-200/50">
            <span class="material-symbols-outlined filled text-emerald-600" style="font-size:14px">auto_awesome</span>
            <span class="text-[12px] md:text-[13px] font-semibold text-emerald-800">AI-Powered</span>
          </div>
          <h1 class="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-2 md:mb-3">{{ 'CROP.TITLE' | translate }}</h1>
          <p class="text-slate-500 text-[14px] md:text-[15px] px-2">{{ 'CROP.SUBTITLE' | translate }}</p>
        </div>

        <!-- Form Card -->
        <div class="bg-white rounded-2xl border border-slate-200/80 shadow-lg shadow-emerald-100/30 overflow-hidden">
          <div class="p-5 md:p-8">
            <h3 class="text-[14px] md:text-[15px] font-bold text-slate-900 mb-5 md:mb-6 flex items-center gap-2">
              <span class="material-symbols-outlined text-emerald-600" style="font-size:20px">edit_note</span>
              {{ 'CROP.INPUT_TITLE' | translate }}
            </h3>

            <form (ngSubmit)="predict()" class="space-y-4 md:space-y-5">
              <!-- NPK Row - stacked on mobile -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                <div>
                  <label class="block text-[11px] md:text-[12px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">{{ 'CROP.NITROGEN' | translate }}</label>
                  <input type="number" [(ngModel)]="form.nitrogen" name="nitrogen" required
                    class="w-full px-4 py-3.5 md:py-3 bg-slate-50 border border-slate-200 rounded-xl text-[16px] md:text-[15px] font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition placeholder-slate-300"
                    placeholder="0-200">
                </div>
                <div>
                  <label class="block text-[11px] md:text-[12px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">{{ 'CROP.PHOSPHOROUS' | translate }}</label>
                  <input type="number" [(ngModel)]="form.phosphorous" name="phosphorous" required
                    class="w-full px-4 py-3.5 md:py-3 bg-slate-50 border border-slate-200 rounded-xl text-[16px] md:text-[15px] font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition placeholder-slate-300"
                    placeholder="0-200">
                </div>
                <div>
                  <label class="block text-[11px] md:text-[12px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">{{ 'CROP.POTASSIUM' | translate }}</label>
                  <input type="number" [(ngModel)]="form.potassium" name="potassium" required
                    class="w-full px-4 py-3.5 md:py-3 bg-slate-50 border border-slate-200 rounded-xl text-[16px] md:text-[15px] font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition placeholder-slate-300"
                    placeholder="0-200">
                </div>
              </div>

              <!-- Temperature, Humidity, pH, Rainfall - 2 cols on mobile -->
              <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <div>
                  <label class="block text-[11px] md:text-[12px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Temp (°C)</label>
                  <input type="number" step="0.1" [(ngModel)]="form.temperature" name="temperature" required
                    class="w-full px-4 py-3.5 md:py-3 bg-slate-50 border border-slate-200 rounded-xl text-[16px] md:text-[15px] font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition placeholder-slate-300"
                    placeholder="25">
                </div>
                <div>
                  <label class="block text-[11px] md:text-[12px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Humidity (%)</label>
                  <input type="number" step="0.1" [(ngModel)]="form.humidity" name="humidity" required
                    class="w-full px-4 py-3.5 md:py-3 bg-slate-50 border border-slate-200 rounded-xl text-[16px] md:text-[15px] font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition placeholder-slate-300"
                    placeholder="60">
                </div>
                <div>
                  <label class="block text-[11px] md:text-[12px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">{{ 'CROP.PH' | translate }}</label>
                  <input type="number" step="0.1" [(ngModel)]="form.ph" name="ph" required
                    class="w-full px-4 py-3.5 md:py-3 bg-slate-50 border border-slate-200 rounded-xl text-[16px] md:text-[15px] font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition placeholder-slate-300"
                    placeholder="0-14">
                </div>
                <div>
                  <label class="block text-[11px] md:text-[12px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">{{ 'CROP.RAINFALL' | translate }}</label>
                  <input type="number" [(ngModel)]="form.rainfall" name="rainfall" required
                    class="w-full px-4 py-3.5 md:py-3 bg-slate-50 border border-slate-200 rounded-xl text-[16px] md:text-[15px] font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition placeholder-slate-300"
                    placeholder="mm">
                </div>
              </div>

              <button type="submit" [disabled]="loading"
                class="w-full py-4 md:py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[15px] font-semibold rounded-xl hover:from-emerald-500 hover:to-teal-500 transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer border-none shadow-lg shadow-emerald-600/20">
                @if (loading) {
                  <span class="inline-flex items-center gap-2">
                    <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"/><path fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" class="opacity-75"/></svg>
                    Analyzing...
                  </span>
                } @else {
                  {{ 'CROP.PREDICT' | translate }}
                }
              </button>
            </form>
          </div>

          <!-- Result -->
          @if (result) {
            <div class="border-t border-emerald-100 bg-gradient-to-b from-emerald-50/50 to-emerald-50 p-6 md:p-8">
              <div class="text-center">
                <div class="w-14 md:w-16 h-14 md:h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-sm">
                  <span class="material-symbols-outlined filled text-emerald-600" style="font-size:28px">grass</span>
                </div>
                <p class="text-[12px] md:text-[13px] font-bold text-emerald-700 uppercase tracking-wider mb-1">{{ 'CROP.RESULT_TITLE' | translate }}</p>
                <h2 class="text-2xl md:text-3xl font-extrabold text-slate-900 capitalize">{{ result.crop }}</h2>
                @if (result.temperature !== undefined) {
                  <div class="flex items-center justify-center gap-4 mt-4 text-[13px] text-slate-500">
                    <span class="flex items-center gap-1">
                      <span class="material-symbols-outlined text-orange-500" style="font-size:16px">thermostat</span>
                      {{ result.temperature | number:'1.1-1' }}°C
                    </span>
                    <span class="flex items-center gap-1">
                      <span class="material-symbols-outlined text-blue-500" style="font-size:16px">water_drop</span>
                      {{ result.humidity | number:'1.1-1' }}%
                    </span>
                  </div>
                }
              </div>
            </div>
          }

          @if (error) {
            <div class="border-t border-red-100 bg-red-50 p-5 md:p-6 text-center text-[14px] text-red-600 flex items-center justify-center gap-2">
              <span class="material-symbols-outlined" style="font-size:18px">error</span>
              {{ error }}
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`:host { display: block; }`],
})
export class CropComponent {
  form = {
    nitrogen: null as any,
    phosphorous: null as any,
    potassium: null as any,
    temperature: null as any,
    humidity: null as any,
    ph: null as any,
    rainfall: null as any,
  };
  loading = false;
  result: any = null;
  error = '';

  constructor(private api: ApiService, private auth: AuthService, private cdr: ChangeDetectorRef) {}

  predict() {
    this.error = '';
    this.result = null;
    this.loading = true;
    const isAuth = this.auth.isAuthenticated();
    this.api.predictCrop(this.form, isAuth).subscribe({
      next: (res) => { this.result = res; this.loading = false; this.cdr.detectChanges(); },
      error: (err) => { this.error = err.error?.detail || 'Prediction failed. Check your inputs.'; this.loading = false; this.cdr.detectChanges(); },
    });
  }
}
