var Chatroom = require('./chatModel.js').Chatroom;
var Message = require('./chatModel.js').Message;
var User = require('./userModel').user

module.exports.addChatroom = function(chatroomId) {
  return Chatroom
  .create({
    name: chatroomId,
    users: [],
    messages: []
  })
  .then(function(data){
    console.log('created Chatroom ',data)
  })
  .catch(function(err) {
    console.log('could not create Chatroom',err)
  });
};

module.exports.addUserToChatroom = function(chatroomId,username) {
  return User
  .findOne({username:username})
  .then(function(user){
    return Chatroom.findOne({chatroomId:chatroomId})
    .then(function(chatroom){
      // if (!chatroom.indexOf('username'){
        chatroom.users.push({user})
        return chatroom.save()
      // } else {
      //   return new Error('user already exists in chatroom')
      // }
    })  
    .catch(function(err){
      console.error(err);
      res.sendStatus(500);
    })
  });
};

module.exports.getUsersFromChatroom = function(chatroomId) {
  return Chatroom
  .findOne({name:chatroomId})
  .then(function(chatroom){
    return chatroom.users
  })
};

module.exports.addMessage = function (chatroomId, message) {
  return Message
  .create(message)
  .then(function(msg) {
    return Chatroom.findOne({name: chatroomId})
  })
  .then(function (chatroom) {
    chatroom.messages.push({message})
    return chatroom.save()
  })
  .catch(function(err){
    console.error(err);
    res.sendStatus(500);
  })
};

module.exports.getMessages = function (chatroomId) {
  return Chatroom
  .findOne({name: chatroomId})
  .then(function(chatroom){
    return chatroom.messages
  })
  // .populate("messages")
  // .exec();
};

