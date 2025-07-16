import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Questions } from '../interface/questions';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private http: HttpClient) { }

  getParams(amount: number, category: number, difficulty: string, type: string): Observable<Questions> {
    let params = new HttpParams()
    //* Si no se cumple la condición, devuelve los parámetros actuales sin modificar
      params = amount > 0 ? params.set('amount', `${amount}`) : params
      params = category > 0 ? params.set('category', `${category}`) : params
      params = difficulty !== '' ? params.set('difficulty', `${difficulty}`) : params
      params = type !== '' ? params.set('type', `${type}`) : params

    return this.http.get<Questions>(`${environment.url}api.php`, { params: params })
    .pipe(
      map((res: Questions) => { return res }),
      catchError((error) => {
        return throwError(() => error)
      })
    )      
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
    location.reload()
  }
}