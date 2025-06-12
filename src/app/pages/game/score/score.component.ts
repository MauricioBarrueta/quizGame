import { Component, Input, OnInit } from '@angular/core';
import { Score } from './interface/score';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-score',
  imports: [CommonModule],
  templateUrl: './score.component.html',
  styleUrl: './score.component.scss' 
})
export class ScoreComponent implements OnInit {
  
  @Input() userScore: Score[] = []

  isLoading: boolean = true
  showingDetails: boolean = false

  activeSlide: number = 0
  mouseEnter: boolean = false

  constructor() {}

  ngOnInit(): void {
    setTimeout(() => {
      this.isLoading = false
    }, 2000);
  }

  /* Para mostrar de manera resumida los resultados */
  get totalCorrectAnswers(): number {
    return this.userScore.filter(q => q.result).length;
  }

  get totalWrongAnswers(): number {
    return this.userScore.filter(q => !q.result).length;
  }

  /* Para navegar entre las pestañas al mostrar los detalles */
  nextSlide() {
    this.activeSlide < this.userScore.length - 1 ? this.activeSlide++ : this.activeSlide = 0  
  }
  prevSlide() {
    this.activeSlide > 0 ? this.activeSlide-- : this.activeSlide = this.userScore.length - 1  
  }  
}
