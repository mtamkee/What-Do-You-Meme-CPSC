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

  code: String;  
  
  constructor(private route: ActivatedRoute, private router: Router, private roomService: RoomService) { 

  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => { 
      this.code = params['code'];
    })
  }

  startGame() {
    let navigationExtras: NavigationExtras = {
  
    };
    
    this.router.navigate(['/game/wdym'], navigationExtras);
  }
  
  //TO-DO update on change of users
  //updates on button click now
  getUsers() { 
    this.roomService.receiveUsers().subscribe((users: String[]) => {
      this.users = users;
    });
    this.roomService.getUsers(this.code);

  }


}
