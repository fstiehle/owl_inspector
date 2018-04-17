const gulp = require('gulp'),
  browserify = require('browserify'),
  babelify = require('babelify'),
  source = require('vinyl-source-stream'),
  gutil = require('gulp-util'),
  connect = require('gulp-connect'),
  sass = require('gulp-sass'),
  minify = require('gulp-minifier'),
  runSequence = require('run-sequence');

const DEV_DIR = 'gui/src',
  DIST_DIR = 'gui/dist';

// Gulp tasks
// ----------------------------------------------------------------------------
gulp.task('dev-scripts', function () {
  return bundleApp(true);
});

gulp.task('prod-env', function () {
  process.env.NODE_ENV = 'production';
});

gulp.task('prod-scripts', function () {
  return bundleApp(false);
});

gulp.task('webserver', function () {
  connect.server({
    port: 8080,
    host: 'localhost',
    root: DIST_DIR,
    livereload: true
  });
});

// Watches for changes in the DEV_DIR
gulp.task('watch', () => {
  gulp.watch([DEV_DIR + '/**/*'], ['dev-scripts', 'copy-static', 'sass']);
});

// Copies assets to the DIST folder
gulp.task('copy-static', function () {
  return gulp.src(DEV_DIR + '/static/**/*')
    .pipe(gulp.dest(DIST_DIR))
    .pipe(connect.reload());
});

// Run 'minify' for final shipable code
gulp.task('minify', function () {
  return gulp.src(DIST_DIR + '/**/*').pipe(minify({
    minify: true,
    collapseWhitespace: true,
    conservativeCollapse: true,
    minifyJS: true,
    minifyCSS: true,
  })).pipe(gulp.dest(DIST_DIR));
});

// sass
gulp.task('sass', function () {
  return gulp.src(DEV_DIR + '/sass/**/*.scss')
    .pipe(sass({includePaths: ['/sass/', 'node_modules']})
    .on('error', sass.logError))
    .pipe(gulp.dest(DIST_DIR + '/css/'))
    .pipe(connect.reload());
});

// Run this for the final build
// Run 'minify' before the code is shiped
gulp.task('build', function (cb) {
  runSequence('prod-env', ['prod-scripts', 'copy-static', 'sass'], 'minify', cb);
});

// Aliase
gulp.task('default', ['serve']);
gulp.task('run', ['serve']);

// When running 'gulp' on the terminal this task will fire.
// It will start watching for changes in every .js file.
// If there's a change, the task 'watch' defined above will fire.
gulp.task('serve', ['dev-scripts',
  'copy-static',
  'sass',
  'webserver',
  'watch']);

// Private Functions
// ----------------------------------------------------------------------------
function bundleApp(_debug) {
  // Browserify will bundle all our js files together in to one
  const bundler = browserify({
    entries: DEV_DIR + '/app.jsx',
    debug: _debug
  })
  // transform ES6 and JSX to ES5 with babelify	
  .transform("babelify", { presets: ["env", "react"] })

  return bundler
    .bundle()
    .on('error', gutil.log)
    .pipe(source('bundle.js'))
    .pipe(gulp.dest(DIST_DIR + '/js'))
    .pipe(connect.reload());
}