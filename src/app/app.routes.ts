import { Routes } from '@angular/router';
import { MainComponent } from './pages/main/main.component';
import { MenuComponent } from './pages/main/menu/menu.component';
import { GameComponent } from './pages/game/game.component';
import { ErrorComponent } from './shared/error/error.component';
import { ScoreComponent } from './pages/game/score/score.component';

export const routes: Routes = [
    { path: '', redirectTo: 'main-menu', pathMatch: 'full' },
    { path: 'main-menu', component: MainComponent },
    { path: 'main-menu/settings', component: MenuComponent },
    { path: 'game', component: GameComponent },
    { path: 'game/user-score', component: ScoreComponent },
    { path: 'error', component: ErrorComponent },
    { path: '**', redirectTo: 'error' }
];
