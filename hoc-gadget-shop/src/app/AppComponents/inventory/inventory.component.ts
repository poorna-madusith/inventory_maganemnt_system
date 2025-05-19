import { Component, OnInit, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../services/toast.service';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  standalone: true,
})
export class InventoryComponent implements OnInit {
  HttpClient = inject(HttpClient);
  productIdToDelete: number = 0;
  private modalService = inject(NgbModal);
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);
  disableProductIdInput = false;
  inventoryForm!: FormGroup;
  submitted = false;
  formErrors: { [key: string]: string } = {};

  inventoryData = {
    productId: '',
    productName: '',
    availableQty: 0,
    reorderPoint: 0,
  };

  inventoryDetails: any;
  allInventoryDetails: any;
  searchId: string = '';
  isFiltered: boolean = false;

  ngOnInit() {
    this.getInventoryDetails();
    this.createForm();
  }

  createForm() {
    this.inventoryForm = this.fb.group({
      productId: [{value: this.inventoryData.productId, disabled: this.disableProductIdInput}, 
                 [Validators.required, Validators.pattern('^[1-9][0-9]*$')]],
      productName: [this.inventoryData.productName, [Validators.required]],
      availableQty: [this.inventoryData.availableQty, 
                    [Validators.required, Validators.min(0), Validators.pattern('^[0-9]+$')]],
      reorderPoint: [this.inventoryData.reorderPoint, 
                   [Validators.required, Validators.min(0), Validators.pattern('^[0-9]+$')]]
    });
  }

  // Getter for easy access to form fields
  get f() { return this.inventoryForm.controls; }

  getInventoryDetails() {
    let apiUrl = 'https://localhost:7143/api/Inventory';

    this.HttpClient.get(apiUrl).subscribe((data) => {
      this.inventoryDetails = data;
      this.allInventoryDetails = data;
      console.log(this.inventoryDetails);
    });
    this.inventoryData = {
      productId: '',
      productName: '',
      availableQty: 0,
      reorderPoint: 0,
    };

    this.disableProductIdInput = false;
    
    // Reset form when getting new data
    if (this.inventoryForm) {
      this.createForm();
      this.submitted = false;
    }
  }

  onSubmit(): void {
    this.submitted = true;
    this.formErrors = {};

    // Stop here if form is invalid
    if (this.inventoryForm.invalid) {
      Object.keys(this.f).forEach(key => {
        if (this.f[key].errors) {
          if (this.f[key].errors['required']) {
            this.formErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
          } else if (this.f[key].errors['pattern']) {
            if (key === 'productId') {
              this.formErrors[key] = 'Product ID must be a positive number greater than 0';
            } else {
              this.formErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} must contain only numbers`;
            }
          } else if (this.f[key].errors['min']) {
            this.formErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} cannot be negative`;
          }
        }
      });
      return;
    }

    // Update inventoryData with form values
    const formValue = this.inventoryForm.getRawValue(); // Gets values including disabled fields
    this.inventoryData = {
      productId: formValue.productId,
      productName: formValue.productName,
      availableQty: formValue.availableQty,
      reorderPoint: formValue.reorderPoint
    };
    let apiUrl = 'https://localhost:7143/api/Inventory';

    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'my-auth-token',
        'Content-Type': 'application/json',
      }),
    };
    if (this.disableProductIdInput == true) {
      this.HttpClient.put(apiUrl, this.inventoryData, httpOptions).subscribe({
        next: (v) => console.log(v),
        error: (e) => {
          console.error(e);
          this.toastService.showError('Error updating inventory item');
        },
        complete: () => {
          this.toastService.showSuccess(`Inventory item ${this.inventoryData.productName} updated successfully`);
          this.getInventoryDetails();
        },
      });
    } else {
      this.HttpClient.post(apiUrl, this.inventoryData, httpOptions).subscribe({
        next: (v) => console.log(v),
        error: (e) => {
          console.error(e);
          this.toastService.showError('Error adding inventory item');
        },
        complete: () => {
          this.toastService.showSuccess(`Inventory item ${this.inventoryData.productName} added successfully`);
          this.getInventoryDetails();
        },
      });
    }
  }
  
  openConfirmDialog(productId: number) {
    this.productIdToDelete = productId;
    console.log(this.productIdToDelete);
    this.modalService.open(DialogBoxComponent).result.then((data) => {
      console.log(data);
      if (data.event === 'confirm') {
        this.deleteInventory();
      }
    });
  }

  deleteInventory(): void {
    let apiUrl =
      'https://localhost:7143/api/Inventory?productId=' +
      this.productIdToDelete;

    this.HttpClient.delete(apiUrl).subscribe({
      next: (data) => {
        this.toastService.showSuccess('Inventory item deleted successfully');
        this.getInventoryDetails();
      },
      error: (e) => {
        console.error(e);
        this.toastService.showError('Error deleting inventory item');
      }
    });
  }
  
  searchInventory() {
    if (!this.searchId.trim()) {
      this.resetSearch();
      return;
    }

    const parsedId = parseInt(this.searchId);
    if (isNaN(parsedId)) {
      this.resetSearch();
      return;
    }

    this.isFiltered = true;
    this.inventoryDetails = this.allInventoryDetails.filter((item: any) => {
      const productId = item.ProductId !== undefined ? item.ProductId : 
                      (item.productId !== undefined ? item.productId : null);
      return productId === parsedId;
    });
    
    if (this.inventoryDetails.length === 0) {
      this.toastService.showInfo(`No inventory items found with ID: ${parsedId}`);
    }
  }

  resetSearch() {
    this.searchId = '';
    this.inventoryDetails = this.allInventoryDetails;
    this.isFiltered = false;
  }

  populateFormForEdit(inventory: any) {
    this.inventoryData.productId = inventory.productId || inventory.ProductId;
    this.inventoryData.productName = inventory.productName || inventory.ProductName;
    this.inventoryData.availableQty = inventory.availableQty || inventory.AvailableQty;
    this.inventoryData.reorderPoint = inventory.reorderPoint || inventory.ReorderPoint;

    this.disableProductIdInput = true;
    this.createForm();
    this.submitted = false;
  }
}
