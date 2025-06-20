import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameComponent } from './game/game.component';
import { MainComponent } from './main/main.component';
import { MenuComponent } from './main/menu/menu.component';
import { provideHttpClient } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { ScoreComponent } from './game/score/score.component';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    CommonModule,
    MainComponent,
    MenuComponent,
    GameComponent,
    // ScoreComponent
  ],
  exports: [
    MainComponent,
    MenuComponent,
    GameComponent,
    // ScoreComponent
  ],
  providers: [
    provideHttpClient()
  ]
})
export class PagesModule { }
