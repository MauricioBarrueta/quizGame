import { Component, OnInit } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';
import { TriviaCategory } from './interface/categories';
import { MenuService } from './service/menu.service';
import { FormsModule } from '@angular/forms'
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslatorService } from '../service/translator.service';

@Component({
  selector: 'app-menu',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './menu.component.html',
})
export class MenuComponent implements OnInit {

  constructor(private menuService: MenuService, private translatorService: TranslatorService, private router: Router) {}

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

  /* Se mandan los parámetros */  
  setParams() {
    const params = { amount: this.amount, category: this.category, difficulty: this.difficulty, type: this.type };
    //* Controla en cómo se almacenarán los parámetros, si se eligió traducir, se almacenan en localStorage, si no, se pasan como estados de navegación (state)
    if (this.checked) {
      //? Guardarlos en localStorage evita que se borren al recargar la página tras activar Google Translate
      localStorage.setItem('params', JSON.stringify(params))
      this.translatorService.enableTranslation('es')
    } else {
      //? Los estados de navegación (NavigationExtras.state) sirven para pasar parámetros en la URL sin que sean visibles en esta
      this.router.navigate(['game'], { state: params })
    }
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