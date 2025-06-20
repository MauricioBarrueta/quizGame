import { Injectable } from '@angular/core';
import { Score } from '../interface/score';

@Injectable({
  providedIn: 'root'
})
export class ScoreService {

  userScore$: Score[] = []

  /* Inyecta los datos provenientes del componente Game */
  pushScoreData(score: Score[]) {
    this.userScore$ = score
  }

  /* Devuelve el arreglo ya con datos */
  getScoreData() {
    return this.userScore$
  }
}