import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from'@angular/common/http';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { RoomService } from '../../../room.service';
import { LobbyComponent } from '../lobby/lobby.component';
import { UserStateService } from 'src/app/user-state.service';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


  @ViewChild('errorMessage') errorMessage: ElementRef;

  constructor(private route: ActivatedRoute, private router: Router, private roomService: RoomService,
    private userStateService: UserStateService) { }
  


  username: string; 
  id: string; 
  validLobby;

  ngOnInit(): void {
    this.username =this.userStateService.getUsername();
    this.id = this.userStateService.getUserId();
    
    this.roomService.receiveValidLobby().subscribe((valid) => {
      this.validLobby = valid;
    })
  
  } 
  
  getUsername() {
    return this.username;
  }

  getId() {
    return this.id;
  }

  /**
   * create and join a new lobby with a randomly generated code
   */
  createLobby(): string { 
    //generate code:
    //from https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < 5; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }    
    this.roomService.createLobby(result);
    this.joinLobby(result);  // will use roomService and navigate to lobby
    this.userStateService.setLobbyCode(result);
    return result;  
  }
  
  /**
   * join a new lobby by code 
   */
  joinLobby(code: string) {
      if (code.length != 5) {

        this.errorMessage.nativeElement.innerHTML = 'Error: Invalid Lobby Code. Try Again!';
        return;
      };
      this.userStateService.setLobbyCode(code);
      this.roomService.sendAddUser(this.userStateService.getUsername(), code);
      this.navigateLobby(code, this.userStateService.getUsername(), this.userStateService.getUserId());
      this.errorMessage.nativeElement.innerHTML = '';

  } 

  /**
   *  navigate to the lobby with router
   */
  navigateLobby(code: string, username: string, id: string) {
    this.router.navigate(['/game/lobby']);
  }
  
  /* 
   * need to fix
   */
  
   /*
  isValidLobby(code: string) {
    var res;
    this.roomService.isValidLobby(code);
  }*/
  
}
