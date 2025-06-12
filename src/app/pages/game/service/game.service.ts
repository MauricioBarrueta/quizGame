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
    //? Si no se cumple la condición, devuelve los parámetros actuales sin modificar
      params = amount > 0 ? params.set('amount', `${amount}`) : params
      params = category > 0 ? params.set('category', `${category}`) : params
      params = difficulty !== '' ? params.set('difficulty', `${difficulty}`) : params
      params = type !== '' ? params.set('type', `${type}`) : params

    return this.http.get<Questions>(`${environment.url}api.php`, { params: params })
    .pipe(
      map((res: Questions) => { return res }),
      catchError((error) => {
        console.error('Error al obtener las preguntas:', error)
        return throwError(() => error)
      })
    )      
  }
}