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
  }
//Need to populate this list with generated cards from all players.
cardList = ['Merged right to Main and caused an Error.',
'when you get a merge conflict.',
'copying code from stackoverflow',
'null pointer exception',
'when you hit compile and it works the first time',
'when someone merges spaghetti code ',
'when the project manager wants to use C',
'3 billion devices run java',
'arrays indexes should start at 1',
'when your unicard does not scan at math sciences ',
'linux users',    
'Assembly > Prolog',
'Academic Misconduct']

cardsPlayed=[]
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




} 
