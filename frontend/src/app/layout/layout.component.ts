import { AfterViewInit, ChangeDetectorRef, Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { MatDrawer } from '@angular/material/sidenav';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserStateService } from '../user-state.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit, AfterViewInit{

  @ViewChild("drawer") drawer: MatDrawer;

  public username: string = "";
  public isLoggedIn: boolean = true;
  private changedLogin: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute, 
    private auth: AngularFireAuth, private zone: NgZone, private userStateService: UserStateService) { 
    
  }
  ngAfterViewInit(): void {
    setTimeout(() => { // Do nothing for 1.2 seconds and wait for auth service to detect login
      if (!this.changedLogin) {
        this.isLoggedIn = false;
      }
    }, 1200);
  }

  ngOnInit(): void {
    this.zone.runOutsideAngular(() => this.auth.onAuthStateChanged((user) => {
      if (user !== null) {
        let username = user.displayName || user.email;
        let userId = user.uid;

        this.changedLogin = true;
        this.zone.run(() => {
          this.username = username;
          this.isLoggedIn = true;
        });

        this.userStateService.setUsername(username);
        this.userStateService.setUserId(userId)

        setTimeout(() => { // Do nothing and wait for login component to update
        }, 1000);
        this.zone.run(() => {
          this.router.navigate(['home'], {relativeTo: this.route});   
        })
      } else {
        this.username = "";
      }
    }));
  }

  logout() {
    this.auth.signOut();
    this.isLoggedIn = false;
    this.router.navigate(['/game']);
    //console.log("IsLoggedIn changed to false");
  }
  
  title = "What Do You Meme? CPSC"
  public toolbarToggleValue;
  public hideUsers = true;
  public hideChat = true;
  
  onToggleChange(event) {
    if (event === "users") {
      //console.log("Toggling users");
      this.hideUsers = !this.hideUsers;
    }
    if (event === "chat") {
      //console.log("Toggling chat");
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
    //console.log("Main/default router outlet was activated.");
  }

  chatRouterActive() {
    //console.log("Chat router outlet was activated.");
  }

}