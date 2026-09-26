import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ModalService } from './service/modal.service';
import { Modal } from './interface/modal';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  imports: [ CommonModule ],
  templateUrl: './modal.component.html',
})
export class ModalComponent implements OnInit {

  constructor(private modalService: ModalService, private cdr: ChangeDetectorRef) {}

  mouseEnter: boolean = false
  isVisible: boolean = false
  
  //* Se inicializa la interface para evitar errores por 'undefined'
  modalData: Modal = {
    icon: '',
    title: '',
    subtitle: '',
    onConfirm: () => {}
  }

  ngOnInit() {
    /* Se reciben los valores desde el componente donde fue llamado el Modal */
    this.modalService.modalData$.subscribe(data => {
      this.modalData = data
      this.isVisible = true

      /* Fuerza la detección de cambios para actualizar la vista al recibir el modal */
      this.cdr.detectChanges() 
    })
  }

  closeModal() {
    this.isVisible = false
    this.cdr.detectChanges()
  }

  /* Se asignan las acciones de los botones del Modal */
  confirm() {
    this.closeModal()
    this.modalData.onConfirm()    
  }

  cancel() {
    this.closeModal()
    this.modalData.onCancel?.()    
  }
}