import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LobbyComponent } from './lobby/lobby.component';
import { HomeComponent } from './home/home.component';
import { GameComponent } from './game/game.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'lobby', component: LobbyComponent, data :{ code: String }},
  { path: '', component: HomeComponent},
  {path: "login-page", component: LoginComponent}
];
import { LoginComponent } from './login/login.component';

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { 

}



