var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = 3000;
const fetch = require('node-fetch');
const { resolve } = require('path');
const { del } = require('request');
var lobbies = [];

var photo;
const {promisify} = require('util');
const delay = promisify(setTimeout);


/**
 * Socket (player) Properties:
 *  string username;
 *  boolean host;
 *  string[] hand;
 */


const captions = [
    'When you get fucked in your 449 final.',
    'The Comp Sci Lab.',
    'When you are frustrated with your Base Model Macbook Air.',
    'Building your own PC',
    'Remembering you are in Haskayne.',
    'When your recursion works',
    'recursion > loops',
    'Coding in bitwise operations',
    'Trying to understand what your professor is saying',
    'I am dropping out to start an Only Fans.',
    'Oh you know how to write "Hello World" and you call yourself a programmer?',
    'I enjoy long walks to Math Sciences in my free time.',
    'My back hurts from carrying my team so hard.',
    'Who needs sleep when you have coffee.',
    'Coding for 8 hours straight',
    'Giving up on Git because you have been resolving merge conflicts for 4 hours',
    'Keeeping copies of files as version control',
    'When you write a ton of code in one go and spend 8 hours debugging it',
    'Just because it compiles, doesn\'t mean it works',
    'HTML is a language',
    'When someone brags about their friend knowing HTML',
    "C code",
    "Calculating what you need to get on the final to pass the course",
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
    'Counting everything from 0',
    'When your unicard will not scan at math sciences',
    'Linux users',
    'Assembly > Prolog',
    'Academic Misconduct',
    'Closing 12 Stackoverflow tabs after solving the problem',
    'Having 50 tabs open',
    'Coding in EMacs',
    'Preferring Vim over Emacs',
    'Trying to exit Vim',
    'Look at me, I am the scrum master now.',
    'Am I dumb or am I stupid?.',
    'incrementing a loop, x++ versus x -= -1 ',
    'my spaghetti code versus my clean code',
    'git merge --force',
    'writing "Hello World" does not make you a programmer.',
    'Why is my code returning an infinite loop?',
    'Your friends Chegg Account',
    'Fork child, kill parent',
    'Fork children, kill orphans',
    'This task should take you 2 hours.',
    'And that is how you calculate 1+3',
    'Writes 10 lines of code without looking at Google.',
    'You study computer science, can you fix my printer?',
    'I hate LINUX',
    'Voting Linux for best OS',
    'Sorry babe, not tonight, I am coding.',
    'Will my program work if I re-compile?',
    'Will my program work if I restart the computer?',
    'Missing semicolon on line 331',
    'Cannot have any runtime errors if your code does not compile',
    'I hate programming, I hate programming, I love programming! YAY!',
    'Submitting an infinite loop to WebCat',
    'Print Statements are better than a debugger.',
    'The face you make when you get a segmentation fault.',
    'FORK BOMB!',
    'Only friends on social media are parents... gets cyberbullied.',
    'When you try to think recursively.',
    'When you get the same seat you picked in the first class.',
    'Art students.',
    'Needing to do a proof by induction.',
    'When turning it off and on again does not work.',
    'Trying to get that extra percent of test case coverage.',
    'Assignment due date is not until tomorrow night.',
    'Waiting for your program to compile.',
    'When people do not shut up in Zoom chat.',
    'Professor having to go over assignment rules for the fourth time.',
    'Do you need an extension?',
    'When your professor gives a last-minute extension but you already pulled an all-nighter trying to finish the assignment'
];




class User {
    constructor(username) {
        this.username = username;
        this.hand = [];   
        this.score = 0;
        this.czar;
    }
}

class Lobby { 
    constructor(code) {
        this.code = code;
        this.users = [];
        this.captions = Array.from(captions);
        this.captionsRemaining = Array.from(captions); //remaining cards in stack
        this.submittedCards = [];   //cards that have been submitted this round
        this.submittedUsers = [];   //sockets that have submitted; share index with card
        this.turn = 0;
        this.czar;
    }   
}

/**
 * Return the Lobby object by a lobby code
 * return false if it does not exist
 */
function getLobbyByCode(code) {
    for (let i = 0; i < lobbies.length; i++) {
        if (lobbies[i].code === code) return lobbies[i];
    }
    return Boolean(false);
}


io.on('connection', function(socket) {

    //////// CHAT ////////
    let currentUser = new ChatUser();
  console.log(`User connected. Username: ${currentUser.username}; Color: ${currentUser.colorCode}`);
  usersList.push(currentUser);
  filterOnlineUsers();
  let returnObject = new SocketReturnObject(messagesList, "", onlineUsersList, false, false, currentUser.username, "");

  io.emit('join', returnObject);

  socket.on('join', function (cookieUsername) {
    let cookieUserExistsInOnlineUsersList = onlineUsersList.findIndex(user => user.username === cookieUsername);
    let cookieUserExistsInUsersList = usersList.findIndex(user => user.username === cookieUsername);
    if (cookieUserExistsInOnlineUsersList !== -1 && cookieUserExistsInUsersList !== -1) {
      console.log("INFO: Joining user is in both usersList and onlineUsersList.");
      if (cookieUsername === currentUser.username) {
        console.log("\tCurrent user's username is the same as cookie username. All is well.");
      }
      else {
        console.log("\tCurrent user's username is NOT the same as cookie username.");
        console.log("\tAssume cookie is corrent and rejoin user.");  
        currentUser = rejoinUserWithClone(cookieUsername, currentUser);
        console.log("Updated current user:");
        console.log(currentUser);
      }
    }
    else if (cookieUserExistsInUsersList !== -1 && cookieUserExistsInOnlineUsersList === -1) {
      console.log("INFO: User is in usersList but not in onlineUsersList. It's a rejoining user.");
      currentUser = rejoinUser(cookieUsername, currentUser);
      console.log("Updated current user:");
      console.log(currentUser);
    }
    else {
      console.log("WARNING: Something werid with the username stored in the client's cookie.");
    }
  });

  
  // 'chat message' is an event from this particular connected client
  socket.on('message', function(message, username){
    let currentUsername = username;
    let newUsername = "";
    let returnMessage = message;
    let returnColorCode = "";
    let nameChanged = false;
    let colorChanged = false;
    let now = new Date();
    let timestamp = now.getFullYear() + "-" + now.getMonth() + "-" + now.getDate() + " "+ now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();

    let user = onlineUsersList.find(user => user.username === username);
    if (user === undefined) {
      console.log("Not able to find user in online users list. User probably needs to rejoin.....");
      return;
    }
    returnColorCode = user.colorCode;
    
    checkMessageObject = checkMessage(message);
    if (checkMessageObject.newMessage === EMPTY_MESSAGE) {
      returnMessage = "";
    }
    else if (checkMessageObject.newMessage) {
      returnMessage = checkMessageObject.newMessage;
    }
    if (checkMessageObject.newName) {
      newUsername = checkMessageObject.newName;
      user.username = checkMessageObject.newName;
      nameChanged = true;
    }
    if (checkMessageObject.newColor) {
      returnColorCode = checkMessageObject.newColor; // Note: Command messages don't get sent to the chat log
      user.colorCode = checkMessageObject.newColor;
      colorChanged = true;
    }
    if (checkMessageObject.errorMessage) {
      console.log(checkMessageObject.errorMessage); // Log it for debugging purpposes.
    }
    
    if (returnMessage) {
      let newMessage = new Message(currentUsername, returnMessage, returnColorCode, timestamp);
      messagesList.unshift(newMessage);
    }
    if (messagesList.length === 201) {
      messagesList.pop();
    }

    let returnObject = new SocketReturnObject(messagesList, checkMessageObject.errorMessage, 
      onlineUsersList, nameChanged, colorChanged, currentUsername, newUsername);

    // could use either io.emit() or socket.broadcast.emit()
    //     io.emit will publish to everyone, including the client that published the message
    //     socket.broadcast.emit will publish to everyone but the client that published the message
    io.emit('message', returnObject);
  });

  socket.on('disconnect', () => {
    console.log("User disconnected. Username: " + currentUser.username);
    //clearInterval(pollingIntervalId);
    currentUser.setOffline();
    onlineUsersList = usersList.slice(); //  copy array
    filterOutOfflineUsers(onlineUsersList);
    io.emit('leave', onlineUsersList);
  });

  /////// CHAT END ////////

    //create a lobby with the code supplied
    socket.on('createLobby', function(code) {
        socket.join(code);              //join new room specified by code   
        let lobby = new Lobby(code);    //create the lobby
        lobbies.push(lobby);            
    });

    //Add a user to a lobby by code
    socket.on('addUser', function(username, lobbyCode) {
        if (getLobbyByCode(lobbyCode) != false) {   //make sure lobby exists
            socket.join(lobbyCode);         
            let lobby = getLobbyByCode(lobbyCode);
            //first user to join is host
            if (lobby.users.length === 0) {
                socket.host = true;   
                socket.czar = true;
            }
            else socket.host = false;
            socket.username = username;       
            let user = new User(username);
            if (lobby.users.length === 0 ) {
                lobby.czar = user;
                user.czar = true;
            }
            lobby.users.push(user);

        }
    });

    //get the scores of all users in a lobby
    //returns in array of [username, score] pairs
    socket.on('getScores', function(lobbyCode) {
        var tempLobby = getLobbyByCode(lobbyCode);
        var scores = [];
        if (tempLobby != false) {
            for (let i = 0; i < tempLobby.users.length; i++) {
                var user = tempLobby.users[i];
                scores.push([user.username, user.score]);
            }
        }   
        io.sockets.in(lobbyCode).emit('receiveScores', scores);
    });

    //get all users in a lobby
    socket.on('getUsers', function(lobbyCode) {
        console.log("called getusers with lobby " + lobbyCode);
        var tempLobby = getLobbyByCode(lobbyCode);
        var tempUsers=[];
        if (tempLobby != false) {
            for (let i = 0; i < tempLobby.users.length; i++) {
                tempUsers.push(tempLobby.users[i].username);
            }
        }   
        io.sockets.in(lobbyCode).emit('receiveUsers', tempUsers);
    });

    //leave a lobby
    socket.on('leaveLobby', function(username, lobbyCode) {
        console.log(username + ' leaving lobby: ' + lobbyCode);
        var tempLobby = getLobbyByCode(lobbyCode);
        removeUser(lobbyCode, username);
        socket.leave(lobbyCode);
    });
    
    //check if lobby is exists
    socket.on('isValidLobby', function(lobbyCode) {
        if (getLobbyByCode(lobbyCode) != false) {
            console.log('lobby ' + lobbyCode + ' exists');
            socket.emit('receiveValidLobby', true);
        }
        else {
            console.log("lobby: " + lobbyCode + " doesn't exist");
            socket.emit('receiveValidLobby', false);
        }
    });

    //start game
    socket.on('startGame', function(lobbyCode) {
        io.sockets.in(lobbyCode).emit('getStartGame');
    });

    //get a new meme image
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

    //get the hand of socket that called it
    socket.on('callHand', (lobbyCode) => {
        socket.hand = getHand(lobbyCode);
        socket.emit("returnHand", socket.hand);

    });

    //start turn for a lobby
    socket.on('startTurn', (lobbyCode) => {
        tempLobby = getLobbyByCode(lobbyCode);
        if (tempLobby != false) tempLobby.submittedCards = [];
        //get host and put in hotseat
        io.of('/').in(lobbyCode).clients((error, clients) => {
            if (error) throw error;
            for (client in clients) {
                var current = io.sockets.connected[clients[client]];
                if (current.czar === true) {
                    current.emit('returnCzar', '');
                    break;
                }   
            }
        });
    });

    socket.on('checkWinner', (lobbyCode) => {
        
        tempLobby = getLobbyByCode(lobbyCode); 
        if (tempLobby != false) {
            for (user in tempLobby.users) {
                if (tempLobby.users[user].score >= 3) { //user has 5 cards
                    console.log(tempLobby.users[user].username + " has won!");
                    io.sockets.in(lobbyCode).emit('returnGameWinner', tempLobby.users[user].username);
                } 
            }
        }
    });

    //});   
    
    socket.on('getHost', (lobbyCode) => {

    });
    
    /**
     * submit a card to the hot seat for judging
     */
    socket.on('submitCard', (lobbyCode, card) => {    

        tempLobby = getLobbyByCode(lobbyCode);
        if (tempLobby != false) {
            tempLobby.submittedCards.push(card);       
            tempLobby.submittedUsers.push(socket);  
                
            //if everyone except hotSeat user has submitted a poggers meme
            if (tempLobby.submittedCards.length === (tempLobby.users.length - 1)) {
                //search room to find czar 
                io.of('/').in(lobbyCode).clients((error, clients) => {
                    if (error) throw error;
                    for (client in clients) {
                        var current = io.sockets.connected[clients[client]];
                        if (current.czar === true) {
                            //return submitted cards to czar only
                            current.emit("returnSubmittedCards", getSubmittedCards(lobbyCode));
                            tempLobby.submittedCards = []; //clear submitted cards for next turn
                            break;
                        }   
                    }
                });
            }
        }
    }); 


    //choose the winner for a given round
    socket.on('chooseWinner', (index, lobbyCode) => {
        
        tempLobby = getLobbyByCode(lobbyCode); 
        if (tempLobby != false) {
            let winner = tempLobby.submittedUsers[index];

        //update winner's score
            for (user in tempLobby.users) {
                if (tempLobby.users[user].username === winner.username) {
                    tempLobby.users[user].score++;
                }
            }

            io.sockets.in(lobbyCode).emit('returnRoundWinner', winner.username);
            tempLobby.submittedUsers = [];  //clear submittedUsers
        }
        
    });

    socket.on('winCaption', (caption, lobbyCode) => {
        io.sockets.in(lobbyCode).emit('returnRoundCaption', caption);
    });

   

    socket.on('getNextCzar', (lobbyCode) => {
        tempLobby = getLobbyByCode(lobbyCode);

        if (tempLobby != false) {
            //set czar to next user
            for (let i = 0; i < tempLobby.users.length; i++) {
                var currentUser = tempLobby.users[i];

                if (currentUser.czar === true) {
                    currentUser.czar = false;
                    if (i === tempLobby.users.length - 1) {
                        tempLobby.users[0].czar = true;
                        tempLobby.czar = tempLobby.users[0];
                    }
                    else { 
                        tempLobby.users[i+1].czar = true;
                        tempLobby.czar = tempLobby.users[i+1];
                    }
                    break;
                }
            }

        
            
            //emit message to set new czar
            io.of('/').in(lobbyCode).clients((error, clients) => {
                if (error) throw error;
                for (client in clients) {
                    var current = io.sockets.connected[clients[client]];
                    if (current.czar === true) current.czar = false;
                    if (current.username === tempLobby.czar.username) {
                        current.czar = true;
                        current.emit('returnCzar', '');
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
    if (tempLobby != false) {
        for (let i = 0; i < tempLobby.users.length; i++) {
            if (tempLobby.users[i].username === username) {
                tempLobby.users.splice(i, 1);
                break;
            }
        }
    }
}

/**
 * return one card available in the card pile
 * 
 */
function getCard(lobbyCode) {
    var tempLobby = getLobbyByCode(lobbyCode);
    if (tempLobby != false) {
        var randomIndex = Math.floor(Math.random() * (tempLobby.captionsRemaining.length));
        var caption = tempLobby.captionsRemaining[randomIndex];
        tempLobby.captionsRemaining.splice(randomIndex, 1);
    }
    return caption;
}

/**
 * return one entire hand of cards from the card pile
 * 
 */
function getHand(lobbyCode) {
    var tempLobby = getLobbyByCode(lobbyCode);
    if (tempLobby != false) {
        hand = [];
        for (let i = 0; i < 5; i ++) { 
            //TO-DO: handle TypeError: Cannot read property 'length of undefined'
            var randomCaption = Math.floor(Math.random() * (tempLobby.captionsRemaining.length));
            hand.push(tempLobby.captionsRemaining[randomCaption]);
            tempLobby.captionsRemaining.splice(randomCaption, 1);
        }
    }   
    else hand = null;
    return hand;
}


function getSubmittedCards(lobbyCode) {
    var tempLobby = getLobbyByCode(lobbyCode);
    return tempLobby.submittedCards;
}


///////////////////// CHAT /////////////////////////////
const { time } = require('console');
var randomWords = require('random-words');

let colors = ["aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige", "bisque", "black", "blanchedalmond", "blue", "blueviolet", "brown", "burlywood", "cadetblue", "chartreuse", "chocolate", "coral", "cornflowerblue", "cornsilk", "crimson", "cyan", "darkblue", "darkcyan", "darkgoldenrod", "darkgray", "darkgreen", "darkkhaki", "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgray", "dodgerblue", "firebrick", "floralwhite", "forestgreen", "fuchsia", "gainsboro", "ghostwhite", "gold", "goldenrod", "gray", "green", "greenyellow", "honeydew", "hotpink", "indianred", "indigo", "ivory", "khaki", "lavender", "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral", "lightcyan", "lightgoldenrodyellow", "lightgrey", "lightgreen", "lightpink", "lightsalmon", "lightseagreen", "lightskyblue", "lightslategray", "lightsteelblue", "lightyellow", "lime", "limegreen", "linen", "magenta", "maroon", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "mediumturquoise", "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin", "navajowhite", "navy", "oldlace", "olive", "olivedrab", "orange", "orangered", "orchid", "palegoldenrod", "palegreen", "paleturquoise", "palevioletred", "papayawhip", "peachpuff", "peru", "pink", "plum", "powderblue", "purple", "red", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "seashell", "sienna", "silver", "skyblue", "slateblue", "slategray", "snow", "springgreen", "steelblue", "tan", "teal", "thistle", "tomato", "turquoise", "violet", "wheat", "white", "whitesmoke", "yellow", "yellowgreen"];
const EMPTY_MESSAGE = "EMPTY";

class Message {
  constructor( username, message, colorCode, timestamp ) {
    this.username = username;
    this.message = message;
    this.colorCode = colorCode;
    this.timestamp = timestamp;
  }
}

class ChatUser {
  constructor() {
    this.username = this.generateUsername();
    this.isOnline = true;
    this.colorCode = this.getRandomColor();
  }

  generateUsername() {
    let wordsArr = randomWords(2);
    let username = wordsArr[0] + "-" + wordsArr[1];
    return username;
  }

  // from https://stackoverflow.com/questions/1484506/random-color-generator
  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  setOffline() {
    this.isOnline = false;
  }
  setOnline() {
    this.isOnline = true;
  }
  
  clone() {
    let newUser = new ChatUser();
    newUser.username = this.username;
    newUser.colorCode = this.colorCode;
    newUser.isOnline = this.isOnline;
    return newUser;
  }
}

class SocketReturnObject {
  constructor(messages, errorMessage, users, nameChanged, colorChanged, currentUserName, newName) {
    this.messages = messages;
    this.errorMessage = errorMessage;
    this.users = users;
    this.nameChanged = nameChanged;
    this.colorChanged = colorChanged;
    this.currentUserName = currentUserName;
    this.newName = newName;
  }
}


// Modifies the passed in array
function filterOutOfflineUsers(users) {
  let nextIndexToRemove = users.findIndex(element => element.isOnline === false);
  while(nextIndexToRemove != -1) {
    users.splice(nextIndexToRemove, 1);
    nextIndexToRemove = users.findIndex(element => element.isOnline === false);
  } 
}

function filterOnlineUsers() {
  onlineUsersList = usersList.slice(0, usersList.length); // copy array
  filterOutOfflineUsers(onlineUsersList);
}

function removeOnlineUser(userRm) {
  let currentUserOnlineUsersListIndex = onlineUsersList.findIndex((user) => user.username === userRm.username);
  if (currentUserOnlineUsersListIndex !== -1) {
    console.log(`INFO: Found extra user ${userRm.username} : ${currentUserOnlineUsersListIndex}. Removing from Online User List`);
    let user = onlineUsersList[currentUserOnlineUsersListIndex];
    user.setOffline();
    onlineUsersList.splice(currentUserOnlineUsersListIndex, 1);
  }
}

function removeUser(userRm) {
  let currentUserUserListIndex = usersList.findIndex((user) => user.username === userRm.username);
  if (currentUserUserListIndex !== -1) {
    console.log(`INFO: Found extra user ${userRm.username} : ${currentUserUserListIndex}. Removing from User List`);
    usersList.splice(currentUserUserListIndex, 1);
  }
  removeOnlineUser(userRm);
}

function searchAndReplaceEmojis(emojiReplaceMessage) {
  if (emojiReplaceMessage.indexOf(":)") !== -1) {
    emojiReplaceMessage = emojiReplaceMessage.replace(/:\)/g, "😊");
  }
  if (emojiReplaceMessage.indexOf(":D") !== -1) {
    emojiReplaceMessage = emojiReplaceMessage.replace(/:D/g, "😃");
  }
  if (emojiReplaceMessage.indexOf(":P") !== -1) {
    emojiReplaceMessage = emojiReplaceMessage.replace(/:P/g, "😝");
  }
  if (emojiReplaceMessage.indexOf("<3") !== -1) {
    emojiReplaceMessage = emojiReplaceMessage.replace(/<3/g, "❤️");
  }
  if (emojiReplaceMessage.indexOf(":(") !== -1) {
    emojiReplaceMessage = emojiReplaceMessage.replace(/:\(/g, "🙁");
  }
  if (emojiReplaceMessage.indexOf(":/") !== -1) {
    emojiReplaceMessage = emojiReplaceMessage.replace(/:\//g, "😕");
  }
  if (emojiReplaceMessage.indexOf(":*") !== -1) {
    emojiReplaceMessage = emojiReplaceMessage.replace(/:\*/g, "😘");
  }
  if (emojiReplaceMessage.indexOf("8)") !== -1) {
    emojiReplaceMessage = emojiReplaceMessage.replace(/8\)/g, "🤓");
  }
  if (emojiReplaceMessage.indexOf(";)") !== -1) {
    emojiReplaceMessage = emojiReplaceMessage.replace(/;\)/g, "😉");
  }
  if (emojiReplaceMessage.indexOf(":O") !== -1) {
    emojiReplaceMessage = emojiReplaceMessage.replace(/:O/g, "😮");
  }
  return emojiReplaceMessage;
}

function checkMessage(messageText) {
  let returnObject = {newName: "", newColor: "", errorMessage: "", newMessage: ""};
  let nameCommandIndex = messageText.indexOf("/name");
  if (nameCommandIndex !== -1) {
    let newName = messageText.slice(nameCommandIndex+5).trim();
    if (newName.indexOf("/name") !== -1) {
      //console.log("The new name had more name commands in it! Getting rid of the rest of the string.");
      newName = newName.slice(0, newName.indexOf("/name")).trim();
      returnObject.errorMessage += "You cannot use multiple /name commands at the same time.\n";
    }
    let nameSplit = newName.split(" ");
    if (nameSplit.length !== 1) {
      newName = nameSplit[0];
      returnObject.errorMessage += "You cannot have a space in your name.\n";
    }
    returnObject.newName = newName;
    returnObject.newMessage = EMPTY_MESSAGE;
  }

  let colorCommandIndex = messageText.indexOf("/color");
  if (colorCommandIndex !== -1) {
    let newColor = messageText.slice(colorCommandIndex+6).trim();
    if (newColor.indexOf("/color") !== -1) {
      newColor = newColor.slice(0, newColor.indexOf("/color")).trim();
      returnObject.errorMessage += "You cannot use multiple /color commands at the same time.\n";
    }
    if (!colors.includes(newColor)) {
      newColor = "";
      returnObject.errorMessage += "You have selected an unsupported color. Please use a color name from the list of CSS Color Names.\n";
    }
    returnObject.newColor = newColor;
    returnObject.newMessage = EMPTY_MESSAGE;
  }

  if (messageText.indexOf("<script>") !== -1) {
    returnObject.newMessage = EMPTY_MESSAGE;
    returnObject.errorMessage += "Attack thwarted!";
  }
  
  if (returnObject.newMessage !== EMPTY_MESSAGE) {
    let emojiReplaceMessage = messageText;
    returnObject.newMessage = searchAndReplaceEmojis(emojiReplaceMessage);
  }

  return returnObject;
}

function rejoinUser(username, currentUser) {
  let newCurrentUser = usersList.find( (user) => username === user.username );
  if (newCurrentUser !== undefined) {
    console.log(`currentUser.username = ${currentUser.username}`);
    removeUser(currentUser);
    currentUser = newCurrentUser;
    currentUser.setOnline();
    filterOnlineUsers();
    console.log("Updated Online Users list:");
    console.log(onlineUsersList);
    console.log("\n");
    io.emit('rejoin', onlineUsersList);
    return newCurrentUser;
  }
  else {
    console.log("WARNING: could not find rejoining user in the users list.");
    return currentUser;
  }
}

function rejoinUserWithClone(username, currentUser) {
  let newCurrentUser = usersList.find( (user) => username === user.username );
  let cloneNewCurrentUser = newCurrentUser.clone();
  if (newCurrentUser !== undefined) {
    console.log(`currentUser.username = ${currentUser.username}`);
    removeUser(currentUser);
    cloneNewCurrentUser.setOnline(); //shouldn't need this...
    onlineUsersList.push(cloneNewCurrentUser);
    usersList.push(cloneNewCurrentUser);
    filterOnlineUsers();
    console.log("Updated Online Users list:");
    console.log(onlineUsersList);
    console.log("\n");
    io.emit('rejoin', onlineUsersList);
    return cloneNewCurrentUser;
  }
  else {
    console.log("WARNING: could not find rejoining user in the users list.");
    return currentUser;
  }
}

let usersList = [];
let onlineUsersList;
let messagesList = [];


// connection and disconnect are default events from socket.io
// socket is an object that will represent the client that connected
// io.on('connection', function(socket){
// });


http.listen(port, () => {
    console.log(`listening on port:${port}`);
});
