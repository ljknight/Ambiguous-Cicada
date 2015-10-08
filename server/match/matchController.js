var CoordMatcher = require('./coordMatcher');
var Backbone = require('backbone');

var maxDist = 5;
var matcher = new CoordMatcher(maxDist);

// User model will intake {socket: socket, data: socket.request.session.user}
var User = Backbone.Model.extend({});

var luckyUsers = new Backbone.Collection({ model: User });

// Every time a user is added to the collection of users seeking matches,
// we check all the waiting users to see if they're within the max distance
luckyUsers.on('add', function(userOne) {
  this.each(function(userTwo) {
    if (matcher.isMatch(userOne.data.coords, userTwo.data.coords)) {
      // If we have a match, the newer user joins the default room
      // of the waiting user. Both sockets receive a 'found' event to
      // navigate the clients to the chat view.
      var newRoom = userOne.socket.id + userTwo.socket.id;
      // Join the new room and record its ID on the socket to leave it later.
      userOne.socket.join(newRoom);
      userOne.socket.session.luckyRoom = newRoom;

      userTwo.socket.join(newRoom);
      userTwo.socket.session.luckyRoom = newRoom;

      userOne.socket.emit('found');
      userTwo.socket.emit('found');
      // Remove the models from the waiting pool
      this.remove([userOne, userTwo]);
    }
  });
});

module.exports = {
  findOrAwaitMatch: function(socket) {
    luckyUsers.add({socket: socket, data: socket.request.session.user});
  },
  cancelMatch: function(socket) {
    luckyUsers.remove(luckyUsers.where({socket: socket}));
  }
};
