import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  imports: [ CommonModule ],
  templateUrl: './confirm-modal.component.html',  
})
export class ConfirmModalComponent {

  @Output() confirm = new EventEmitter<void>()
  
  @Output() cancel = new EventEmitter<void>()
}