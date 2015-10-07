var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
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
  return gulp.src( clientDepPaths.concat( 'client-web/!(build|tests)/*.js' ) , {base: '.'} )
    .pipe(sourcemaps.init())
    .pipe(concat('build.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('client-web/build/'));
});

gulp.task('build', function() {
  return gulp.src( clientMinDepPaths.concat( 'client-web/!(build|tests)/*.js' ) , {base: '.'} )
    .pipe(sourcemaps.init())
    .pipe(concat('build.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('client-web/build/'));
});