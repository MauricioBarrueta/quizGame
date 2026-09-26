import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ModalService } from '../../shared/modal/service/modal.service';
import { TranslatorService } from './service/translator.service';

@Component({
  selector: 'app-main',
  imports: [CommonModule, RouterModule],
  templateUrl: './main.component.html',
})
export class MainComponent {

  constructor(private router: Router, private modalService: ModalService, private translatorService: TranslatorService) {}

  mouseEnter: boolean = false

  /* Se mandan y asignan los valores al objeto y se muestra el Modal */
  showModal() {
    this.modalService.showModal({
      icon: '/google-translate.svg',      
      title: '¿Quieres traducir las preguntas al español?',
      subtitle: 'Ten en cuenta que la traducción puede contener algunos errores',
      confirmText: 'Traducir',
      cancelText: 'Conservar en inglés',
      onConfirm: () => this.translatorService.enableTranslation('es'),
      onCancel: () => { setTimeout(() => { this.router.navigate(['/game'], { replaceUrl: true }) })} /* Se asegura de redirigir una vez que se cierra el modal */
    })
  }
}