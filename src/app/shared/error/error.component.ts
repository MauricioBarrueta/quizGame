import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-error',
  imports: [RouterModule, CommonModule],
  templateUrl: './error.component.html',
})
export class ErrorComponent {

  mouseEnter: boolean = false

}
