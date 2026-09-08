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

  constructor(private router: Router, private confirmationModal: ModalService, private translatorService: TranslatorService) {}

  mouseEnter: boolean = false

  /* Se mandan y asignan los valores al objeto y se muestra el Modal */
  showModal() {
    this.confirmationModal.showModal({
      icon: '<img width="48" height="48" class="mx-auto drop-3d" alt="" src="/google-translate.svg">',      
      title: '¿Quieres traducir las preguntas al español?',
      subtitle: 'Ten en cuenta que la traducción puede no ser muy precisa',
      confirmText: 'Traducir preguntas',
      cancelText: 'Conservar en inglés',
      onConfirm: () => this.translatorService.enableTranslation('es'),
      onCancel: () => this.router.navigate(['game'], { replaceUrl: true })
    })
  }
}