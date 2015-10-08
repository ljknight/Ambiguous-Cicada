var router = require('express').Router();

var auth = require('./models/userController');
var utils = require('./lib/utils');
var chat = require('./models/chatController');

var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var googleOAuth = require('./googleoauth');

passport.use(new GoogleStrategy({
  clientID: googleOAuth.clientID,
  clientSecret: googleOAuth.clientSecret,
  callbackURL: 'http://localhost:3000/auth/google/return'
}, function(accessToken, refreshToken, profile, done) {
  done(null, {name: profile.displayName});
}));

passport.serializeUser(function(user, done) {
  done(null, user.name);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

router.use(passport.initialize());

// Authentication Routes
router.get('/auth/google', passport.authenticate('google', {scope: 'openid profile'}));

router.get('/auth/google/return', passport.authenticate('google'), utils.createSession, function(req, res) {
  console.log(req.session);
  res.redirect('/#/oauth');
});

router.get('/auth/google/token', function(req, res) {
  res.json(req.session.user);
});

//***************** Chat routes ****************
//create new chatroom
router.post('/:chatroom/chatroom',function(req,res){
  var chatroomId = req.params.chatroom;
  chat.addChatroom(chatroomId);
});
//add users to chatroom
router.post('/:chatroom/users',function(req,res){
  var username = req.body.username;
  var chatroomId = req.params.chatroom;
  chat.addMesage({username:username,name:chatroomId})
});
//get users from chatroom
router.get('/:chatroom/users',function(req,res){
  var chatroomId = req.params.chatroom;
  chat.getUsersFromChatroom(chatroomId);
});

//create a new message in a chatroom
router.post('/:chatroom/messages', function(req, res) {
  var chatroomId = req.params.chatroom;
  message = {
    username:req.body.username,
    text:req.body.text
  }
  chat.addMesage(chatroomId,message)
});
//get messages from a chatRoom
router.get('/:chatroom/messages', function(req, res) {
  var chatroomId = req.params.chatroom;
  chat.getMessages(chatroomId)
  .then(function(data){
    console.log('got some data back: ',data)
    res.json(data);
  })
});

//************* Authentication Routes **************
router.post('/signup', function(req, res) {
  auth.signup(req.body.username, req.body.password)
  .then(function(result) {
    res.status(201)
    .send(JSON.stringify(result));
  })
  .catch(function(err) {
    console.log(err)
    res.status(300)
    .send(err);
  });
});

router.post('/login', function(req, res) {
  auth.login(req.body.username, req.body.password)
  .then(function(user) {
    req.user = user;
    utils.createSession(req, res, function() {
      res.json(req.session.user);
    });
  })
  .catch(function(err) {
    console.log(err)
    res.status(300)
    .send(err);
  });
});

router.post('/logout', utils.destroySession, function(req, res) {
  res.status(200).end();
});

module.exports = router;