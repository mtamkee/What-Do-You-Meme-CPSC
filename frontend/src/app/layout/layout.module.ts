import { NgModule } from '@angular/core';
//import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { GameModule } from './game/game.module';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { LoginComponent } from './login/login.component';

import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {FormsModule} from '@angular/forms';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
  declarations: [LayoutComponent, LoginComponent],
  imports: [
    CommonModule,
    //BrowserModule,
    LayoutRoutingModule,
    MatSidenavModule,
    MatToolbarModule,
    FormsModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class LayoutModule { }
