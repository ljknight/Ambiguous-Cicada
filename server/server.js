// Basic Server Requirements
var config = require('./config.js');
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');

var port = require('./config.js').port

var express=require('express')

var app=express()
// express initializes app to be a function handler 
var httpServer = require('http').Server(app);
// app is supplied to http server
var io = require('socket.io')(httpServer);
//config dependencies
var secret = require('./secret.js');

app.use(bodyParser.json());

app.use(session({
  secret: secret,
  resave: true,
  saveUninitialized: true
}));

app.use("/", express.static(__dirname + '/../client-web'));
//new internal dependencies
var router = require('./routes.js');


//***************** Sockets *******************
//listen for connection event for incoming sockets
//store all users that want to find a kwiky
io.on('connection',function(socket){
  console.log('Socket '+ socket.id +' connected.');

  socket.on('joinRoom', function(data){
    var username = data.username;
    var address = data.address;
    //just binding values to socket for convenience
    socket.username = username;
    socket.chatRoom = address.toString();
    //join chat room with the name of the address
    socket.join(socket.chatRoom);
    console.log(socket.username,' joined room ',socket.chatRoom);
  });

  socket.on('leaveRoom', function(){
    socket.leaveRoom(socket.chatRoom);
    console.log(socket.username,' left the room ',socket.chatRoom);
    //remove chatRoom property
    delete socket.chatRoom;
  });

  //if client socket emits send message
  socket.on('sendMessage',function(data){
    //broadcast message to room that socket is part of
    console.log(socket.username,' sending message to room ',socket.chatRoom,' msg: ',data.text)
    //broadcast sends to everyone else, but not to self
    //every other socket in the same chatRoom group recieves a 'message event'
    socket.broadcast.to(socket.chatRoom).emit('chatMessage',data);
  });

  //completely disconnect
  socket.on('disconnect', function(){
    console.log('Socket '+ socket.id +' disconnected.');
    socket.disconnect();
  });
})

// Mount router for api
app.use('/', router);

httpServer.listen(port,function(err){
  if (err){
    console.log('unable to listen ',err)
  } else {
    console.log('listening on port ',port)
  }
});
module.exports = app