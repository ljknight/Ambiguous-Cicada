var config = {

  development: {
    dbpath: 'mongodb://localhost/kwikidev',
    port: 3000,
    api_keys: {
      geocoding: process.env.APIKEY_GEOCODING,
    }
  },

  production: {
    dbpath: process.env.MONGOLAB_URI,
    port: process.env.PORT || 3000,
    api_keys: {
      geocoding: process.env.APIKEY_GEOCODING,
    }
  }

};

// Set current environment here
// Will be set to production by default in Heroku
module.exports = config[process.env.NODE_ENV || 'development'];