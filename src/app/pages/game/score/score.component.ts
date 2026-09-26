import { Component, OnInit } from '@angular/core';
import { Score } from './interface/score';
import { CommonModule } from '@angular/common';
import { ScoreService } from './service/score.service';
import { Router, RouterModule } from '@angular/router';
import { GameService } from '../service/game.service';
import { LoaderComponent } from '../../../shared/loader/loader.component';
import { ModalService } from '../../../shared/modal/service/modal.service';

@Component({
  selector: 'app-score',
  imports: [CommonModule, RouterModule, LoaderComponent],
  templateUrl: './score.component.html',
})
export class ScoreComponent implements OnInit {
  
  userScore: Score[] = []

  isLoading: boolean = true  

  /* Carousel */
  showingDetails: boolean = false
  activeSlide: number = 0
  mouseEnter: boolean = false

  loaderText: string = 'Calculando resultados'

  constructor(private scoreService: ScoreService, private router: Router, private gameService: GameService, private modalService: ModalService) {}  
 
  ngOnInit(): void {

    this.loaderText = 'Calculando resultados'

    /* Para evitar que se acceda a la ruta sin antes haber jugado una partida */
    if (this.scoreService.getScoreData().length === 0) {
      this.router.navigate(['main-menu'])
      return
    }
    this.userScore = this.scoreService.getScoreData() 
    
    setTimeout(() => {
      this.isLoading = false
    }, 3000);
  }

  /* Se obtiene el numero total de respuestas correctas e incorrectas */
  get totalCorrectAnswers(): number {    
    return this.userScore.filter(q => q.result).length
  }

  get totalWrongAnswers(): number {
    return this.userScore.filter(q => !q.result).length
  }

  /* Navegación entre pestañas (índices) */
  nextSlide() {
    this.activeSlide < this.userScore.length - 1 ? this.activeSlide++ : this.activeSlide = 0  
  }
  prevSlide() {
    this.activeSlide > 0 ? this.activeSlide-- : this.activeSlide = this.userScore.length - 1  
  }  

  showConfirmModal() {
    this.modalService.showModal({
      icon: '❓',
      title: '¿Volver al menú principal?',
      subtitle: 'Podrás configurar una nueva partida',
      confirmText: 'Confirmar',
      cancelText: 'Cancelar',
      onConfirm: () => this.exitGameAndReset()
    });
  }

  exitGameAndReset() {
    this.router.navigate(['main-menu']).then(() => {
      this.gameService.destroyGoogleTranslate() 
      localStorage.removeItem('params')
    })
  }
}