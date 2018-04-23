const gulp = require('gulp'),
  browserify = require('browserify'),
  browserify_css = require("browserify-css"),
  babelify = require('babelify'),
  source = require('vinyl-source-stream'),
  gutil = require('gulp-util'),
  connect = require('gulp-connect'),
  sass = require('gulp-sass'),
  minify = require('gulp-minifier'),
  rename = require('gulp-rename'),
  es = require('event-stream'),
  del = require('del')

const DEV_DIR = './gui/src/renderer',
  DIST_DIR = './gui/dist'

// Gulp tasks
// ----------------------------------------------------------------------------
gulp.task('dev-scripts', () => {
  return bundleApp(true);
})

gulp.task('prod-env', (done) => {
  process.env.NODE_ENV = 'production';
  done()
})

gulp.task('prod-scripts', () => {
  return bundleApp(false)
})

gulp.task('clean', () => {
  return del([DIST_DIR + '/**/*'])
})

gulp.task('webserver', (done) => {
  connect.server({
    port: 8080,
    host: 'localhost',
    root: DIST_DIR,
    livereload: true
  })
  done()
})

// Watches for changes in the DEV_DIR
gulp.task('watch', (done) => {
  gulp.watch([DEV_DIR + '/static/**/*'], gulp.task('copy-static'))
  gulp.watch([DEV_DIR + '/**/*.jsx', DEV_DIR + '/**/*.js'], gulp.task('dev-scripts'))
  gulp.watch([DEV_DIR + '/sass/**/*.sass'], gulp.task( 'sass'))
  done()
})

// Copies assets to the DIST folder
gulp.task('copy-static', () => {
  return gulp.src(DEV_DIR + '/static/**/*')
    .pipe(gulp.dest(DIST_DIR))
    .pipe(connect.reload())
})

// Run 'minify' for final shipable code
gulp.task('minify', () => {
  return gulp.src(DIST_DIR + '/**/*').pipe(minify({
    minify: true,
    collapseWhitespace: true,
    conservativeCollapse: true,
    minifyJS: true,
    minifyCSS: true,
  })).pipe(gulp.dest(DIST_DIR))
})

// sass
gulp.task('sass', () => {
  return gulp.src(DEV_DIR + '/sass/**/*.scss')
    .pipe(sass({includePaths: [DEV_DIR + '/sass/']})
    .on('error', sass.logError))
    .pipe(gulp.dest(DIST_DIR + '/css/'))
    .pipe(connect.reload())
})

// Run this for the final build
gulp.task('build', gulp.series('prod-env',
  gulp.parallel('prod-scripts', 'copy-static', 'sass'), 'minify'))

// Aliase
gulp.task('default', (done) => {
  gulp.task('build')
  done()
})

// When running 'gulp' on the terminal this task will fire.
// It will start watching for changes in every .js file.
// If there's a change, the task 'watch' defined above will fire.
gulp.task('serve', gulp.parallel('dev-scripts',
  'copy-static',
  'sass',
  'webserver',
  'watch'))

// Private Functions
// ----------------------------------------------------------------------------
function bundleApp(_debug) {

  const files = [
    DEV_DIR + '/renderer.jsx'
  ]
  
  const tasks = files.map((entry) => {
    return browserify({ 
      entries: [entry],
      debug: _debug 
    })

    .transform("babelify", { 
      presets: ["env", "react"],
      sourceMaps: true })
    .transform({global: true}, "browserify-css")
    .bundle()
    .on('error', gutil.log)
    .pipe(source(entry))
    // rename them to have "bundle as postfix"
    .pipe(rename({
        dirname: '',
        extname: '.bundle.js'
    }))
  })

    // create a merged stream
  return es.merge.apply(null, tasks)
  .pipe(gulp.dest(DIST_DIR))
  .pipe(connect.reload())
}