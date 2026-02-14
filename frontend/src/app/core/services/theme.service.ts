import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private darkMode = signal(false);
  readonly isDark = this.darkMode.asReadonly();

  constructor() {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      this.setDark(true);
    }
  }

  toggle() {
    this.setDark(!this.darkMode());
  }

  private setDark(dark: boolean) {
    this.darkMode.set(dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}
