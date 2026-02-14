import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-fertilizer',
  standalone: true,
  imports: [FormsModule, TranslatePipe],
  template: `
    <div class="min-h-[calc(100vh-64px)] bg-gradient-to-b from-blue-50/40 to-[#f8faf8]">
      <div class="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-16">

        <!-- Header -->
        <div class="text-center mb-8 md:mb-12">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-100/80 rounded-full mb-3 md:mb-4 border border-blue-200/50">
            <span class="material-symbols-outlined filled text-blue-600" style="font-size:14px">auto_awesome</span>
            <span class="text-[12px] md:text-[13px] font-semibold text-blue-800">Smart Analysis</span>
          </div>
          <h1 class="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-2 md:mb-3">{{ 'FERT.TITLE' | translate }}</h1>
          <p class="text-slate-500 text-[14px] md:text-[15px] px-2">{{ 'FERT.SUBTITLE' | translate }}</p>
        </div>

        <!-- Form Card -->
        <div class="bg-white rounded-2xl border border-slate-200/80 shadow-lg shadow-blue-100/30 overflow-hidden">
          <div class="p-5 md:p-8">
            <form (ngSubmit)="predict()" class="space-y-4 md:space-y-5">
              <!-- Crop Select -->
              <div>
                <label class="block text-[11px] md:text-[12px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">{{ 'FERT.CROP' | translate }}</label>
                <select [(ngModel)]="form.crop_name" name="crop_name" required
                  class="w-full px-4 py-3.5 md:py-3 bg-slate-50 border border-slate-200 rounded-xl text-[16px] md:text-[15px] font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition appearance-none cursor-pointer">
                  <option value="" disabled>Choose a crop...</option>
                  @for (c of crops; track c) {
                    <option [value]="c">{{ c }}</option>
                  }
                </select>
              </div>

              <!-- NPK Row - stacked on mobile -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                <div>
                  <label class="block text-[11px] md:text-[12px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">{{ 'CROP.NITROGEN' | translate }}</label>
                  <input type="number" [(ngModel)]="form.nitrogen" name="nitrogen" required
                    class="w-full px-4 py-3.5 md:py-3 bg-slate-50 border border-slate-200 rounded-xl text-[16px] md:text-[15px] font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition placeholder-slate-300"
                    placeholder="0-200">
                </div>
                <div>
                  <label class="block text-[11px] md:text-[12px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">{{ 'CROP.PHOSPHOROUS' | translate }}</label>
                  <input type="number" [(ngModel)]="form.phosphorous" name="phosphorous" required
                    class="w-full px-4 py-3.5 md:py-3 bg-slate-50 border border-slate-200 rounded-xl text-[16px] md:text-[15px] font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition placeholder-slate-300"
                    placeholder="0-200">
                </div>
                <div>
                  <label class="block text-[11px] md:text-[12px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">{{ 'CROP.POTASSIUM' | translate }}</label>
                  <input type="number" [(ngModel)]="form.potassium" name="potassium" required
                    class="w-full px-4 py-3.5 md:py-3 bg-slate-50 border border-slate-200 rounded-xl text-[16px] md:text-[15px] font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition placeholder-slate-300"
                    placeholder="0-200">
                </div>
              </div>

              <button type="submit" [disabled]="loading"
                class="w-full py-4 md:py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[15px] font-semibold rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer border-none shadow-lg shadow-blue-600/20">
                @if (loading) {
                  <span class="inline-flex items-center gap-2">
                    <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"/><path fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" class="opacity-75"/></svg>
                    Analyzing...
                  </span>
                } @else {
                  {{ 'FERT.PREDICT' | translate }}
                }
              </button>
            </form>
          </div>

          <!-- Result -->
          @if (result) {
            <div class="border-t border-blue-100 bg-gradient-to-b from-blue-50/30 to-blue-50 p-5 md:p-8">
              <div class="mb-4">
                <p class="text-[12px] md:text-[13px] font-bold text-blue-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <span class="material-symbols-outlined" style="font-size:16px">science</span>
                  {{ 'FERT.RESULT_TITLE' | translate }}
                </p>
                <h2 class="text-xl md:text-2xl font-extrabold text-slate-900">{{ result.condition }}</h2>
              </div>
              @if (result.suggestions?.length) {
                <div>
                  <p class="text-[12px] md:text-[13px] font-bold text-slate-400 uppercase tracking-wider mb-3">{{ 'FERT.SUGGESTIONS' | translate }}</p>
                  <ul class="space-y-2.5">
                    @for (s of result.suggestions; track s) {
                      <li class="flex items-start gap-3 text-[13px] md:text-[14px] text-slate-600 leading-relaxed">
                        <span class="material-symbols-outlined filled text-blue-400 mt-0.5 shrink-0" style="font-size:8px">circle</span>
                        {{ s }}
                      </li>
                    }
                  </ul>
                </div>
              }
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
export class FertilizerComponent implements OnInit {
  crops: string[] = [];
  form = { crop_name: '', nitrogen: null as any, phosphorous: null as any, potassium: null as any };
  loading = false;
  result: any = null;
  error = '';

  constructor(private api: ApiService, private auth: AuthService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.api.getAvailableCrops().subscribe({
      next: (res) => { this.crops = res.crops || res; this.cdr.detectChanges(); },
      error: () => { this.crops = ['Rice', 'Wheat', 'Maize', 'Cotton', 'Sugarcane', 'Tobacco', 'Paddy', 'Barley',
        'Oil seeds', 'Ground Nuts', 'Pulses', 'Millets']; this.cdr.detectChanges(); },
    });
  }

  predict() {
    if (!this.form.crop_name || this.form.nitrogen == null || this.form.phosphorous == null || this.form.potassium == null) {
      this.error = 'Please fill in all fields.';
      return;
    }
    this.error = '';
    this.result = null;
    this.loading = true;
    const isAuth = this.auth.isAuthenticated();
    this.api.predictFertilizer(this.form, isAuth).subscribe({
      next: (res) => { this.result = res; this.loading = false; this.cdr.detectChanges(); },
      error: (err) => { this.error = err.error?.detail || 'Prediction failed.'; this.loading = false; this.cdr.detectChanges(); },
    });
  }
}
