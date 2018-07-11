const gulp = require('gulp'),
  requireDir = require('require-dir')

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
requireDir('./tasks')

// Run this for the final build
gulp.task('build', gulp.series('prod-env',
  gulp.parallel('prod-scripts', 'copy-static', 'sass'), 'minify'))

gulp.task('default', gulp.task('build'))

gulp.task('run', gulp.series('build', 'webserver'))

// Run this for development
gulp.task('serve', gulp.parallel('dev-scripts',
  'copy-static',
  'sass',
  'webserver',
  'watch'
))