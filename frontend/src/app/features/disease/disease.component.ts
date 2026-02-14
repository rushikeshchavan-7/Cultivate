import { Component, ChangeDetectorRef } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-disease',
  standalone: true,
  imports: [TranslatePipe],
  template: `
    <div class="min-h-[calc(100vh-64px)] bg-gradient-to-b from-amber-50/40 to-[#f8faf8]">
      <div class="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-16">

        <!-- Header -->
        <div class="text-center mb-8 md:mb-12">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-100/80 rounded-full mb-3 md:mb-4 border border-amber-200/50">
            <span class="material-symbols-outlined filled text-amber-600" style="font-size:14px">image_search</span>
            <span class="text-[12px] md:text-[13px] font-semibold text-amber-800">Computer Vision</span>
          </div>
          <h1 class="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-2 md:mb-3">{{ 'DISEASE.TITLE' | translate }}</h1>
          <p class="text-slate-500 text-[14px] md:text-[15px] px-2">{{ 'DISEASE.SUBTITLE' | translate }}</p>
        </div>

        <!-- Upload Card -->
        <div class="bg-white rounded-2xl border border-slate-200/80 shadow-lg shadow-amber-100/30 overflow-hidden">
          <div class="p-5 md:p-8">
            <!-- Dropzone -->
            <div
              (click)="fileInput.click()"
              (dragover)="onDragOver($event)"
              (dragleave)="dragging = false"
              (drop)="onDrop($event)"
              [class]="'relative border-2 border-dashed rounded-2xl p-8 md:p-10 text-center cursor-pointer transition-all active:scale-[0.99] ' +
                (dragging ? 'border-amber-400 bg-amber-50/50' : 'border-slate-200 hover:border-amber-300 hover:bg-amber-50/30')">

              @if (previewUrl) {
                <img [src]="previewUrl" alt="Preview" class="max-h-40 md:max-h-48 mx-auto rounded-xl mb-4 shadow-md">
                <p class="text-[13px] md:text-[14px] text-slate-700 font-semibold">{{ selectedFile?.name }}</p>
                <p class="text-[12px] text-slate-400 mt-1">Tap to change image</p>
              } @else {
                <div class="w-14 md:w-16 h-14 md:h-16 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center mx-auto mb-4">
                  <span class="material-symbols-outlined text-amber-500" style="font-size:30px">add_photo_alternate</span>
                </div>
                <p class="text-[14px] md:text-[15px] font-semibold text-slate-700 mb-1">{{ 'DISEASE.UPLOAD_TEXT' | translate }}</p>
                <p class="text-[12px] md:text-[13px] text-slate-400">{{ 'DISEASE.UPLOAD_HINT' | translate }}</p>
              }

              <input #fileInput type="file" accept="image/*" capture="environment" (change)="onFileSelected($event)" class="hidden">
            </div>

            @if (selectedFile) {
              <button (click)="predict()" [disabled]="loading"
                class="w-full mt-5 md:mt-6 py-4 md:py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[15px] font-semibold rounded-xl hover:from-amber-400 hover:to-orange-400 transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer border-none shadow-lg shadow-amber-500/20">
                @if (loading) {
                  <span class="inline-flex items-center gap-2">
                    <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"/><path fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" class="opacity-75"/></svg>
                    Analyzing image...
                  </span>
                } @else {
                  {{ 'DISEASE.PREDICT' | translate }}
                }
              </button>
            }
          </div>

          <!-- Result -->
          @if (result) {
            <div class="border-t border-slate-100 p-5 md:p-8 space-y-5 md:space-y-6">
              <div class="text-center pb-5 md:pb-6 border-b border-slate-100">
                <div class="w-14 md:w-16 h-14 md:h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-sm"
                  [class]="result.disease?.toLowerCase().includes('healthy') ? 'bg-emerald-50 border border-emerald-100' : 'bg-amber-50 border border-amber-100'">
                  <span class="material-symbols-outlined filled" style="font-size:30px"
                    [class]="result.disease?.toLowerCase().includes('healthy') ? 'text-emerald-600' : 'text-amber-600'">
                    {{ result.disease?.toLowerCase().includes('healthy') ? 'check_circle' : 'biotech' }}
                  </span>
                </div>
                <h2 class="text-xl md:text-2xl font-extrabold text-slate-900">{{ result.disease }}</h2>
              </div>

              @if (result.cause) {
                <div>
                  <h3 class="text-[12px] md:text-[13px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 md:mb-3 flex items-center gap-1.5">
                    <span class="material-symbols-outlined" style="font-size:16px">info</span>
                    {{ 'DISEASE.CAUSE' | translate }}
                  </h3>
                  <p class="text-[13px] md:text-[14px] text-slate-700 leading-relaxed bg-slate-50 rounded-xl p-4 border border-slate-100">{{ result.cause }}</p>
                </div>
              }

              @if (result.prevention?.length) {
                <div>
                  <h3 class="text-[12px] md:text-[13px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 md:mb-3 flex items-center gap-1.5">
                    <span class="material-symbols-outlined" style="font-size:16px">shield</span>
                    {{ 'DISEASE.PREVENTION' | translate }}
                  </h3>
                  <ul class="space-y-2.5">
                    @for (step of result.prevention; track step) {
                      <li class="flex items-start gap-3 text-[13px] md:text-[14px] text-slate-600 leading-relaxed">
                        <span class="material-symbols-outlined filled text-amber-400 mt-0.5 shrink-0" style="font-size:8px">circle</span>
                        {{ step }}
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
export class DiseaseComponent {
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  dragging = false;
  loading = false;
  result: any = null;
  error = '';

  constructor(private api: ApiService, private auth: AuthService, private cdr: ChangeDetectorRef) {}

  onDragOver(e: DragEvent) { e.preventDefault(); this.dragging = true; }

  onDrop(e: DragEvent) {
    e.preventDefault();
    this.dragging = false;
    const file = e.dataTransfer?.files[0];
    if (file && file.type.startsWith('image/')) this.setFile(file);
  }

  onFileSelected(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) this.setFile(file);
  }

  private setFile(file: File) {
    this.selectedFile = file;
    this.result = null;
    this.error = '';
    const reader = new FileReader();
    reader.onload = () => { this.previewUrl = reader.result as string; this.cdr.detectChanges(); };
    reader.readAsDataURL(file);
  }

  predict() {
    if (!this.selectedFile) return;
    this.error = '';
    this.result = null;
    this.loading = true;
    const isAuth = this.auth.isAuthenticated();
    this.api.predictDisease(this.selectedFile, isAuth).subscribe({
      next: (res) => { this.result = res; this.loading = false; this.cdr.detectChanges(); },
      error: (err) => { this.error = err.error?.detail || 'Detection failed.'; this.loading = false; this.cdr.detectChanges(); },
    });
  }
}
