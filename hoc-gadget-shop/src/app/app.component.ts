import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterModule, Router, NavigationEnd } from '@angular/router';
import { InventoryComponent } from './AppComponents/inventory/inventory.component';
import { CustomerComponent } from './AppComponents/customer/customer.component';
import { SearchService } from './services/search.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastComponent } from './AppComponents/toast/toast.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, FormsModule, CommonModule, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
})
export class AppComponent {
  private router = inject(Router);
  currentPage: string = 'Inventory'; // Default to Inventory
  title = 'hoc-gadget-shop';
  searchId: string = '';
  searchResult: any = null;
  searchError: string = '';
  private searchService = inject(SearchService);
  private modalService = inject(NgbModal);

  constructor() {
    // Subscribe to router events to update the current page name
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.url.includes('customer')) {
          this.currentPage = 'Customer';
        } else if (event.url.includes('inventory') || event.url === '/') {
          this.currentPage = 'Inventory';
        }
      }
    });
  }
  
  getCurrentPageName(): string {
    return this.currentPage;
  }

  // Search functionality moved to individual components
  onSearch(event: Event) {
    event.preventDefault();
    if (!this.searchId.trim()) {
      this.searchError = 'Please enter an ID to search';
      this.searchResult = null;
      return;
    }

    // Check current route to determine what to search for
    const currentPath = window.location.pathname;

    if (currentPath.includes('customer')) {
      // Search in customer database
      this.searchService.searchCustomerById(this.searchId).subscribe({
        next: (result) => {
          if (result) {
            this.searchResult = result;
            this.searchError = '';
          } else {
            this.searchError = 'No customer found with this ID';
            this.searchResult = null;
          }
        },
        error: (error) => {
          this.searchError = 'Error searching for customer';
          this.searchResult = null;
        },
      });
    } else if (currentPath.includes('inventory')) {
      // Search in inventory database
      this.searchService.searchInventoryById(this.searchId).subscribe({
        next: (result) => {
          if (result) {
            this.searchResult = result;
            this.searchError = '';
          } else {
            this.searchError = `No inventory item found with ID: ${this.searchId}`;
            this.searchResult = null;
          }
        },
        error: (error) => {
          this.searchError = 'Error searching for inventory item';
          this.searchResult = null;
        },
      });
    } else {
      this.searchError =
        'Please navigate to customers or inventory page to search';
      this.searchResult = null;
    }
  }
}
