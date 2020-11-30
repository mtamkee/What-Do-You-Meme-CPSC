import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  
  title = 'What Do You Meme CPSC';

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
