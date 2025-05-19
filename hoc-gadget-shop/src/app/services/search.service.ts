import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private httpClient = inject(HttpClient);
  private baseUrl = 'https://localhost:7143/api';

  searchCustomerById(id: string): Observable<any> {
    return this.httpClient
      .get(`${this.baseUrl}/Customer`)
      .pipe(
        map((customers: any) => {
          console.log('Customer search data:', customers);
          if (!Array.isArray(customers)) {
            console.error('Expected array response from Customer API');
            return null;
          }
          
          // Try to find customer with matching ID
          const parsedId = parseInt(id);
          const found = customers.find((customer: any) => {
            // Check for both camelCase and PascalCase property names
            const customerId = customer.CustomerId !== undefined ? customer.CustomerId : customer.customerId;
            return customerId === parsedId;
          });
          
          console.log('Customer search result:', found);
          return found;
        })
      );
  }

  searchInventoryById(id: string): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/Inventory`).pipe(
      map((inventory: any) => {
        console.log('Inventory search data:', inventory);
        if (!Array.isArray(inventory)) {
          console.error('Expected array response from Inventory API');
          return null;
        }
        
        // Try to find inventory item with matching ID
        const parsedId = parseInt(id);
        const found = inventory.find((item: any) => {
          // Check for both camelCase and PascalCase property names
          const productId = item.ProductId !== undefined ? item.ProductId : 
                          (item.productId !== undefined ? item.productId : null);
          
          return productId === parsedId;
        });
        
        console.log('Inventory search result:', found);
        return found || null;
      })
    );
  }
}
