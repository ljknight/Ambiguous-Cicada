var EventEmitter = require('events');
var _ = require('underscore');

var CoordMatcher = require('./coordMatcher');

var maxDist = 5;
var matcher = new CoordMatcher(maxDist);

var pool = new EventEmitter();
pool.storage = [];

pool.add = function(socket) {
  var item = {
    socket: socket,
    coords: socket.request.session.coords
  };
  this.emit('add', item);
};

pool.on('add', function(item) {
  var matched = false;

  _.each(this.storage, function(waiter) {

    if (matcher.isMatch(item.coords, waiter.coords)) {
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
});

pool.remove = function(socket) {
  var index = _.findIndex(this.storage, function(item) {
    return item.socket === socket;
  });
  this.storage.splice(index, 1);
};

module.exports = {
  findOrAwaitMatch: function(socket) {
    pool.add(socket);
  },
  cancelMatch: function(socket) {
    pool.remove(socket);
  }
};
