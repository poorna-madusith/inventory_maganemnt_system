import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject, Input, OnInit } from '@angular/core';
import { first } from 'rxjs';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-customer-dialog-box',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './customer-dialog-box.component.html',
  styleUrl: './customer-dialog-box.component.css'
})
export class CustomerDialogBoxComponent implements OnInit {

  @Input() private customer:any; 

  btntext: string = "Add";
  disableCustomerIdInput = false;
  customerForm!: FormGroup;
  submitted = false;
  formErrors: { [key: string]: string } = {};

  httpClient = inject(HttpClient);
  modal = inject(NgbActiveModal);
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);

  customerDetails={
    customerId:'',
    firstName:'',
    lastName:'',
    registrationDate:'',
    phone:'',
    email:'',
  }

  createForm() {
    this.customerForm = this.fb.group({
      customerId: [{value: this.customerDetails.customerId, disabled: this.disableCustomerIdInput}, 
                  [Validators.required, Validators.pattern('^[1-9][0-9]*$')]],
      firstName: [this.customerDetails.firstName, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      lastName: [this.customerDetails.lastName, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      registrationDate: [this.customerDetails.registrationDate, [Validators.required]],
      phone: [this.customerDetails.phone, [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: [this.customerDetails.email, [Validators.required, Validators.email]]
    });
  }

  // Getter for easy access to form fields
  get f() { return this.customerForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.formErrors = {};

    // Stop here if form is invalid
    if (this.customerForm.invalid) {
      Object.keys(this.f).forEach(key => {
        if (this.f[key].errors) {
          if (this.f[key].errors['required']) {
            this.formErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
          } else if (this.f[key].errors['email']) {
            this.formErrors[key] = 'Please enter a valid email address';
          } else if (this.f[key].errors['pattern']) {
            if (key === 'customerId') {
              this.formErrors[key] = 'Customer ID must be a positive number greater than 0';
            } else if (key === 'phone') {
              this.formErrors[key] = 'Phone number must be 10 digits';
            }
          } else if (this.f[key].errors['minlength']) {
            this.formErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} must be at least ${this.f[key].errors['minlength'].requiredLength} characters`;
          } else if (this.f[key].errors['maxlength']) {
            this.formErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} cannot exceed ${this.f[key].errors['maxlength'].requiredLength} characters`;
          }
        }
      });
      return;
    }

    // Update customerDetails with form values
    const formValue = this.customerForm.getRawValue(); // Gets values including disabled fields
    this.customerDetails = {
      customerId: formValue.customerId,
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      registrationDate: formValue.registrationDate,
      phone: formValue.phone,
      email: formValue.email
    };
    let apiUrl = 'https://localhost:7143/api/Customer';

    let httpOptions = {
      headers: new HttpHeaders({
        Authorization:'my-auth-token',
        'content-type': 'application/json'
      })
    }


    if (this.disableCustomerIdInput == true){
      this.httpClient.put(apiUrl, this.customerDetails, httpOptions).subscribe(
        {
          next:v=>console.log(v),
          error: e => console.log(e),
          complete:()=>{
            this.toastService.showSuccess(`Customer ${this.customerDetails.firstName} ${this.customerDetails.lastName} updated successfully`);
            this.modal.close({event:"closed"});
          }
        }

      
      )
    }else{

    
      this.httpClient.post(apiUrl, this.customerDetails, httpOptions).subscribe(
        {
          next:v=>console.log(v),
          error: e => console.log(e),
          complete:()=>{
            this.toastService.showSuccess(`Customer ${this.customerDetails.firstName} ${this.customerDetails.lastName} added successfully`);
            this.modal.close({event:"closed"});
          }
        }

      
      )
    }
  }

  ngOnInit() {
    if(this.customer!=null) {
      this.customerDetails = this.customer;
      this.btntext = "Update";
      this.disableCustomerIdInput = true;
    }
    this.createForm();
  }


}

