import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';


@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {

  public toolbarToggleValue;
  public hideUsers = true;
  public hideChat = true;
  public users; //array of users in Lobby
  code: String;  
  
  constructor(private route: ActivatedRoute) { 

  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => { 
      this.code = params['code'];
    })

  } 

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
