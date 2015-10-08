var db = require('../db');
var Schema = db.Schema,
    ObjectId = Schema.ObjectId;

var MessageSchema = new Schema({
  username: String,
  text: String,
  timestamp: Date
});

var ChatroomSchema = new Schema({
  place: String,
  users: [{
    id: String,
    username: String,
  }],
  messages: [{
    id: String,
    username: String,
    text: String,
    timestamp: Date
  }]
  // messages: [{
  //   type: ObjectId,
  //   ref: 'messages'
  // }]
});

module.exports.Message = db.model('messages', MessageSchema);
module.exports.Chatroom = db.model('chatrooms', ChatroomSchema);
