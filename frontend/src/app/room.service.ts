import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(private socket: Socket) { }

    sendAddUser(username: String, code: String) {
      return this.socket.emit("addUser", username, code);
    }
      
    createLobby(code: String) {
      return this.socket.emit('createLobby', code);
    }

    getUsers(code: String) {
      this.socket.emit('getUsers', code);
    }
    
    receiveUsers() {
      return this.socket.fromEvent('receiveUsers');
    }

    leaveLobby(username: string, code: string) {
      return this.socket.emit('leaveLobby', username, code);
    }
  
}
