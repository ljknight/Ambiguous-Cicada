var db = require('../db');
var Schema = db.Schema,
    ObjectId = Schema.ObjectId;

var MessageSchema = new Schema({
  username: String,
  text: String,
  timestamp: {type:Date,default:Date.now}
});

var ChatroomSchema = new Schema({
  place: String,
  placeName: String,
  users: [{
    id: String,
    username: String,
  }],
  messages: [{
    id: String,
    username: String,
    text: String,
    timestamp: {type:Date,default:Date.now}
  }]
  // messages: [{
  //   type: ObjectId,
  //   ref: 'messages'
  // }]
});

module.exports.Message = db.model('messages', MessageSchema);
module.exports.Chatroom = db.model('chatrooms', ChatroomSchema);
