import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { GameService } from './service/game.service';
import { catchError, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Questions } from './interface/questions';
import { ScoreComponent } from "./score/score.component";
import { Score } from './score/interface/score';
import { ConfirmModalComponent } from "./confirm-modal/confirm-modal.component";

@Component({
  imports: [CommonModule, ScoreComponent, ConfirmModalComponent],
  templateUrl: './game.component.html',
})
export class GameComponent implements OnInit, AfterViewInit {

  /* Parámetros */
  amount: number = 0; category: number = 0 
  difficulty: string = ''; type: string = ''
  
  questions$: Questions = {} as Questions
  questionAnswers$: string[] = []
  questionIndex: number = 0  
  score: Score[] = []

  mouseEnter: boolean = false

  //* Se inyecta el token (PLATFORM_ID) para saber si se está ejecutando en un navegador y no en un servidor externo (SSR)
  constructor(private gameService: GameService, private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {
    /* Se obtienen los parámetros ocultos en la URL */
    const nav = this.router.getCurrentNavigation() //* Obtiene la navegación actual, incluyendo el estado (state)
    const state = nav?.extras.state
    if(state) {     
      this.amount = state['amount'], this.category = state['category'], this.difficulty = state['difficulty'], this.type = state['type']
    }
  }  

  ngOnInit(): void { 
    //* Si es un servidor externo NO se hace la petición a la API
    if (isPlatformBrowser(this.platformId)) {
      this.getQuestionsList()
    }        
  }

  ngAfterViewInit(): void {
    this.shuffleAnswers 
  }

  /* Devuelve la lista de las preguntas de acuerdo a parámetros */
  getQuestionsList() {
    //* Valida si es una partida rápida o una partida personalizada
    if(this.amount === 0 && !this.difficulty && !this.type && !this.category) {
      this.amount = 10
    } 
    this.gameService.getParams(this.amount, this.category, this.difficulty, this.type)
      .pipe(       
        tap((res: Questions) => {
          this.questions$ = res          
        }),
        catchError(error => {        
          return throwError(() => error)
        })
      )
    .subscribe({
      error: e => { console.error('Error al obtener las preguntas: ' + e) }
    })
  }

  /* Devuelve cada pregunta de manera individual de acuerdo a su posición (index) */
  get indivQuestion() {
    return this.questions$.results[this.questionIndex]
  }

  /* Convierte el texto de la dificultad (string) a ícono */
  difficultyIcon(difficulty: string): number {
    switch (difficulty) {
      case 'easy':
        return 1;
      case 'medium':
        return 2;
      case 'hard':
        return 3;
      default:
        return 0;
    }
  }

  //* Se crea una firma de índice (index signature) para guardar las respuestas mezcladas de cada pregunta
  //? { [key: KeyType]: ValueType } En este caso, es un objeto con propiedades number, y cada una contiene un arreglo string[]
  mixedAnswers: { [ index: number ]: string[] } = {} 
  /* Devuelve la lista de las respuestas de cada pregunta mezcladas de manera aleatoria */
  get shuffleAnswers(): string[] {
    //* Valida si ya se han mezclado las respuestas de la pregunta actual, esto para evitar que se mezclen cada que se muestre la pregunta
    if (!this.mixedAnswers[this.questionIndex]) {
      const q = this.indivQuestion
      //* Se agregan a un solo array las respuestas incorrectas y la respuesta correcta
      const answers = [...q.incorrect_answers, q.correct_answer] //? Se usa spread operator (...) para copiar los elementos del array de respuestas incorrectas en el nuevo 
      this.mixedAnswers[this.questionIndex] = answers.sort(() => Math.random() - .5) //* Se mezclan las respuestas
    }
    return this.mixedAnswers[this.questionIndex]
  } 
  
  /* Obtiene la respuesta correcta para cada pregunta */
  getCorrectAnswer(selected: string): boolean {
    const correct = this.indivQuestion.correct_answer
    return selected === correct
  }

  /* Almacena el resultado de cada pregunta respondida para posteriormente mostrarlo */
  onAnswerSelected(answer: string) {    
    //* Verifica si la pregunta ya fue respindida y previene que se duplique al ir guardando los resultados
    const isAnswered = this.score.find(question => question.index === this.questionIndex) 
    if(!isAnswered) {
      this.score.push({
        index: this.questionIndex,
        question: this.indivQuestion.question,
        selectedAnswer: answer,
        correctAnswer: this.indivQuestion.correct_answer,
        result: this.getCorrectAnswer(answer)
      });      
    }
  }

  /* Verifica si la pregunta ya ha sido respondida y si es que ya existe en el arreglo de la puntuación */
  alreadyAnswered(index: number): boolean {
    return this.score.some(question => question.index === index)
  }

  /* Verifica si la pregunta actual corresponde a la última */
  get isLastQuestion(): boolean {    
    return this.score.length === this.questions$.results.length
  }

  /* Para navegar entre las preguntas */
  nextQuestion() {
    if(this.questionIndex < this.questions$.results.length - 1) { this.questionIndex++ }
    this.shuffleAnswers
  }
  prevQuestion() {
    if(this.questionIndex > 0) { this.questionIndex-- }
    this.shuffleAnswers
  }

  get progressBar(): number {
    return ((this.questionIndex + 1) / this.questions$.results.length) * 100
  }  

  /* Para confirmar si se desea salir de la partida */  
  exitGame: boolean = false
  get confirmExitGame(): boolean {
    this.router.navigate(['main-menu'])
    return this.exitGame = false
  }
  get cancelExitGame(): boolean {
    return this.exitGame = false
  }
}