import { Component } from '@angular/core';
import { HttpClient } from'@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

 
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{

  constructor(private http: HttpClient, private router: Router) { 


  }

  
  title = "What Do You Meme? CPSC"
  public toolbarToggleValue;
  public hideUsers = true;
  public hideChat = true;

  onToggleChange(event) {
    if (event === "users") {
      console.log("Toggling users");
      this.hideUsers = !this.hideUsers;
    }
    if (event === "chat") {
      console.log("Toggling chat");
      this.hideChat = !this.hideChat;
    }
  }
}
