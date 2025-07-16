import { AfterViewInit, Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { GameService } from './service/game.service';
import { catchError, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Questions } from './interface/questions';
import { Score } from './score/interface/score';
import { ModalService } from '../../shared/modal/service/modal.service';
import { ScoreService } from './score/service/score.service';

@Component({
  imports: [CommonModule],
  templateUrl: './game.component.html',
})
export class GameComponent implements OnInit, OnDestroy, AfterViewInit {

  /* Parámetros */
  amount: number = 0; category: number = 0 
  difficulty: string = ''; type: string = ''
  
  questions$: Questions = {} as Questions
  questionAnswers$: string[] = []
  questionIndex: number = 0  
  score: Score[] = []

  mouseEnter: boolean = false

  //* Registra la función cada que se da clic en los botones 'atras' o 'adelante' del navegador
  private popStateHandler: (() => void) | null = null

  //* Se inyecta el token (PLATFORM_ID) para saber si se está ejecutando en un navegador y no en un servidor externo (SSR)
  constructor(private gameService: GameService, private scoreService: ScoreService, private router: Router, @Inject(PLATFORM_ID) private platformId: Object, private confirmationModal: ModalService) {}  
  
  ngOnInit(): void { 
    /* Verifica si se está ejecutando en el navegador y no en el servidor */
    if (isPlatformBrowser(this.platformId)) {
      /* Comprueba el origen de los parámetros, si son de localStorage, state o valores predeterminados */
      const savedParams = localStorage.getItem('params')
      if (savedParams) {
        const params = JSON.parse(savedParams)
        this.amount = params.amount || 10; this.category = params.category || 0
        this.difficulty = params.difficulty || ''; this.type = params.type || ''
        localStorage.removeItem('params') //* Se borran del localStorage para evitar que se usen otra vez

      } else if (history.state && Object.keys(history.state).length > 0) {
        const state = history.state
        this.amount = state.amount || 10; this.category = state.category || 0
        this.difficulty = state.difficulty || ''; this.type = state.type || ''

      } else {
        this.amount = 10; this.category = 0
        this.difficulty = ''; this.type = ''
      }
      this.getQuestionsList()
    }

    /* Detecta si se activó Google Translate */
    const redirect = localStorage.getItem('redirectAfterTranslate') //* Valor en localStorage previamente creado en el service del traductor
    if (redirect === 'true') {
      localStorage.removeItem('redirectAfterTranslate') //* Se elimina de localStorage para asegurar que se inicialize solo una vez      
      /* Para prevenir que cargue el traductor antes que el contenido de la ruta */
      setTimeout(() => {
        this.loadGoogleTranslate()
      }, 300)
    }

    /* Para detectar cuando se da clic en los botones 'atras' o 'adelante' del navegador, mostrando el Modal de confirmación en vez de abandonar la página */
    history.pushState(null, '', location.href) //* Se crea una copia de la página en el historial, esto previene la acción de retroceder o adelantar
    this.popStateHandler = () => {
      //* Se vuelve a crear otra entrada para reiniciar la acción de volver a atrás y así poder mostrar el mensaje de confirmación
      history.pushState(null, '', location.href)
      this.showConfirmModal()
    }
    window.addEventListener('popstate', this.popStateHandler) //? 'popstate' es el evento que se llama al dar clic en los botones del navegador
  }

  ngOnDestroy(): void {
    /* Destruye el evento asegurándose de que solo funcione en este componente */
    if (this.popStateHandler)
      window.removeEventListener('popstate', this.popStateHandler)    
  }

  ngAfterViewInit(): void {
    /* Mezcla las respuestas una vez que se ha obtenido la lista de preguntas */
    this.shuffleAnswers 
  }

  /* Obtiene la lista de preguntas de acuerdo a los parámetros obtenidos */
  getQuestionsList() {    
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

  /* Devuelve la lista de las respuestas de cada pregunta mezcladas de manera aleatoria */
  //? Index Signature: { [key: KeyType]: ValueType } En este caso, es un objeto con propiedades number, y cada una contiene un arreglo string[]
  mixedAnswers: { 
    [index: number]: string[] 
  } = {}   
  get shuffleAnswers(): string[] {
    //* Valida si ya se han mezclado las respuestas de la pregunta actual o no
    if (!this.mixedAnswers[this.questionIndex]) {
      const question = this.indivQuestion
      //* Las respuestas incorrectas y correcta se agregan a un nuevo array
      const answers = [...question.incorrect_answers, question.correct_answer] //? Se usa spread operator (...) para copiar los elementos del array de respuestas incorrectas en el nuevo 
      this.mixedAnswers[this.questionIndex] = answers.sort(() => Math.random() - .5)
    }
    return this.mixedAnswers[this.questionIndex]
  } 
  
  /* Obtiene la respuesta correcta de cada pregunta */
  getCorrectAnswer(selected: string): boolean {
    const correct = this.indivQuestion.correct_answer
    return selected === correct
  }

  /* Almacena el resultado de cada pregunta y valida su estado (respondida/pendiente) */
  onAnswerSelected(answer: string) {    
    //* Verifica si la pregunta ya fue respondida y evita duplicarla en el array
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
    /* Inyecta el array de resultados en el service del componente Score y redirecciona a la ruta para mostrar los resultados */
    if(this.score.length === this.questions$.results?.length) {
      this.scoreService.pushScoreData(this.score)
      this.router.navigate(['game/user-score'], { replaceUrl: true }) //? replaceUrl previene que se redireccione nuevamente a /game
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

  /* Navegación entre índices (preguntas) */
  nextQuestion() {
    if(this.questionIndex < this.questions$.results.length - 1) { this.questionIndex++ }
    this.shuffleAnswers      
  }
  prevQuestion() {
    if(this.questionIndex > 0) { this.questionIndex-- }
    this.shuffleAnswers      
  }

  /* Muestra el progreso del juego mediante una barra, el % de progreso depende del total de índices (preguntas) */
  get progressBar(): number {
    return ((this.questionIndex + 1) / this.questions$.results.length) * 100
  }  

  /* Se mandan y asignan los valores al objeto y se muestra el Modal */  
  showConfirmModal() {
    this.confirmationModal.showModal({
      icon: '⚠️',
      title: '¿Estás seguro de que deseas salir?',
      subtitle: 'Perderás todo tu progreso',
      confirmText: 'Salir del juego',
      cancelText: 'Permanecer',
      onConfirm: () => this.exitGameAndReset()
    });
  }
  
  //* Google Translate *//
  loadGoogleTranslate() { /* Para cargar el script una única vez */
    if ((window as any).google?.translate?.TranslateElement) { //* Se verifica si ya se cargó el script
      this.initGoogleTranslate()
      return
    }
    /* Se define la función global que Google Translate espera recibir al cargar el script */
    (window as any).googleTranslateElementInit = () => { this.initGoogleTranslate() }
    //* Si no se a cargado se crea el elemento de Google Translate para agregarlo al body
    if (!document.getElementById('google_translate_script')) {
      const script = document.createElement('script')
      script.id = 'google_translate_script'
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit' /* Se asigna la función global */
      document.body.appendChild(script)
    }
  }

  /* Para activar el widget y asignar los idiomas que estarán disponibles */
  initGoogleTranslate() {
    new (window as any).google.translate.TranslateElement({
      pageLanguage: 'en',
      includedLanguages: 'es,en',
    }, 'google_translate_element')
  }

  /* Verifica que después de haber redireccionado se restablezca el idioma y se destruyan los parámetros almacenados en localStorage */
  exitGameAndReset() {
    this.router.navigate(['main-menu']).then(() => {
      this.gameService.destroyGoogleTranslate() 
      localStorage.removeItem('params')
    })
  }
}