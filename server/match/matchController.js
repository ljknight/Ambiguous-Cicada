var _ = require('underscore');

var isMatch = require('./coordMatcher').isMatch;

var pool = {};
pool.storage = [];

pool.add = function(socket, radius) {
  var item = {
    socket: socket,
    coords: socket.request.session.coords,
    radius: radius
  };

  var matched = false;

  _.each(this.storage, function(waiter) {

    if (isMatch(item, waiter)) {
      console.log('found match: ', item.socket.request.session.user.name, waiter.socket.request.session.user.name);

      matched = true;
      var newRoom = item.socket.id + waiter.socket.id;

      item.socket.join(newRoom);
      item.socket.request.session.room = newRoom;
      item.socket.emit('found');

      waiter.socket.join(newRoom);
      waiter.socket.request.session.room = newRoom;
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
