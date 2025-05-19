import { Injectable } from '@angular/core';

export interface ToastInfo {
  header: string;
  body: string;
  delay?: number;
  className?: string;
  show?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts: ToastInfo[] = [];

  show(header: string, body: string, options: { className?: string, delay?: number } = {}) {
    const toast = { header, body, ...options, show: true };
    this.toasts.push(toast);
    
    // Auto-remove toast after delay
    setTimeout(() => {
      this.remove(toast);
    }, options.delay || 5000);
  }

  showSuccess(body: string) {
    this.show('Success', body, { className: 'bg-success text-light', delay: 5000 });
  }

  showError(body: string) {
    this.show('Error', body, { className: 'bg-danger text-light', delay: 7000 });
  }

  showInfo(body: string) {
    this.show('Info', body, { className: 'bg-info text-light', delay: 5000 });
  }

  remove(toast: ToastInfo) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }
}
