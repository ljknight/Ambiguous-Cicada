var router = require('express').Router();

var auth = require('./auth/auth');
var utils = require('./lib/utils');

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

router.post('/signup', function(req, res) {
  auth.signup(req.body.username, req.body.password)
  .then(function(result) {
    res.status(201)
    .send(result);
  })
  .catch(function(err) {
    res.status(300)
    .send(err);
  });
});

router.post('/login', function(req, res) {
  auth.login(req.body.username, req.body.password)
  .then(function(user) {
    req.user = user;
    utils.createSession(req, res, function() {
      res.status(200).send(req.session.user);
    });
  })
  .catch(function(err) {
    res.status(300)
    .send(err);
  });
});

router.post('/logout', utils.destroySession, function(req, res) {
  res.status(200).end();
});

module.exports = router;