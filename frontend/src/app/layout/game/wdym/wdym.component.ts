import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, NavigationExtras} from '@angular/router';
import { RoomService } from '../../../room.service';
import { CommonModule } from '@angular/common';
import { getMultipleValuesInSingleSelectionError } from '@angular/cdk/collections';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Socket } from 'ngx-socket-io';
import { UserStateService } from 'src/app/user-state.service';

@Component({
  selector: 'app-wdym',
  templateUrl: './wdym.component.html',
  styleUrls: ['./wdym.component.css'],
})
export class WdymComponent implements OnInit {


  constructor(private route: ActivatedRoute, private router: Router, private roomService: RoomService,
    private userStateService: UserStateService) {
    this.submittedCards = [];
    this.roundsWon = 0;
  }
  
  public memeImage;
  public code;
  public caption: string;
  public currentlyClickedCardIndex: number = 0;    //index of selected card
  hand: string[];
  submittedCards: string[];
  scores;
  roundsWon;
  roundWinner;
  winner; //game winner
  public winningCaption;
  public isCzar;
  public showOverlay: boolean = false;
  public showWinnerOverlay: boolean = false;

  
  ngOnInit(): void {   
    this.code = this.userStateService.getLobbyCode();
    this.isCzar = this.userStateService.getIsCzar();

    this.roomService.receiveImage().subscribe((photo) => {
      this.memeImage = photo;
    });

    this.roomService.receiveCard().subscribe((cardString: string) => {
      this.caption = cardString;
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
      this.showOverlay = true;
      setTimeout(() => {  this.showOverlay=false; }, 1000); //show overlay for 7s
      console.log('winner is: ' + winner);
    });

    this.roomService.returnCzar().subscribe((e) => {
      this.userStateService.setSelfAsCzar();
      this.isCzar = true;
    });


    this.roomService.returnGameWinner().subscribe((winner) => { 
      this.winner = winner;
      console.log('winner' + winner);
      this.showWinnerOverlay = true;
    });




    //automatically get hands and image on creation of a lobby
    this.startTurn(); 
    this.getHand();
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



  public returnHome() {
    console.log('yes');
    this.router.navigate(['/game/home']);

    this.userStateService.setLobbyCode("");
  }

  
  public setcurrentlyClickedCardIndex(cardIndex: number): void {
    this.currentlyClickedCardIndex = cardIndex;
  }

  public checkIfCardIsClicked(cardIndex: number): boolean {
    return cardIndex === this.currentlyClickedCardIndex;
  }

  chooseWinner(index) {
    this.getImage();
    var winningCaption = this.submittedCards[index];
    this.winningCaption = winningCaption;
    //get User who submitted that card
    this.roomService.chooseWinner(index, this.code);
    this.roomService.getScores(this.code);
    this.endTurn();
    return winningCaption;
  }
 
  getImage() {
    this.roomService.getImage(this.code);
  }

  getCard(){
    return this.roomService.getCard(this.code);
  }

  getSelected() {
    return this.currentlyClickedCardIndex;
  }

  startTurn() {
    this.getImage();
    return this.roomService.startTurn(this.code);
  }

  submitCard(index) {
    var card = this.hand[index];
    this.replaceCard(index);
    this.roomService.submitCard(this.code, card);
  }


  //winner is currently set in backend for 5 points (can be changed easily)
  checkWinner(lobbyCode) {
    this.roomService.checkWinner(lobbyCode);
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

  

  endTurn() {
    this.getImage();
    this.submittedCards=[];
    if (this.isCzar) {
      this.userStateService.turnOffCzarInSelf();
      this.isCzar = false;
    }     
    this.checkWinner(this.userStateService.getLobbyCode());
    this.roomService.getNextCzar(this.code);
  }


} 
