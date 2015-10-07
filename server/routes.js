var router = require('express').Router();

var auth = require('./auth/auth');
var utils = require('./lib/utils');

// Authentication Routes
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
    utils.createSession(req, res, user, function() {
      res.status(200).send(user);
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