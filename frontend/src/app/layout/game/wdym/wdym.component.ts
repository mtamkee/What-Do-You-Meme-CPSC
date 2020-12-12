import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, NavigationExtras} from '@angular/router';
import { RoomService } from '../../../room.service';
import { getMultipleValuesInSingleSelectionError } from '@angular/cdk/collections';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-game',
  templateUrl: './wdym.component.html',
  styleUrls: ['./wdym.component.css'],
})
export class WdymComponent implements OnInit {

  constructor(private http: HttpClient, private route: ActivatedRoute, private roomService: RoomService ) {console.log(this.getCard()) }
  
  public memeImage;
  public code;
  public caption: string;
  selected = 0;     //index of selected card
  hand: string[];
  ngOnInit(): void {  
    
    this.route.queryParams.subscribe(params => { 
      this.code = params['code'];
    })

    this.roomService.receiveImage().subscribe((photo) => {
      this.memeImage = photo;
    });

    this.roomService.receiveCard().subscribe((cardString: string) => {
      this.caption = cardString;
    });

    this.roomService.receiveHand().subscribe((hand: string[]) => {
      this.hand = hand;
    });

    //automatically get hands and image on creation of a lobby
    this.getHand();
    this.getImage();
  }

//Controller for drag and drop
onDrop(event: CdkDragDrop<string[]>) {
  if (event.previousContainer === event.container) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  getImage() {
    this.roomService.getImage(this.code);
  }

  getCard(){
    return this.roomService.getCard(this.code);
  }

  getSelected() {
    return this.selected;
  }

  selectCard(index) { 
    this.selected = index;
  }
  /**
   * returns an entire hand of cards for start of game
   */
  getHand() { 
    return this.roomService.getHand(this.code); 
  }
  
  /*
  * replaces a single card by index (0 - 4)
  * returns the entire hand with the replaced card
  */
  replaceCard(index) {
    return this.roomService.replaceCard(this.code, index);
  }




} 
