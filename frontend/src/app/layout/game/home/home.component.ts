import { Component, OnInit } from '@angular/core';
import { HttpClient } from'@angular/common/http';
import { Router, NavigationExtras } from '@angular/router';
import { RoomService } from '../../../room.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router, private roomService: RoomService) { }

  ngOnInit(): void {
    console.log('here');
  }

  goToLobby(): String { 
    //generate code:
    //from https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < 5; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    
    this.roomService.createLobby(result);
    this.joinLobby(result, 'user 1'); //fix username to match login

    let navigationExtras: NavigationExtras = {
      queryParams: {
        "code": result
      }
    };

    this.router.navigate(['/game/lobby'], navigationExtras);

    return result;
  }

  joinLobby(code: String, username: String) {

    this.roomService.sendAddUser(username, code);

    let navigationExtras: NavigationExtras = {
      queryParams: {
        "code": code
      }
    };
    
    this.router.navigate(['/game/lobby'], navigationExtras);
  } 


}
