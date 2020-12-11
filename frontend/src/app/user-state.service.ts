import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserStateService {

  private username:string;
  private userId: string;
  private lobbyCode: string;
<<<<<<< HEAD
<<<<<<< HEAD
  private isCzar: boolean = false;
=======
>>>>>>> 0cadb41 (Use session-shared service to store the user's state)
=======
  private isCzar: boolean = false;
>>>>>>> 8012e0a (Add czar flag to user state service and use it to hide/show buttons in lobby and wdym components)

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
<<<<<<< HEAD
=======
>>>>>>> 8012e0a (Add czar flag to user state service and use it to hide/show buttons in lobby and wdym components)
  setSelfAsCzar() {
    this.isCzar = true;
  }

  turnOffCzarInSelf() {
    this.isCzar = false;
  }

<<<<<<< HEAD
=======
>>>>>>> 0cadb41 (Use session-shared service to store the user's state)
=======
>>>>>>> 8012e0a (Add czar flag to user state service and use it to hide/show buttons in lobby and wdym components)
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
<<<<<<< HEAD
=======
>>>>>>> 8012e0a (Add czar flag to user state service and use it to hide/show buttons in lobby and wdym components)

  getIsCzar(): boolean {
    return this.isCzar;
  }
<<<<<<< HEAD
=======
>>>>>>> 0cadb41 (Use session-shared service to store the user's state)
=======
>>>>>>> 8012e0a (Add czar flag to user state service and use it to hide/show buttons in lobby and wdym components)
}
