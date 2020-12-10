import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  @ViewChild("drawer") drawer: MatDrawer;

  public username: string = "";
  public isLoggedIn: boolean = false;
  public doLogout: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute) { 
    
  }

  ngOnInit(): void {
    console.log("route children:");
    console.log(this.router);
  }

  loginUser(userData: {id: string, username: string}) {
    console.log("User logged in: " + userData.id);
    this.username = userData.username;
    this.isLoggedIn = true;
    console.log("IsLoggedIn changed to true");
    this.router.navigate(['home'], {queryParams: {username: userData.username, id: userData.id}, relativeTo: this.route});   
  }

  logout() {
    this.router.navigate(['/game']);
    this.doLogout = true;
    this.isLoggedIn = false;
    console.log("IsLoggedIn changed to false");
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
      
      if (!this.hideChat) {
        this.router.navigate([{ outlets: {drawer: "chat"} }], {relativeTo: this.route}, );
      }
    }
  }

  toggleDrawer() {
    if (this.drawer.opened){
      this.drawer.close();
    }
    else {
      this.drawer.open();
    }
  }

  mainRouterActive() {
    console.log("Main/default router outlet was activated.");
  }

  chatRouterActive() {
    console.log("Chat router outlet was activated.");
  }

}
