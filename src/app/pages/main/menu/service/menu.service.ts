import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Categories, TriviaCategory } from '../interface/categories';
import { environment } from '../../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private http: HttpClient) { }

  getCategories(): Observable<TriviaCategory[]> {
    return this.http.get<Categories>(`${environment.url}api_category.php`)
      .pipe(
        map((res: Categories) => { return res.trivia_categories })
      )      
  }
}