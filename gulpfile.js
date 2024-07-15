const gulp = require('gulp');
const htmltidy = require('gulp-htmltidy');
const autoprefixer = require('gulp-autoprefixer');
const csslint = require('gulp-csslint');

gulp.task('default', ['html', 'css']);

gulp.task('html', () => gulp.src('index.html')
  .pipe(htmltidy())
  .pipe(gulp.dest('build')));

gulp.task('css', () => gulp.src('style.css')
  .pipe(csslint())
  .pipe(csslint.formatter('compact'))
  .pipe(autoprefixer({
    browsers: ['last 5 versions'],
    cascade: false,
  }))
  .pipe(gulp.dest('build')));