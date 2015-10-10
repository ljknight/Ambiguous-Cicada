var router = require('express').Router();

var auth = require('./models/userController');
var utils = require('./lib/utils');
var chat = require('./models/chatController');

var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

//setup process env 
if (process.env.NODE_ENV){
	var clientID = process.env.clientID;
	var clientSecret = process.env.clientSecret;
} else {
	var googleoauth = require('./googleoauth');
	var clientID = googleoauth.clientID;
	var clientSecret = googleoauth.clientSecret;
}
passport.use(new GoogleStrategy({
  clientID: clientID,
  clientSecret: clientSecret,
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

router.get('/auth/google/return', passport.authenticate('google'), /*utils.createSession,*/ function(req, res) {
  res.redirect('/#/oauth');
});

router.get('/auth/google/token', function(req, res) {
  res.send(req.session.passport.user);
});

//************* Authentication Routes **************
// router.post('/signup', function(req, res) {
//   auth.signup(req.body.username, req.body.password)
//   .then(function(result) {
//     res.status(201)
//     .send(JSON.stringify(result));
//   })
//   .catch(function(err) {
//     console.log(err)
//     res.status(300)
//     .send(err);
//   });
// });

// router.post('/login', function(req, res) {
//   auth.login(req.body.username, req.body.password)
//   .then(function(user) {
//     req.user = user;
//     utils.createSession(req, res, function() {
//       res.json(req.session.user);
//     });
//   })
//   .catch(function(err) {
//     console.log(err)
//     res.status(300)
//     .send(err);
//   });
// });

// router.post('/logout', utils.destroySession, function(req, res) {
//   res.status(200).end();
// });

module.exports = router;
