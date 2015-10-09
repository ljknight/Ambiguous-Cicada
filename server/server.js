// Basic Server Requirements
var config = require('./config.js');
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var morgan = require('morgan');
var chat = require('./models/chatController');

var MongoStore = require('connect-mongo')(session);
var db = require('./db.js')

var secret = require('./secret.js');

var MongoStore = require('connect-mongo')(session);
var db = require('./db.js');
var matchController = require('./match/matchController');

var port = require('./config.js').port;

var express = require('express');

var app = express();
app.use(morgan('dev'));
var sessionHandler = session({
  // should make session persist even if server crashes
  store: new MongoStore({ mongooseConnection: db.connection }),
  secret: secret,
  resave: true,
  saveUninitialized: true
});

app.use(bodyParser.json());
app.use(sessionHandler);

// express initializes app to be a function handler 
var httpServer = require('http').Server(app);
// app is supplied to http server
var io = require('socket.io')(httpServer);
//config dependencies

app.use("/", express.static(__dirname + '/../client-web'));
//new internal dependencies
var router = require('./routes.js');

//mount middleware to io request, now we have access to socket.request.session
io.use(function(socket,next){
  sessionHandler(socket.request, socket.request.res, next)
});

//***************** Sockets *******************
//listen for connection event for incoming sockets
//store all users that want to find a kwiky
io.on('connection',function(socket){
  var session  = socket.request.session
  var place,username;
  //connect user to place if exists on the session
  console.log('socket connected \n place: ',session.place,"\n user: ",session.user)

  if (session.user){
    if (session.place){
      chat.getMessages(session.place)
      .then(function(messages){
        socket.emit('populateChat',messages);
      })
      socket.join(session.place.toString());
    }
  }

  socket.on('setPosition', function(data) {
    console.log('setting position: ', data)
    session.coords = data;
    session.save();
  });

  socket.on('feelingLucky', function(data) {
    matchController.findOrAwaitMatch(socket, data.radius);
  });

  socket.on('cancelLucky', function() {
    matchController.cancelMatch(socket);
  });

  socket.on('leaveLuckyRoom', function() {
    socket.leave(session.room);
  });

  socket.on('joinPlace', function(data){
    //save new place to session
    // console.log(session)
    session.place = data.place;
    session.save();
    // console.log('place',session.place)
    //**** create new chatroom *****
    chat.addChatroom(session.place)
    .then(function(chatroom){
      return chat.addUserToChatroom(chatroom,session.user.name)
    })
    .then(function(chatroom){
      // console.log('saved: ',chatroom)
      return chat
      .getMessages(session.place)
      .then(function(messages){
        console.log('messages',messages)
        socket.emit('populateChat',messages)
      })
    })
    //join chat room with the name of the address
    session.room = place;
    socket.join(session.place.toString());
    console.log(session.user.name,' joined a room place: ',session.place)
  });

  socket.on('rejoinPlace', function() {
    socket.join(session.place);
  });

  socket.on('leavePlace', function(){
    socket.leave(socket.room);
    console.log(username,' left the room ',session.place);
    //remove address property on session
    delete session.place;
  });

  //if client socket emits send message
  socket.on('sendMessage',function(msg){
      console.log(session.user.name,' sent a message to: ',session.place)

    // console.log('sended message: ',msg)
    // if (session.room === session.place){
      // console.log(session.user.name,' sent message \n to room : ',session.place)
      chat.addMessage(session.place,msg,session.user.name)
      .then(function(chatroom){
        console.log('message saved: ',chatroom)
      })      
    // }
    //broadcast sends to everyone else, but not to self
    //every other socket in the same chatRoom group recieves a 'message event'
    socket.broadcast.to(session.place).emit('chatMessage', {text:msg,username:session.user.name});
  });

  //completely disconnect
  socket.on('disconnect', function(){
    console.log('Socket '+ socket.id +' disconnected.');
    socket.disconnect();
  });
});

// Mount router for api
app.use('/', router);

httpServer.listen(port,function(err){
  if (err){
    console.log('unable to listen ',err);
  } else {
    console.log('listening on port ',port);
  }
});

module.exports = app;
