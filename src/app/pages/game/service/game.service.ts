import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Questions } from '../interface/questions';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  isReloadingSubject = new BehaviorSubject<boolean>(false)
  isReloading$ = this.isReloadingSubject.asObservable()

  constructor(private http: HttpClient) { }
  
  getQuizList(amount: number, category: number, difficulty: string, type: string): Observable<Questions> {
    let params = new HttpParams()

    //* Si no se cumple la condición, devuelve los parámetros actuales sin modificar
    params = amount > 0 ? params.set('amount', `${amount}`) : params
    params = category > 0 ? params.set('category', `${category}`) : params
    params = difficulty !== '' ? params.set('difficulty', `${difficulty}`) : params
    params = type !== '' ? params.set('type', `${type}`) : params

    return this.http.get<Questions>(`${environment.url}api.php`, { params })
      .pipe(
        map((res: Questions) => ({
          ...res,
          results: res.results.map(question => ({
            ...question,
            /* Elimina los prefijos de las categorías para mostrar únicamente el nombre */
            category: question.category.replace(/^(Entertainment|Science): /, '')
          }))
        })),
        catchError((error) => {
          return throwError(() => error)
        })
      )
  }

  /* Algoritmo Fisher-Yates, usado para mezclar un array de manera uniforme */
  shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      /* Intercambia el elemento actual con el elemento aleatorio */
      [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
  }

  /* Para desactivar el traductor y volver al idioma original del sitio */
  destroyGoogleTranslate() {
    //* Se establece 1 año como tiempo de expiración para la cookie que almacena la traducción
    const expireDate = new Date()
    expireDate.setFullYear(expireDate.getFullYear() + 1)

    //* Se restablecen los valores originales de la cookie 'googtrans' y el valor almacenado en el localStorage, definido en el service del traductor
    document.cookie = `googtrans=/en/en;path=/;domain=${window.location.hostname};expires=${expireDate.toUTCString()}`
    localStorage.setItem('googtrans', '/en/en')
    localStorage.removeItem('redirectAfterTranslate')

    /* Muestra un loader para ocultar la recarga de la página */    
    const loader = document.createElement('div')
    loader.id = 'loader'
    loader.className = 'fixed inset-0 z-[9999] flex items-center justify-center !bg-[var(--jet-dark)] cursor-default'
    loader.innerHTML = `
      <p class="w-full text-lg md:text-xl font-medium text-center tracking-wider text-white text-shadow-3d">
        Saliendo de la partida
        <span class="loader-dots">
          <span class="loader-dot">.</span><span class="loader-dot">.</span><span class="loader-dot">.</span>
        </span>
      </p>`
          
    document.body.appendChild(loader)

    location.reload()
  }
}