import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {

  constructor(private router: Router, private route: ActivatedRoute) { 
  }

  loginUser(userId: string) {
    console.log("User logged in: " + userId);
    this.router.navigate(['home'], {relativeTo: this.route});
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
