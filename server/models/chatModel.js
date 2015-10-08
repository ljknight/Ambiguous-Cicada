var db = require('../db');
var Schema = db.Schema,
    ObjectId = Schema.ObjectId;

var MessageSchema = new Schema({
  username: String,
  text: String,
  timestamp: Date
});

var ChatroomSchema = new Schema({
  name: String,
  users: [{
    id: String,
    name: String,
  }],
  messages: [{
    type: ObjectId,
    ref: 'messages'
  }]
});

module.exports.Message = db.model('messages', MessageSchema);
module.exports.Chatroom = db.model('chatrooms', ChatroomSchema);
