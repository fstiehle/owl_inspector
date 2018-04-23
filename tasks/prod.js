const gulp = require('gulp'), 
  minify = require('gulp-minifier')

const DEV_DIR = './gui/src/renderer',
  DIST_DIR = './gui/dist'

gulp.task('prod-env', (done) => {
  process.env.NODE_ENV = 'production';
  done()
})

gulp.task('minify', () => {
  return gulp.src(DIST_DIR + '/**/*').pipe(minify({
    minify: true,
    collapseWhitespace: true,
    conservativeCollapse: true,
    minifyJS: true,
    minifyCSS: true,
  })).pipe(gulp.dest(DIST_DIR))
})
