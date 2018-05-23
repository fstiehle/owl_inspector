const gulp = require('gulp'),
  browserify = require('browserify'),
  browserify_css = require("browserify-css"),
  babelify = require('babelify'),
  source = require('vinyl-source-stream'),
  gutil = require('gulp-util'),
  connect = require('gulp-connect'),
  rename = require('gulp-rename'),
  es = require('event-stream')

const DEV_DIR = './gui/src/renderer',
  DIST_DIR = './gui/dist'

gulp.task('dev-scripts', () => {
  return bundleApp(true);
})

gulp.task('prod-scripts', () => {
  return bundleApp(false)
})

/**
 * Builds the JavaScript files
 * @param {boolean} _debug 
 */
const bundleApp = (_debug) => {
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
      sourceMaps: true
    })
    
    // for npm modules which import css in javascript
    .transform("browserify-css", {
      global: true,
      output: DIST_DIR + '/css/vendor.css'
    })

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