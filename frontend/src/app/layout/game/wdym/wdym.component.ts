import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, NavigationExtras} from '@angular/router';
import { RoomService } from '../../../room.service';
import { CommonModule } from '@angular/common';
import { getMultipleValuesInSingleSelectionError } from '@angular/cdk/collections';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Socket } from 'ngx-socket-io';
import { UserStateService } from 'src/app/user-state.service';

@Component({
  selector: 'app-game',
  templateUrl: './wdym.component.html',
  styleUrls: ['./wdym.component.css'],
})
export class WdymComponent implements OnInit {

  constructor(private route: ActivatedRoute, private roomService: RoomService,
    private userStateService: UserStateService) {
    this.submittedCards = [];
    this.roundsWon = 0;
  }
  
  public memeImage;
  public code;
  public caption: string;
  selected = 0;     //index of selected card
  hand: string[];
  submittedCards: string[];
  scores;
  hotSeat;
  roundsWon;
  roundWinner;
  public isCzar;
  
  ngOnInit(): void {   
    this.code = this.userStateService.getLobbyCode();
    this.isCzar = this.userStateService.getIsCzar();

    this.roomService.receiveImage().subscribe((photo) => {
      this.memeImage = photo;
    });

    this.roomService.receiveCard().subscribe((cardString: string) => {
      this.caption = cardString;
    });
    
    //this will just put the host in the hot seat on game initialization
    this.roomService.receiveHost().subscribe((e) => {
      this.isCzar = true;
    });

    this.roomService.receiveHand().subscribe((hand: string[]) => {
      this.hand = hand;
    });

    this.roomService.receiveScores().subscribe((scores) => {
      this.scores = scores;
    });


    this.roomService.returnSubmittedCards().subscribe((submitted: string[]) => {
      this.submittedCards = submitted;
    });

    this.roomService.addPoint().subscribe((e) => {
      this.roundsWon++;
    });
    
    this.roomService.returnRoundWinner().subscribe((winner) => {
      this.roundWinner = winner;
      console.log('winner is: ' + winner);
    });

    //automatically get hands and image on creation of a lobby
    
    this.startTurn(); //this will get host and put them in the hotseat
    this.getHand();
    this.getImage();  //fix this to only call once
    this.getScores();
  }

//Controller for drag and drop
/*onDrop(event: CdkDragDrop<string[]>) {
  if (event.previousContainer === event.container) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }*/
 

  public currentlyClickedCardIndex: number = 0;
  public setcurrentlyClickedCardIndex(cardIndex: number): void {
    this.currentlyClickedCardIndex = cardIndex;
  }
  public checkIfCardIsClicked(cardIndex: number): boolean {
    return cardIndex === this.selected;
  }





  chooseWinner(index) {
    var winningCaption= this.submittedCards[index];
    //get User who submitted that card
    this.roomService.chooseWinner(index, this.code);
    this.roomService.getScores(this.code);
    console.log(winningCaption);
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

  startTurn() {
    this.roomService.startTurn(this.code);
  }

  submitCard(index) {
    var card = this.hand[index];
    this.replaceCard(index);
    this.roomService.submitCard(this.code, card);
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

  getScores() {
    this.roomService.getScores(this.code);
  }


  endTurn(cardIndex) {
    this.memeImage = "";
    this.submitCard(cardIndex);
    this.chooseWinner(cardIndex);


    if (this.isCzar) {
      this.userStateService.turnOffCzarInSelf();
    }


  }

  

} 
