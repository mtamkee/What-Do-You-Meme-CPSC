var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = 3000;

var lobbies = [];
var users = [];





class User {
    constructor(username) {
        this.username = username;        
    }
    hand = [];
}

class Lobby { 
    constructor(code) {
        this.code = code;
    }
    users = [];
}


function getLobbyByCode(code) {
    for (let i = 0; i < lobbies.length; i++) {
        if (lobbies[i].code === code) return lobbies[i];
    }
    return false;
}


io.on('connection', function(socket) {

    console.log('user connected');
    socket.on('createLobby', function(code) {
        socket.join(code);  //join new room specified by code
        let lobby = new Lobby(code);
        lobbies.push(lobby);
        console.log("lobby: " + code + " has been created");
    });

    socket.on('addUser', function(username, lobbyCode) {
        socket.join(lobbyCode); 
        let user = new User(username);
        users.push(user);
        let lobby = getLobbyByCode(lobbyCode);
        lobby.users.push(user);
    });

    socket.on('getUsers', function(lobbyCode) {
        console.log("called getusers with lobby " + lobbyCode);
        var tempLobby = getLobbyByCode(lobbyCode);
        var tempUsers=[];
        
        if (tempLobby){
            for (let i = 0; i < tempLobby.users.length; i++) {
                console.log(tempLobby.users[i].username);
                tempUsers.push(tempLobby.users[i].username);
            }
        }   
        //io.emit('receiveUsers', tempUsers);
        io.sockets.in(lobbyCode).emit('receiveUsers', tempUsers);
    });

    socket.on('leaveLobby', function(username, lobbyCode) {
        console.log(username + ' leaving lobby: ' + lobbyCode);
        var tempLobby = getLobbyByCode(lobbyCode);
        removeUser(lobbyCode, username);
        socket.leave(lobbyCode);
    })
});


/**
 *  remove a user from a lobby 
 *  Note: this relies on the assumption that there are no duplicate users in the lobby via name;
 */
function removeUser(lobbyCode, username) {
    var tempLobby = getLobbyByCode(lobbyCode);
    console.log(tempLobby.users.length);

    for (let i = 0; i < tempLobby.users.length; i++) {
        console.log(tempLobby.users[i].username);
        if (tempLobby.users[i].username === username) {

            console.log('lobby size before: ' + tempLobby.users.length);
            tempLobby.users.splice(i, 1);
            console.log('lobby size after: ' + tempLobby.users.length);

            break;
        }
    }
    
}



http.listen(port, () => {
    console.log(`listening on port:${port}`);
});


