import { Component, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog-box',
  imports: [CommonModule],
  templateUrl: './dialog-box.component.html',
  styleUrl: './dialog-box.component.css',
  standalone: true
})
export class DialogBoxComponent {

  modal = inject(NgbActiveModal);

  confirm(){
    this.modal.close({event:"confirm"});
  }
}
