var Chatroom = require('./chatModel').Chatroom;
var Message = require('./chatModel').Message;
var User = require('./userModel').User;

module.exports.addChatroom = function(chatroomId) {
  return Chatroom
  .create({name: chatroomId, users: [], messages: []}) 
};

module.exports.addUserToChatroom = function(chatroom,username) {
  return User
  .findOne({username:username})
  .then(function(user){
    chatroom.users.push(user)
    return chatroom.save()
  })  
  .catch(function(err){
    console.error(err);
  })
};

module.exports.getUsersFromChatroom = function(chatroomId) {
  return Chatroom
  .findOne({name:chatroomId})
  .then(function(chatroom){
    return chatroom.users
  })
};

module.exports.addMessage = function (chatroomId, message,username) {
  return Chatroom.findOne({name: chatroomId})
  .then(function (chatroom) {
    chatroom.messages.push({username:username,text:message});
    return chatroom.save();
  })
  .catch(function(err){
    console.error(err);
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

