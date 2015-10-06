
module.exports = function (config) {
  'use strict';
  console.log("setting config");
  config.set({

    basePath: '',

    frameworks: ['mocha', 'chai', 'sinon',],

    files: [
      'client/lib/angular/angular.js',
      'client/lib/angular-route/angular-route.js',
      'client/lib/angular-mocks/angular-mocks.js',
      'client/*.js',
      'client/tests/*Test.js',
      'server/test/*-spec.js'
    ],

    reporters: ['progress', 'coverage'],

    port: 9876,
    colors: true,
    autoWatch: true,
    singleRun: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    browsers: ['PhantomJS'],

    preprocessors: {
      'server/*.js': 'coverage',
      'server/lib/*.js': 'coverage',
      'server/env/*.js': 'coverage',
      'client/*.js': 'coverage'
    },

    coverageReporter: {
      type: 'html',
      dir: 'results/coverage/'
    }
  });
};
