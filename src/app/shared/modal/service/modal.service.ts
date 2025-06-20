import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Modal } from '../interface/modal';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  //? Se define como Subject para que se pueda subscribir desde cualquiér componente y para emitir valores con .next()
  private modalDataSubject = new Subject<Modal>()
  modalData$ = this.modalDataSubject.asObservable()

  showModal(data: Modal) {
    this.modalDataSubject.next(data)
  }
}
