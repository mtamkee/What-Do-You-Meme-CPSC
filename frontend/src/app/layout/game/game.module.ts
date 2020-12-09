import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameRoutingModule } from './game-routing.module';
import { ChatModule } from '../../chat/chat.module';
import { BrowserModule } from '@angular/platform-browser';
import { LobbyComponent } from './lobby/lobby.component';
import { HomeComponent } from './home/home.component';
import { ChatContainerComponent } from './chat-container/chat-container.component';
import { SocketService } from './socket-service/socket-service';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {FormsModule} from '@angular/forms';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';

import { Globals } from './wdym/globals';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { WdymComponent } from './wdym/wdym.component';
import { AppComponent } from 'src/app/app.component';

@NgModule({
  declarations: [
    LobbyComponent,
    HomeComponent,
    ChatContainerComponent,
    WdymComponent
  ],
  imports: [
    CommonModule,
    GameRoutingModule,
    ChatModule,

    MatSidenavModule,
    MatToolbarModule,
    FormsModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,

    BrowserModule,
    DragDropModule
  ],
  providers:[SocketService, Globals],
  bootstrap: [AppComponent]
})
export class GameModule { }
