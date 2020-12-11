import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserStateService {

  private username:string;
  private userId: string;
  private lobbyCode: string;
<<<<<<< HEAD
  private isCzar: boolean = false;
=======
>>>>>>> 0cadb41 (Use session-shared service to store the user's state)

  constructor() { }

  setUsername(username: string) {
    this.username = username;
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  setLobbyCode(lobbyCode: string) {
    this.lobbyCode = lobbyCode;
  }

<<<<<<< HEAD
  setSelfAsCzar() {
    this.isCzar = true;
  }

  turnOffCzarInSelf() {
    this.isCzar = false;
  }

=======
>>>>>>> 0cadb41 (Use session-shared service to store the user's state)
  getUsername(): string {
    return this.username;
  }

  getUserId(): string {
    return this.userId;
  }

  getLobbyCode(): string {
    return this.lobbyCode;
  }
<<<<<<< HEAD

  getIsCzar(): boolean {
    return this.isCzar;
  }
=======
>>>>>>> 0cadb41 (Use session-shared service to store the user's state)
}
