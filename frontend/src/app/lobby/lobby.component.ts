import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';


@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {

  

  code: String = '';  
  constructor(private route: ActivatedRoute) { 


  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => { 
      this.code = params['code'];
    })

  }

}
