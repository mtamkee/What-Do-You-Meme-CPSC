import { Component, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatComponent } from '../chat/chat.component';
import { ChatContainerComponent } from './game/chat-container/chat-container.component';
import { HomeComponent } from './game/home/home.component';
import { LobbyComponent } from './game/lobby/lobby.component';
import { LayoutComponent } from './layout.component';
import { GameModule } from './game/game.module';
import { WdymComponent } from './game/wdym/wdym.component';

const routes: Routes = [
  {path: "game", component: LayoutComponent, children: [
    {path: "home", component: HomeComponent},
    {path: "lobby", component: LobbyComponent},
    {path: "wdym", component: WdymComponent},
    {path: "chat", component: ChatContainerComponent, outlet: "drawer"}
  ]},
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
