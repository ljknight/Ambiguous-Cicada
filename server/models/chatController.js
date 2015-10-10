var Chatroom = require('./chatModel').Chatroom;
var Message = require('./chatModel').Message;
var User = require('./userModel').User;

module.exports.addChatroom = function(data) {
  return Chatroom
  .findOne({place:data.place})
  .then(function(chatroom){
    if (chatroom){
      console.log('chatroom already exists');
      return chatroom;
    }
    return Chatroom.create({place: data.place,placeName: data.placeName, users: [], messages: []});
  });
};

module.exports.addUserToChatroom = function(chatroom,username) {
  return User
  .findOne({username:username})
  .then(function(user){
    chatroom.users.push(user);
    return chatroom.save();
  })  
  .catch(function(err){
    console.error(err);
  });
};

module.exports.getUsersFromChatroom = function(place) {
  return Chatroom
  .findOne({place:place})
  .then(function(chatroom){
    if (chatroom){
      return chatroom.users;
    }
    throw new Error("could not find room");
  });
};

module.exports.addMessage = function (place, message,username) {
  return Chatroom.findOne({place: place})
  .then(function (chatroom) {
    if (chatroom){
      console.log("found chatroom");
      chatroom.messages.push({username:username,text:message,date:new Date()});
      return chatroom.save();      
    }
    throw new Error("could not find chatroom");
  })
  .catch(function(err){
    console.error(err);
  });
};

module.exports.getMessages = function (place) {
  return Chatroom
  .findOne({place: place})
  .then(function(chatroom){
    if (chatroom){
      return chatroom.messages.slice(0, 25);
    }
    throw new Error("could not find chatroom");
  });
  // .populate("messages")
  // .exec();
};

