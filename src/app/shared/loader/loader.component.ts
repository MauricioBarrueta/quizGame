import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loader',
  imports: [],
  templateUrl: './loader.component.html',
})
export class LoaderComponent {

  @Input({ required: true }) text!: string

}
