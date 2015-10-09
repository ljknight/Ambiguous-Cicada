var auth = require('./models/userController');
var utils = require('./lib/utils');
var chat = require('./models/chatController');
var matchController = require('./match/matchController');

module.exports = function(socket) {
  var place,username;
  //connect user to place if exists on the session
  console.log('socket connected \n place: ',socket.request.session.placeName,"\n user: ", socket.request.session.user)

  if (socket.request.session.user){
    if (socket.request.session.place){
      chat.getMessages(socket.request.session.place)
      .then(function(messages){
        socket.emit('populateChat',{messages:messages,placeName:socket.request.session.placeName});
      })
      socket.join(socket.request.session.place.toString());
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
        socket.request.session.user = user;
        // TODO: maybe use the username from the returned user from database?
        socket.emit('loginSuccess', {token: user, name: data.username});
      })
      .catch(function(err) {
        console.log(err);
        socket.emit('error', {err: err});
      });
  });

  socket.on('logout', function(data) {
    socket.request.session.regenerate(function(err) {
      if (err) {
        socket.emit('error', {err: err});
      } else {
        socket.emit('logoutSuccess');
      }
    });
  });

  socket.on('setPosition', function(data) {
    console.log('setting position: ', data)
    socket.request.session.coords = data;
    // socket.requeset.session.save();
  });

  socket.on('feelingLucky', function(data) {
    matchController.findOrAwaitMatch(socket, data.radius);
  });

  socket.on('cancelLucky', function() {
    matchController.cancelMatch(socket);
  });

  socket.on('leaveLuckyRoom', function() {
    socket.leave(socket.request.session.room);
  });

  socket.on('joinPlace', function(data){
    //save new place to session
    // console.log(session)
    socket.request.session.place = data.place;
    socket.request.session.placeName = data.placeName;
    socket.request.session.save();
    // console.log('place',session.place)
    //**** create new chatroom *****
    chat.addChatroom(socket.request.session.place, socket.request.session.placeName)
    .then(function(chatroom){
      return chat.addUserToChatroom(chatroom, socket.request.session.user.name)
    })
    .then(function(chatroom){
      // console.log('saved: ',chatroom)
      return chat
      .getMessages(socket.request.session.place)
      .then(function(messages){
        console.log('messages', messages);
        socket.emit('populateChat', messages);
      })
    })
    //join chat room with the name of the address
    socket.request.session.room = place;
    socket.join(socket.request.session.place.toString());
    console.log(socket.request.session.user.name,' joined room: ', socket.request.session.placeName)
  });

  socket.on('rejoinPlace', function() {
    socket.join(socket.request.session.place);
  });

  socket.on('leavePlace', function(){
    socket.leave(socket.request.session.place);
    console.log(username,' left the room ',socket.request.session.placeName);
    //remove address property on session
    delete socket.request.session.place;
  });

  //if client socket emits send message
  socket.on('sendMessage',function(msg){
      console.log(socket.request.session.user.name, ' sent a message to: ', socket.request.session.room);

    // console.log('sended message: ',msg)
    if (socket.request.session.room === socket.request.session.place) {
      // console.log(session.user.name,' sent message \n to room : ',session.place)
      chat.addMessage(socket.request.session.place,msg, socket.request.session.user.name)
      .then(function(chatroom){
        console.log('message saved: ', chatroom);
      });
    }
    //broadcast sends to everyone else, but not to self
    //every other socket in the same chatRoom group recieves a 'message event'
    socket.broadcast.to(socket.request.session.room).emit('chatMessage', {text:msg, username: socket.request.session.user.name});
  });

  //completely disconnect
  socket.on('disconnect', function(){
    console.log('Socket '+ socket.id +' disconnected.');
    socket.disconnect();
  });
};
