import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, NavigationExtras} from '@angular/router';
import { HttpClient } from'@angular/common/http';
import { RoomService } from '../../../room.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {

  public users = []; //array of users in Lobby
  code: string;  
  username: string;
  id: string;

  
  constructor(private route: ActivatedRoute, private router: Router, private roomService: RoomService) { }
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => { 
      this.code = params['code'];
      this.username = params['username'],
      this.id = params['id']
    })
    this.getUsers();

    this.roomService.getStartGame().subscribe(() => {
      console.log(this.username + " is leaving");
      let navigationExtras: NavigationExtras = { queryParams: 
        {'code': this.code}
      };
      this.router.navigate(['/game/wdym'], navigationExtras);
    });


  }


  startGame() {

    this.roomService.startGame(this.code);
  }

  
  getUsers() { 
    this.roomService.receiveUsers().subscribe((users: string[]) => {
      this.users = users;
    });
    this.roomService.getUsers(this.code);
  }

  
  leaveLobby() {
    this.roomService.leaveLobby(this.username, this.code);
    this.getUsers();
    this.navigateHome(this.username, this.id);
  }

  navigateHome(username: string, id: string) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        'username': username,
        'id': id
      }
    };
    this.router.navigate(['/game/home'], navigationExtras);
  }
  
}
