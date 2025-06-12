import { Component, OnInit } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';
import { TriviaCategory } from './interface/categories';
import { MenuService } from './service/menu.service';
import { FormsModule } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  imports: [FormsModule, CommonModule],
  templateUrl: './menu.component.html',
})
export class MenuComponent implements OnInit {

  constructor(private menuService: MenuService, private router: Router) {}

  categories$: TriviaCategory[] = []
  /* Parámetros */
  amount: number = 0; category: number = 0
  difficulty: string = ''
  type: string = ''

  checked: boolean = false
  mouseEnter: boolean = false

  ngOnInit(): void {
    this.checked ? false : true
    this.getCategories()  
  }

  /* Obtiene el valor de los parámetros para enviarlos ocultos en la URL */
  setParams() {
    //? Los estados de navegación (NavigationExtras.state) sirven para pasar parámetros en la URL sin que sean visibles en esta
    this.router.navigate(['game'], {
      state: { amount: this.amount, category: this.category, difficulty: this.difficulty, type: this.type }
    })  
  }

  /* Obtiene la lista de todas las categorías */
  getCategories() {
    this.menuService.getCategories()
    .pipe(
      tap((res: TriviaCategory[]) => {
        this.categories$ = res
      }),
      catchError(error => {        
        return throwError(() => error)
      })      
    )
    .subscribe({
      error: err => { 
        console.error('Error al obtener categorías: ' + err) 
      }
    })    
  }
}