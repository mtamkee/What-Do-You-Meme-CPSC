import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, NavigationExtras} from '@angular/router';
import { HttpClient } from'@angular/common/http';



@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {

  public users; //array of users in Lobby
  code: String;  
  
  constructor(private route: ActivatedRoute, private router: Router) { 

  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => { 
      this.code = params['code'];
    })

  } 

}
