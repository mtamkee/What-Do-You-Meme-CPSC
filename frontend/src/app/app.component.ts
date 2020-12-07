import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/app';
import { Observable } from 'rxjs';

 
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{

  constructor(private router: Router) { 
  }

  loginUser(userId: string) {
    console.log("User logged in: " + userId);
    this.router.navigate(['home']);
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
