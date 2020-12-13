import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserStateService {

  private username:string;
  private userId: string;
  private lobbyCode: string;
  private isCzar: boolean = false;

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

  setSelfAsCzar() {
    this.isCzar = true;
  }

  turnOffCzarInSelf() {
    this.isCzar = false;
  }

  getUsername(): string {
    return this.username;
  }

  getUserId(): string {
    return this.userId;
  }

  getLobbyCode(): string {
    return this.lobbyCode;
  }

  getIsCzar(): boolean {
    return this.isCzar;
  }
}
