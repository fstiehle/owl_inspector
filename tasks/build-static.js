const gulp = require('gulp'),
  connect = require('gulp-connect')

const DEV_DIR = './gui/src/renderer/static',
  DIST_DIR = './gui/dist'

// Copies assets to the DIST folder
gulp.task('copy-static', () => {
  return gulp.src(DEV_DIR + '/**/*')
    .pipe(gulp.dest(DIST_DIR))
    .pipe(connect.reload())
})