import { Routes } from '@angular/router';
import { ErrorPageComponent } from './error-page/error-page.component';
import { MainComponent } from './pages/main/main.component';
import { MenuComponent } from './pages/main/menu/menu.component';
import { GameComponent } from './pages/game/game.component';
import { ScoreComponent } from './pages/game/score/score.component';

export const routes: Routes = [
    { path: '', redirectTo: '/main-menu', pathMatch: 'full' },
    { path: 'main-menu', component: MainComponent },
    { path: 'main-menu/settings', component: MenuComponent },
    { path: 'game', component: GameComponent },
    // { path: 'game/user-score', component: ScoreComponent },
    { path: '**', component: ErrorPageComponent }
];
