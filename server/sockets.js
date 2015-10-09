var auth = require('./models/userController');
var utils = require('./lib/utils');
var chat = require('./models/chatController');

module.exports = function(socket) {
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
};
