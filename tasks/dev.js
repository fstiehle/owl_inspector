const gulp = require('gulp'),
  connect = require('gulp-connect'),
  del = require('del')

const DEV_DIR = './gui/src/renderer',
  DIST_DIR = './gui/dist'

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
  gulp.watch([DEV_DIR + '/sass/**/*.scss'], gulp.task( 'sass'))
  done()
})