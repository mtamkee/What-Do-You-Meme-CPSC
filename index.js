var express = require('express');
var app = express();
var http = require('http').Server(app);
var port = 3000;



app.use('/', (req, res) => {
    res.sendFile(__dirname + '/frontend/src/index.html');
});


http.listen(port, function(){
    
    console.log('listening on *:' + port);

});
