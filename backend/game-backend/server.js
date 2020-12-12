var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = 3000;
const fetch = require('node-fetch');
const { resolve } = require('path');
const { del } = require('request');
var lobbies = [];
var users = [];
var photo;
const {promisify} = require('util');
const delay = promisify(setTimeout);



/**
 * Socket (player) Properties:
 *  string username;
 *  boolean host;
 *  string[] hand;
 * 
 */


const captions = [
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
    'When you get a merge conflict.',
    'Copying code from stackoverflow',
    'null pointer exception',
    'When you hit compile and it works the first time',
    'When someone merges spaghetti code ',
    'When the project manager wants to use C',
    '3 billion devices run java',
    'Array indexes should start at 1',
    'When your unicard will not scan at math sciences ',
    'linux users',    
    'Assembly > Prolog',
    'Academic Misconduct',
    'Closing 12 Stackoverflow tabs after solving the problem',
    'Coding in EMacs',
    'Look at me, I am the scrum master now.',
    'Am I dumb or am I stupid?.',
    'incrementing a loop, x++ versus x -= -1 ',
    'my spaghetti code versus my clean code',
    'git merge --force',
    'writing "Hello World" does not make you a programmer.',
    'Why is my code returning an infinite loop?',
    'Your friends Chegg Account',
    'Fork child, kill parent',
    'This task should take you 2 hours.',
    'And that is how you calculate 1+3',
    'Writes 10 lines of code without looking at Google.',
    'You study computer science, can you fix my printer?',
    'I hate LINUX',
    'Sorry babe, not tonight, I am coding.',
    'Will my program work if I re-compile?',
    'Missing semicolon in line 331',
    'Cannot have any runtime errors if your code does not compile',
    'I hate programming, I hate programming, I love programming! YAY!',
    'Submitting an infinite loop to WebCat',
    'Print Statements are better than a debugger.'
];

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
        this.captions = Array.from(captions);
        this.captionsRemaining = Array.from(captions);
        this.submittedCards = [];
        this.turn = 0;
    }        
}

function getLobbyByCode(code) {
    for (let i = 0; i < lobbies.length; i++) {
        if (lobbies[i].code === code) return lobbies[i];
    }
    return Boolean(false);
}

io.on('connection', function(socket) {
    console.log('user connected');
    socket.on('createLobby', function(code) {
       // socket.host = true; //

        socket.join(code);  //join new room specified by code
        let lobby = new Lobby(code);
        lobbies.push(lobby);
        console.log("lobby: " + code + " has been created");


    });

    socket.on('addUser', function(username, lobbyCode) {

        if (getLobbyByCode(lobbyCode) != false) {
            socket.join(lobbyCode); 
            //first user to join is host
            let lobby = getLobbyByCode(lobbyCode);
            if (lobby.users.length === 0) socket.host = true;
            else socket.host = false;
            socket.username = username;

            let user = new User(username);
            users.push(user);
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

    //replaces one card by index for a single user 
    socket.on('replaceCard', (lobbyCode, index) => {
        socket.hand[index] = getCard(lobbyCode);
        socket.emit('returnHand', socket.hand);
    });

    
    //call a random image from the api
    async function fetchImage(lobbyCode) {
        var num = Math.floor(Math.random() * (99+1));
        const img = await fetch('https://api.imgflip.com/get_memes').then(res => res.json()).catch(err => console.error(err));
        const { memes } = await img.data;
        await io.sockets.in(lobbyCode).emit('returnImage', memes[num].url);
    };

    socket.on('callHand', (lobbyCode) => {
        socket.hand = getHand(lobbyCode);
        socket.emit("returnHand", socket.hand);
        /*
        console.log("captions remaining in lobby: " + lobbyCode + " " + getLobbyByCode(lobbyCode).captionsRemaining.length);
        io.of('/').in(lobbyCode).clients((error, clients) => {
            if (error) throw error;
            for (client in clients) {
                var current = io.sockets.connected[clients[client]];
                current.hand = getHand(lobbyCode);
                current.emit("returnHand", current.hand);
            }
        });*/

    });

    socket.on('startTurn', (lobbyCode) => {
        tempLobby = getLobbyByCode(lobbyCode);
        tempLobby.submittedCards = [];
        //get host and put in hotseat
        io.of('/').in(lobbyCode).clients((error, clients) => {
            if (error) throw error;
            for (client in clients) {
                var current = io.sockets.connected[clients[client]];
                if (current.host === true) {
                    current.emit('returnHost', '');
                    break;

                }   
            }
        });

    });
    
    socket.on('submitCard', (lobbyCode, card) => {    

        tempLobby = getLobbyByCode(lobbyCode);
        tempLobby.submittedCards.push(card);

        //if everyone except hotSeat user has submitted a poggers meme
        if (tempLobby.submittedCards.length === (tempLobby.users.length - 1)) {
            //TO-DO: add hotseat user to lobby class to get it less stupidly  
            
            //search room to find user that is in the hotseat 
            io.of('/').in(lobbyCode).clients((error, clients) => {
                if (error) throw error;
                for (client in clients) {
                    var current = io.sockets.connected[clients[client]];
                    if (current.host === true) {

                        current.emit("returnSubmittedCards", getSubmittedCards(lobbyCode));
                        tempLobby.submittedCards = []; //clear submitted cards for next turn
                        break;

                    }   
                }
            });
        }

    }); 

    
    socket.on('getSubmittedCards', (lobbyCode) => {
        
    }); 

    /**
     * don't think these two functions are used currently
     */
    socket.on('callCard', (lobbyCode) => {
        //var randomCaption = Math.floor(Math.random() * (captions.length));
      //  getCard(lobbyCode);
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

/**
 * return one card available in the card pile
 * 
 */
function getCard(lobbyCode) {
    var tempLobby = getLobbyByCode(lobbyCode);
    var randomIndex = Math.floor(Math.random() * (tempLobby.captionsRemaining.length));
    var caption = tempLobby.captionsRemaining[randomIndex];
    tempLobby.captionsRemaining.splice(randomIndex, 1);
    return caption;
}
/**
 * return one entire hand of cards from the card pile
 * 
 */
function getHand(lobbyCode) {
    var tempLobby = getLobbyByCode(lobbyCode);
    hand = [];
    for (let i = 0; i < 5; i ++) { 
        var randomCaption = Math.floor(Math.random() * (tempLobby.captionsRemaining.length));
        hand.push(tempLobby.captionsRemaining[randomCaption]);
        tempLobby.captionsRemaining.splice(randomCaption, 1);
    }
    return hand;
}


function getSubmittedCards(lobbyCode) {
    var tempLobby = getLobbyByCode(lobbyCode);
    return tempLobby.submittedCards;
}

http.listen(port, () => {
    console.log(`listening on port:${port}`);
});
