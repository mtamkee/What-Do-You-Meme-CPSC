import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameRoutingModule } from './game-routing.module';

import { LobbyComponent } from './lobby/lobby.component';
import { HomeComponent } from './home/home.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {FormsModule} from '@angular/forms';
import {MatExpansionModule} from '@angular/material/expansion';
import { ChatModule } from '../../chat/chat.module';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';


@NgModule({
  declarations: [
    LobbyComponent,
    HomeComponent,
  ],
  imports: [
    CommonModule,
    GameRoutingModule,
    MatSidenavModule,
    MatToolbarModule,
    FormsModule,
    MatExpansionModule,
    ChatModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class GameModule { }
