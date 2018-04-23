const gulp = require('gulp'),
  connect = require('gulp-connect'),
  sass = require('gulp-sass')

const DEV_DIR = './gui/src/renderer/sass',
  DIST_DIR = './gui/dist/css'

gulp.task('sass', () => {
  return gulp.src(DEV_DIR + '/**/*.scss')
    .pipe(sass({includePaths: [DEV_DIR, 'node_modules']})
    .on('error', sass.logError))
    .pipe(gulp.dest(DIST_DIR))
    .pipe(connect.reload())
})