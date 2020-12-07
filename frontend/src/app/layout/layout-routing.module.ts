import { Component, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './game/home/home.component';
import { LobbyComponent } from './game/lobby/lobby.component';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
  {path: "game", component: LayoutComponent, children: [
    {path: "home", component: HomeComponent},
    {path: "lobby", component: LobbyComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
