var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var cache = require('gulp-cached');
var remember = require('gulp-remember');
var karma = require('karma');

var clientDepPaths = [
  'node_modules/angular/angular.js',
  'node_modules/angular-ui-router/build/angular-ui-router.js',
  'node_modules/socket.io-client/socket.io.js'
];

var clientMinDepPaths = [
  'node_modules/angular/angular.min.js',
  'node_modules/angular-ui-router/build/angular-ui-router.min.js',
  'node_modules/socket.io-client/socket.io.js'
];

gulp.task('karma', function(done) {
  return new karma.Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('build-dev', function() {
  return gulp.src( clientDepPaths.concat( 'client-web/app.js', 'client-web/!(build|tests)/*.js' ) , {base: '.'} )
    .pipe(sourcemaps.init())

    .pipe(concat('build.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('client-web/build/'));
});

gulp.task('build', function() {
  return gulp.src( clientMinDepPaths.concat( 'client-web/app.js', 'client-web/!(build|tests)/*.js' ) , {base: '.'} )
    .pipe(sourcemaps.init())
    .pipe(cache('build'))
    .pipe(uglify())
    .pipe(remember('build'))
    .pipe(concat('build.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('client-web/build/'));
});

gulp.task('watch', ['build'], function() {
  var watcher = gulp.watch(['client-web/app.js', 'client-web/!(build|tests)/*.js'], ['build']);
  watcher.on('change', function(event) {
    if (event.type === 'deleted') {                   // if a file is deleted, forget about it
          delete cached.caches.build[event.path];       // gulp-cached remove api
          remember.forget('build', event.path);         // gulp-remember remove api
        }
  });
});

gulp.task('watch-dev', ['build-dev'], function() {
  var watcher = gulp.watch(['client-web/app.js', 'client-web/!(build|tests)/*.js'], ['build-dev']);
  watcher.on('change', function(event) {
    if (event.type === 'deleted') {                   // if a file is deleted, forget about it
          delete cached.caches.build[event.path];       // gulp-cached remove api
          remember.forget('build', event.path);         // gulp-remember remove api
        }
  });
});