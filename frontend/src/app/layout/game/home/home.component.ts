import { Component, OnInit } from '@angular/core';
import { HttpClient } from'@angular/common/http';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { RoomService } from '../../../room.service';
import { LobbyComponent } from '../lobby/lobby.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router, private roomService: RoomService) { }

  username: string; 
  id: string; 
  validLobby: boolean;
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => { 
      this.username = params['username'];
      this.id = params['id'];
    });
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
  createLobby(username: string): string { 
    //generate code:
    //from https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < 5; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }    
    this.roomService.createLobby(result);
    this.joinLobby(result, username); 
    //this.navigateLobby(result, this.username, this.id);
    return result;  
  }
  
  /**
   * join a new lobby by code 
   */
  joinLobby(code: string, username: string) {

    //if (this.isValidLobby(code)) {
       // if (this.isValidLobby(code)===true) {
      //if (this.validLobby === true) {
        this.roomService.sendAddUser(username, code);
        this.navigateLobby(code, this.username, this.id);
       // }
    //  }
  //  }

  } 

  /**
   *  navigate to the lobby with router
   */
  navigateLobby(code: string, username: string, id: string) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        "code": code,
        'username': username,
        'id': id
      }
    };
    this.router.navigate(['/game/lobby'], navigationExtras);
  }
  
  /* 
   * need to fix
   *
  isValidLobby(code: string) {
    var res;
    this.roomService.receiveValidLobby().subscribe((answer) => {
      return answer;
    });
    this.roomService.isValidLobby(code);
  }
  */
}
