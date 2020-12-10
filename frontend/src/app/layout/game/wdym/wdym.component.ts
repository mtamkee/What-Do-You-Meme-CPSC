import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, NavigationExtras} from '@angular/router';
import { RoomService } from '../../../room.service';
import { getMultipleValuesInSingleSelectionError } from '@angular/cdk/collections';

@Component({
  selector: 'app-game',
  templateUrl: './wdym.component.html',
  styleUrls: ['./wdym.component.css']
})
export class WdymComponent implements OnInit {

  constructor(private http: HttpClient, private route: ActivatedRoute, private roomService: RoomService ) { }
  memeImage;
  code;
  ngOnInit(): void {  
    
    this.route.queryParams.subscribe(params => { 
      this.code = params['code'];
    })

    this.roomService.receiveImage().subscribe((photo) => {
      this.memeImage = photo;
    });
  }


  
  getImage() {
    this.roomService.getImage(this.code);
  }
  getCard(){
    this.roomService.getCard(this.code);
  }




} 
