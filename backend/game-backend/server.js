var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = 3000;
const fetch = require('node-fetch');
var lobbies = [];
var users = [];
var photo;




class User {
    constructor(username) {
        this.username = username;
        this.hand = [];   
    }
    
}

class Lobby { 
    constructor(code) {
        this.code = code;
        this.users = [];
    }
}


function getLobbyByCode(code) {
    for (let i = 0; i < lobbies.length; i++) {
        if (lobbies[i].code === code) return lobbies[i];
    }
    return Boolean(false);
}

let captions = [
    'When you get fucked in your 449 final.',
    'The Comp Sci Lab.',
    'When you are frustrated with your Base Model Macbook Air.',
    'Remembering you are in Haskayne.',
    'I am dropping out to start an Only Fans.',
    'Oh you know how to write "Hello World" and you call yourself a programmer?',
    'I enojoy long walks to Math Sciences in my free time.',
    'My back hurts from carrying my team so hard.',
    'Who needs sleep when you have coffee.',
    'HTML is a language',
    'When your girlfriend brags about her friend knowing HTML',
    'Having a teammate as useless as a chromebook',
    'When you find out there is going to be a peer review.',
    'Merged right to Main and caused an Error.',
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
    'Academic Misconduct'
]

io.on('connection', function(socket) {

    console.log('user connected');
    socket.on('createLobby', function(code) {
        socket.join(code);  //join new room specified by code
        let lobby = new Lobby(code);
        lobbies.push(lobby);
        console.log("lobby: " + code + " has been created");
    });

    socket.on('addUser', function(username, lobbyCode) {
        if (getLobbyByCode(lobbyCode) != false) {
            socket.join(lobbyCode); 
            let user = new User(username);
            users.push(user);
            let lobby = getLobbyByCode(lobbyCode);
            lobby.users.push(user);
        }
       
    });

    socket.on('getUsers', function(lobbyCode) {
        console.log("called getusers with lobby " + lobbyCode);
        var tempLobby = getLobbyByCode(lobbyCode);
        var tempUsers=[];
        
        if (tempLobby) {
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
    });

    socket.on('isValidLobby', function(lobbyCode) {
        console.log("searching for lobby: " + lobbyCode);
        if (getLobbyByCode(lobbyCode) != false) {
            console.log('lobby ' + lobbyCode + ' exists');
            socket.emit('receiveValidLobby', true);
        }
        else {
            console.log("lobby: " + lobbyCode + " doesn't exist");
            socket.emit('receiveValidLobby', false);
        }
    });

    socket.on('startGame', function(lobbyCode) {
        io.sockets.in(lobbyCode).emit('getStartGame');
    });

    socket.on('callImage', function (lobbyCode) {
        fetchImage(lobbyCode);
    });

    //socket.on('')
    async function fetchImage(lobbyCode) {
        var num = Math.floor(Math.random() * (99+1));
        const img = await fetch('https://api.imgflip.com/get_memes').then(res => res.json()).catch(err => console.error(err))
        const { memes } = await img.data
        await io.sockets.in(lobbyCode).emit('returnImage', memes[num].url);
    };

    
    socket.on('callCard', (lobbyCode) => {
        var randomCaption = Math.floor(Math.random() * (captions.length));
        io.emit("returnCard", captions[randomCaption]);
    });
    socket.on('callCard1', (lobbyCode) => {
        var randomCaption = Math.floor(Math.random() * (captions.length));
        io.emit("returnCard1", captions[randomCaption]);
    });

});



/**
 *  remove a user from a lobby 
 *  Note: this relies on the assumption that there are no duplicate users in the lobby by name;
 */
function removeUser(lobbyCode, username) {
    var tempLobby = getLobbyByCode(lobbyCode);
    console.log(tempLobby.users.length);
    
    for (let i = 0; i < tempLobby.users.length; i++) {
        console.log(tempLobby.users[i].username);
        if (tempLobby.users[i].username === username) {
            tempLobby.users.splice(i, 1);
            break;
        }
    }

    
}

http.listen(port, () => {
    console.log(`listening on port:${port}`);
});


