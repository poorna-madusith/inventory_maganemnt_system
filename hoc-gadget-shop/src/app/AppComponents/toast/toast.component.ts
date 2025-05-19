import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 1200;">
      <div *ngFor="let toast of toastService.toasts" 
           class="toast show {{toast.className}}" 
           role="alert" 
           aria-live="assertive" 
           aria-atomic="true">
        <div class="toast-header">
          <strong class="me-auto">{{toast.header}}</strong>
          <button type="button" class="btn-close" aria-label="Close" (click)="toastService.remove(toast)"></button>
        </div>
        <div class="toast-body">
          {{toast.body}}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      z-index: 1200;
    }
    .toast {
      opacity: 1;
      border: none;
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
      margin-bottom: 0.75rem;
    }
    .bg-success {
      background-color: #28a745 !important;
      color: white;
    }
    .bg-success .toast-header {
      background-color: rgba(40, 167, 69, 0.85);
      color: white;
    }
    .bg-danger {
      background-color: #dc3545 !important;
      color: white;
    }
    .bg-danger .toast-header {
      background-color: rgba(220, 53, 69, 0.85);
      color: white;
    }
    .bg-info {
      background-color: #17a2b8 !important;
      color: white;
    }
    .bg-info .toast-header {
      background-color: rgba(23, 162, 184, 0.85);
      color: white;
    }
    .toast-header .btn-close {
      filter: invert(1) grayscale(100%) brightness(200%);
    }
  `]
})
export class ToastComponent {
  toastService = inject(ToastService);
}
