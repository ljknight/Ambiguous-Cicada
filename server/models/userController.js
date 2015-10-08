var User = require('./userModel').User;

// signup function that validates, creates new user and returns a promise
module.exports.signup = function(username, password) {
  return User
  .findOne({username: username})
  .then(function(user){
    if (!user){
      return User.create({username: username, password: password}) 
    }
    throw new Error('user already exists')
  })
};

// login function that validates, authenticates and returns a promise
module.exports.login = function(username, password) {
  return User
  .findOne({username: username})
  .then(function(user){
    if (!user) {
      throw new Error('User does not exist');
    }
    return user.comparePasswords(password)
    .then(function(foundUser){
      if (foundUser){
        return user
      }
      throw new Error('Wrong password');
    })
  })
};