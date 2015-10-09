var _ = require('underscore');

var isMatch = require('./coordMatcher').isMatch;

var pool = {};
pool.storage = [];

pool.add = function(socket, radius) {
  console.log('Socket finding match...');
  console.log(socket.handshake.session);
  var item = {
    socket: socket,
    coords: socket.handshake.session.coords,
    radius: radius
  };

  var matched = false;

  _.each(this.storage, function(waiter) {

    if (isMatch(item, waiter)) {

      matched = true;
      var newRoom = item.socket.id + waiter.socket.id;
      console.log('found match: ', item.socket.handshake.session.user.name, waiter.socket.handshake.session.user.name);
      console.log('new room ID: ', newRoom);

      item.socket.join(newRoom);
      item.socket.handshake.session.room = newRoom;
      item.socket.emit('found');

      waiter.socket.join(newRoom);
      waiter.socket.handshake.session.room = newRoom;
      waiter.socket.emit('found');

      this.remove(waiter.socket);

    }

  }.bind(this));

  if (!matched) {
    this.storage.push(item);
  }

};

pool.remove = function(socket) {
  var index = _.findIndex(this.storage, function(item) {
    return item.socket === socket;
  });
  this.storage.splice(index, 1);
};

module.exports = {
  findOrAwaitMatch: function(socket, radius) {
    pool.add(socket, radius);
  },
  cancelMatch: function(socket) {
    pool.remove(socket);
  }
};
