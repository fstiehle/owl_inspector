const gulp = require('gulp'),
  requireDir = require('require-dir')

requireDir('./tasks')

gulp.task('default', gulp.task('build'))

// Run this for the final build
gulp.task('build', gulp.series('prod-env',
  gulp.parallel('prod-scripts', 'copy-static', 'sass'), 'minify'))

// Run this for development
gulp.task('serve', gulp.parallel('dev-scripts',
  'copy-static',
  'sass',
  'webserver',
  'watch'
))