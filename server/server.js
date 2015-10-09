// Basic Server Requirements
var config = require('./config.js');
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var socketSession = require('express-socket.io-session');
var morgan = require('morgan');

var MongoStore = require('connect-mongo')(session);
var db = require('./db.js');

var secret = require('./secret.js');

var port = require('./config.js').port;

var app = express();
app.use(morgan('dev'));
var sessionHandler = session({
  // should make session persist even if server crashes
  store: new MongoStore({ mongooseConnection: db.connection }),
  secret: secret,
  resave: true,
  saveUninitialized: true
});

app.use(bodyParser.json());
app.use(sessionHandler);

// express initializes app to be a function handler 
var httpServer = require('http').Server(app);
// app is supplied to http server
var io = require('socket.io')(httpServer);
//config dependencies

app.use("/", express.static(__dirname + '/../client-web'));
//new internal dependencies
var router = require('./routes.js');

//mount middleware to io request, now we have access to socket.handshake.session
io.use(socketSession(sessionHandler, {
  autoSave: true
}));

//***************** Sockets *******************
//listen for connection event for incoming sockets
//store all users that want to find a kwiky
io.on('connection', require('./sockets.js'));

// Mount router for api
app.use('/', router);

httpServer.listen(port,function(err){
  if (err){
    console.log('unable to listen ',err);
  } else {
    console.log('listening on port ',port);
  }
});

module.exports = app;
