import { Component, OnInit, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomerDialogBoxComponent } from '../customer-dialog-box/customer-dialog-box.component';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';
import { FormsModule } from '@angular/forms';
import { first } from 'rxjs';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
  imports: [CommonModule, FormsModule],
  standalone: true,
})
export class CustomerComponent implements OnInit {
  private modalService = inject(NgbModal);

  httpClient = inject(HttpClient);

  customerDetails: any;
  allCustomerDetails: any;
  searchId: string = '';
  isFiltered: boolean = false;

  openCustomerDialog() {
    this.modalService.open(CustomerDialogBoxComponent).result.then((data) => {
      if (data.event == 'closed') {
        this.getCustomerDetails();
      }
    });
  }

  ngOnInit() {
    this.getCustomerDetails();
  }

  getCustomerDetails() {
    let apiUrl = 'https://localhost:7143/api/Customer';

    this.httpClient.get(apiUrl).subscribe((result) => {
      this.customerDetails = result;
      this.allCustomerDetails = result;
      console.log(this.customerDetails);
    });
  }

  openConfirmDialog(customerId: any) {
    this.modalService.open(DialogBoxComponent).result.then((data) => {
      console.log(data);
      if (data.event == 'confirm') {
        this.deleteCustomerDetails(customerId);
      }
    });
  }

  deleteCustomerDetails(customerId: any) {
    let apiUrl = 'https://localhost:7143/api/Customer?customerId=';
    this.httpClient.delete(apiUrl + customerId).subscribe((data) => {
      this.getCustomerDetails();
    });
  }

  searchCustomer() {
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
    this.customerDetails = this.allCustomerDetails.filter((customer: any) => {
      const customerId = customer.CustomerId !== undefined ? customer.CustomerId : customer.customerId;
      return customerId === parsedId;
    });
  }

  resetSearch() {
    this.searchId = '';
    this.customerDetails = this.allCustomerDetails;
    this.isFiltered = false;
  }

  openEditDialogBox(customer: any) {
    const modalReferernce = this.modalService.open(CustomerDialogBoxComponent);
    modalReferernce.componentInstance.customer = {
      customerId: customer.CustomerId || customer.customerId,
      firstName: customer.FirstName || customer.firstName,
      lastName: customer.LastName || customer.lastName,
      registrationDate: customer.RegistrationDate || customer.registrationDate,
      phone: customer.Phone || customer.phone,
      email: customer.Email || customer.email,
    };

    modalReferernce.result.then((data) => {
      if (data.event == 'closed') {
        this.getCustomerDetails();
      }
    });
  }
}
