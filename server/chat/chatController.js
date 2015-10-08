var Chatroom = require('./chatModel.js').Chatroom;
var Message = require('./chatModel.js').Message;


module.exports.addChatroom = function(chatroomId) {
  Chatroom.create({
    users: [],
    messages: []
  }, function(err, chatroom) {
    if(err){
      console.log('could not create Chatroom',err)
    } else {

    }
    
  });
};

module.exports.addUserToChatroom = function(users) {
  users.forEach(function(user) {
    user.join(chatroom._id);
  });
  usersDbObj = users.map(function(user) {
    return {
      id: user.id,
      name: user.name
    };
  });

  usersDbObj = users.map(function(user) {
    return {
      id: user.id,
      name: user.name
    };
  });

  Chatroom.create({
    users: usersDbObj,
    messages: []
  }, function(err, chatroom) {
    if(err){
      throw new Error(err);
    }
    users.forEach(function(user) {
      user.join(chatroom._id);
    });
  });
};

module.exports.getUsersFromChatroom = function(users) {
  usersDbObj = users.map(function(user) {
    return {
      id: user.id,
      name: user.name
    };
  });

  Chatroom.create({
    users: usersDbObj,
    messages: []
  }, function(err, chatroom) {
    if(err){
      throw new Error(err);
    }
    users.forEach(function(user) {
      user.join(chatroom._id);
    });
  });
};

module.exports.addMessage = function (chatroomId, message) {
  Message.create(message).then(function(msg) {
    console.log('created msg: ',msg);
    Chatroom.findOne({_id: chatroomId}, function (err, chatroom) {
      if (err) {
        console.error('chatroom not found: ',err);
      }
      var messages = chatroom.messages;
      messages.push(msg._id);
      Chatroom.findOneAndUpdate({ _id: chatroomId }, { messages: messages })
      .exec();
    });
  });
};

module.exports.getMessages = function (chatroomId) {
  return Chatroom
  .findOne({_id: chatroomId})
  .populate("messages")
  .exec();
};

