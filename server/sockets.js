var auth = require('./models/userController');
var utils = require('./lib/utils');
var chat = require('./models/chatController');
var matchController = require('./match/matchController');

module.exports = function(socket) {
  var place,username;
  //connect user to place if exists on the session
  // console.log('socket connected \n place: ',socket.handshake.session.placeName,"\n user: ", socket.handshake.session.user)
  console.log('socket connected\n session: ', socket.handshake.session);

  if (socket.handshake.session.user){
    if (socket.handshake.session.place){
      chat.getMessages(socket.handshake.session.place)
      .then(function(messages){
        socket.emit('populateChat',{messages:messages,placeName:socket.handshake.session.placeName});
      });
      socket.join(socket.handshake.session.place);
    }
  }

  socket.on('signup', function(data) {
    auth.signup(data.username, data.password)
      .then(function(result) {
        socket.emit('signupSuccess', result);
      })
      .catch(function(err) {
        socket.emit('error', {err: err});
      });
  });

  socket.on('login', function(data) {
    auth.login(data.username, data.password)
      .then(function(user) {
        console.log('setting user on session...');
        console.log(user);
        socket.handshake.session.user = user;
        console.log(socket.handshake.session);
        // TODO: maybe use the username from the returned user from database?
        socket.emit('loginSuccess', {token: user, name: data.username});
      })
      .catch(function(err) {
        console.log(err);
        socket.emit('error', {err: err});
      });
  });

  socket.on('logout', function(data) {
    if (!socket.handshake.session.user) {
      // socket.emit('error', {err: new Error('No user logged in!')});
    }
    delete socket.handshake.session.user;
    socket.emit('logoutSuccess');
  });

  socket.on('setPosition', function(data) {
    console.log('setting position: ', data);
    socket.handshake.session.coords = data;
  });

  socket.on('feelingLucky', function(data) {
    matchController.findOrAwaitMatch(socket, data.radius);
  });

  socket.on('cancelLucky', function() {
    matchController.cancelMatch(socket);
  });

  socket.on('leaveRoom', function() {
    socket.leave(socket.handshake.session.room);
    delete socket.handshake.session.room;
  });

  socket.on('joinPlace', function(data){
    //save new place to session
    // console.log(session)
    socket.handshake.session.place = data.place;
    socket.handshake.session.placeName = data.placeName;
    // console.log('place',session.place)
    //**** create new chatroom *****
    chat.addChatroom(data)
    .then(function(chatroom) {
      return chat.addUserToChatroom(chatroom, socket.handshake.session.user.name);
    })
    .then(function(chatroom) {
      // console.log('saved: ',chatroom)
      return chat
      .getMessages(socket.handshake.session.place)
      .then(function(messages) {
        console.log('messages', messages);
        socket.emit('populateChat', {messages:messages,placeName:socket.handshake.session.placeName});
      });
    });
    //join chat room with the name of the address
    socket.handshake.session.room = data.place;
    socket.join(socket.handshake.session.room);
    console.log(socket.handshake.session.user.name,' joined room: ', socket.handshake.session.placeName);
  });

  // socket.on('rejoinPlace', function() {
  //   socket.join(socket.handshake.session.place);
  // });

  // socket.on('leavePlace', function(){
  //   socket.leave(socket.handshake.session.room);
  //   console.log(username,' left the room ',socket.handshake.session.placeName);
  //   //remove address property on session
  //   delete socket.handshake.session.room;
  //   delete socket.handshake.session.place;
  // });

  //if client socket emits send message
  socket.on('sendMessage',function(msg){
      console.log(socket.handshake.session.user.name, ' sent a message to: ', socket.handshake.session.room);

    // console.log('sended message: ',msg)
    if (socket.handshake.session.room === socket.handshake.session.place) {
      // console.log(session.user.name,' sent message \n to room : ',session.place)
      chat.addMessage(socket.handshake.session.place,msg, socket.handshake.session.user.name)
      .then(function(chatroom){
        console.log('message saved: ', chatroom);
      });
    }
    //broadcast sends to everyone else, but not to self
    //every other socket in the same chatRoom group recieves a 'message event'
    socket.broadcast.to(socket.handshake.session.room).emit('chatMessage', {text:msg, username: socket.handshake.session.user.name});
  });

  //completely disconnect
  socket.on('disconnect', function(){
    console.log('Socket '+ socket.id +' disconnected.');
    // socket.disconnect();
  });
};
