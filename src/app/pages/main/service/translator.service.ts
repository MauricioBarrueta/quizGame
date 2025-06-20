import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TranslatorService {

  constructor(private router: Router) { }

  /* Crea la cookie googtrans y habilita el traductor de Google */
  enableTranslation(lang: string) {
    const googTrans = `/en/${lang}` //* Traducción 'en' a 'es'
    //* Se establece 1 año como tiempo de expiración para la cookie que almacena la traducción
    const expireDate = new Date()
    expireDate.setFullYear(expireDate.getFullYear() + 1)

    //* Se crea la cookie 'googtrans' con la cual Google Translate detecta el idioma a utilizar y se guarda en el localStorage
    document.cookie = `googtrans=${googTrans};path=/;domain=${window.location.hostname};expires=${expireDate.toUTCString()}`
    localStorage.setItem('googtrans', googTrans)
    //* Verifica si se debe activar el traductor después de redirigir, esta se usa en el componente destino (Game)
    localStorage.setItem('redirectAfterTranslate', 'true')

    this.router.navigate(['game'], { replaceUrl: true })
  }
}