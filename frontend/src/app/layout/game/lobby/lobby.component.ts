import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, NavigationExtras} from '@angular/router';
import { HttpClient } from'@angular/common/http';
import { RoomService } from '../../../room.service';
import { UserStateService } from 'src/app/user-state.service';


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
  isCzar: boolean;

  constructor(private route: ActivatedRoute, private router: Router, private roomService: RoomService,
    private userStateService: UserStateService) { }
  ngOnInit(): void {
   /* this.route.queryParams.subscribe(params => { 
      this.code = params['code'];
      this.username = params['username'],
      this.id = params['id']
    })*/
    this.code = this.userStateService.getLobbyCode();
    this.username = this.userStateService.getUsername();
    this.id = this.userStateService.getUserId();
    this.isCzar = this.userStateService.getIsCzar();
    this.getUsers();  
    this.roomService.getStartGame().subscribe(() => {
     /* let navigationExtras: NavigationExtras = { queryParams: 
        {'code': this.code}
      };*/
      this.router.navigate(['/game/wdym']);//, navigationExtras);
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
    if (this.userStateService.getIsCzar()) {
      this.userStateService.turnOffCzarInSelf();
    }
    this.roomService.leaveLobby(this.username, this.code);
    this.userStateService.setLobbyCode('');
    this.getUsers();
    this.navigateHome(this.username, this.id);
  }

  navigateHome(username: string, id: string) {
    /*let navigationExtras: NavigationExtras = {
      queryParams: {
        'username': username,
        'id': id
      }
    };*/
    this.router.navigate(['/game/home']);//, navigationExtras);
  }
  
}
