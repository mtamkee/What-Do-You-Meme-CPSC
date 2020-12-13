import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(private socket: Socket) { }

    sendAddUser(username: string, code: string) {
      return this.socket.emit("addUser", username, code);
    }
      
    createLobby(code: string) {
      return this.socket.emit('createLobby', code);
    }

    getUsers(code: string) {
      this.socket.emit('getUsers', code);
    }
    
    receiveUsers() {
      return this.socket.fromEvent('receiveUsers');
    }

    leaveLobby(username: string, code: string) {
      return this.socket.emit('leaveLobby', username, code);
    }

    isValidLobby(code: string) {
       this.socket.emit('isValidLobby', code);
    }

    receiveValidLobby() {
      return this.socket.fromEvent('receiveValidLobby');
    }

    startGame(lobbyCode) {
      this.socket.emit('startGame', lobbyCode);
    }

    getStartGame() {
      return this.socket.fromEvent('getStartGame');
    }
    
    receiveImage() {
      return this.socket.fromEvent('returnImage');
    }

    getImage(code) {
      this.socket.emit('callImage', code);
    }
    
    getCard(code){
      this.socket.emit('callCard',code);
    }

    getHand(code) {
      this.socket.emit('callHand', code)
    }
    
    replaceCard(code, index) {
      this.socket.emit('replaceCard', code, index);
    }

    receiveHand() {
      return this.socket.fromEvent('returnHand');
    }
    
    receiveCard() {
      return this.socket.fromEvent('returnCard');
    }
    receiveCard1() {
      return this.socket.fromEvent('returnCard1');
    }

    returnSubmittedCards() {
      return this.socket.fromEvent('returnSubmittedCards');
    }

    submitCard(lobbyCode, card) {
      return this.socket.emit('submitCard', lobbyCode, card);
    }

    startTurn(lobbyCode) {
      return this.socket.emit('startTurn', lobbyCode);
    }

    receiveHost() {
      return this.socket.fromEvent('returnHost');
    }
    
    //i don't think this is used
    returnHost() {
      return this.socket.fromEvent('returnHost');
    }
    
    chooseWinner(index, lobbyCode, caption) {
      this.socket.emit('chooseWinner', index, lobbyCode, caption);
    }

    addPoint() {
      return this.socket.fromEvent('addPoint');
    }

    returnRoundWinner() {
      return this.socket.fromEvent('returnRoundWinner');
    }

    returnRoundCaption() {
      return this.socket.fromEvent('returnRoundCaption');
    }

    toggleOverlay() {
      return this.socket.fromEvent('toggleOverlay');
    }

    getScores(lobbyCode) {
       this.socket.emit('getScores', lobbyCode);
    } 

    receiveScores() {
      return this.socket.fromEvent('receiveScores');
    }

}
