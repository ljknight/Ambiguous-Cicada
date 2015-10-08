// Basic Server Requirements
var config = require('./config.js');
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var morgan = require('morgan');

var secret = require('./secret.js');

var MongoStore = require('connect-mongo')(session);
var db = require('./db.js');
var User = require('./auth/userModel');
var matchController = require('./match/matchController');

var port = require('./config.js').port;

var express = require('express');

var app = express();

var sessionHandler = session({
  // should make session persist even if server crashes
  store: new MongoStore({ mongooseConnection: db.connection }),
  secret: secret,
  resave: true,
  saveUninitialized: true
});

app.use(morgan('dev'));
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
  var session = socket.request.session;

  console.log('connection', session);

  var address,username;
  //connect user to address if exists on the session
  if (session.user){
    if (session.user.address){
      // socket.join(session.user.address.toString());
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
    username = session.user.name;
    //save new place to session
    session.place = data.place;
    session.save();

    // console.log('joinRoom', session);

    place = session.place;
    //join chat room with the name of the address
    session.room = place;
    socket.join(place.toString());

    console.log(username,' joined room ', place);
  });

  socket.on('rejoinPlace', function() {
    socket.join(session.place);
  });

  socket.on('leavePlace', function(){
    socket.leave(socket.room);
    console.log(username,' left the room ',address);
    //remove address property on session
    delete session.user.place;
  });

  //if client socket emits send message
  socket.on('sendMessage',function(msg){
    console.log('chatting',session);

    // console.log(socket.username,' sending message to room ',socket.chatRoom,' msg: ',msgData.text)
    //broadcast sends to everyone else, but not to self
    //every other socket in the same chatRoom group recieves a 'message event'
    socket.broadcast.to(session.room).emit('chatMessage', msg);
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
