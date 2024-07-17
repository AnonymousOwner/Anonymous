/*const gulp = require('gulp');
const htmltidy = require('gulp-htmltidy');
const autoprefixer = require('gulp-autoprefixer');
const csslint = require('gulp-csslint');

gulp.task('default', ['html', 'css']);

gulp.task('html', () => gulp.src('src/index.html')
  .pipe(htmltidy())
  .pipe(gulp.dest('build')));

gulp.task('css', () => gulp.src('src/style.css')
  .pipe(csslint())
  .pipe(csslint.formatter('compact'))
  .pipe(autoprefixer({
    browsers: ['last 5 versions'],
    cascade: false,
  }))
  .pipe(gulp.dest('build')));*/
  const gulp = require('gulp');
  const clean = require('gulp-clean');
  const htmlmin = require('html-minifier-terser').minify;
  const cssnano = require('gulp-cssnano');
  const uglify = require('gulp-uglify');
  const concat = require('gulp-concat');
  const sourcemaps = require('gulp-sourcemaps');
  const ghPages = require('gh-pages');
  const path = require('path');
  
  const paths = {
    html: './*.html',
    css: './css/**/*.css',
    js: './js/ahab/**/*.js',
    img: './img/**/*',
    docsImg: './documentation/img/**/*',
    docsJs: './documentation/js/jquery/jquery-ui-1.13.0.custom/**/*',
    legalTexts: './Legal Texts/**/*'
  };
  
  gulp.task('clean', function () {
    return gulp.src('dist', { allowEmpty: true, read: false })
      .pipe(clean());
  });
  
  gulp.task('html', function () {
    return gulp.src(paths.html)
      .pipe(htmlmin({ collapseWhitespace: true }))
      .on('data', function(file) {
        console.log('Processing HTML file: ', file.path);
      })
      .pipe(gulp.dest('dist'))
      .on('end', () => console.log('HTML files written to dist'));
  });
  
  gulp.task('css', function () {
    return gulp.src(paths.css)
      .pipe(sourcemaps.init())
      .pipe(cssnano())
      .pipe(sourcemaps.write('.'))
      .on('data', function(file) {
        console.log('Processing CSS file: ', file.path);
      })
      .pipe(gulp.dest('dist/css'))
      .on('end', () => console.log('CSS files written to dist/css'));
  });
  
  gulp.task('js', function () {
    return gulp.src(paths.js)
      .pipe(sourcemaps.init())
      .pipe(concat('bundle.js'))
      .pipe(uglify())
      .pipe(sourcemaps.write('.'))
      .on('data', function(file) {
        console.log('Processing JS file: ', file.path);
      })
      .pipe(gulp.dest('dist/js'))
      .on('end', () => console.log('JS files written to dist/js'));
  });
  
  gulp.task('img', function () {
    return gulp.src(paths.img)
      .on('data', function(file) {
        console.log('Processing image file: ', file.path);
      })
      .pipe(gulp.dest('dist/img'))
      .on('end', () => console.log('Image files written to dist/img'));
  });
  
  gulp.task('docsImg', function () {
    return gulp.src(paths.docsImg)
      .on('data', function(file) {
        console.log('Processing documentation image file: ', file.path);
      })
      .pipe(gulp.dest('dist/documentation/img'))
      .on('end', () => console.log('Documentation image files written to dist/documentation/img'));
  });
  
  gulp.task('docsJs', function () {
    return gulp.src(paths.docsJs)
      .on('data', function(file) {
        console.log('Processing documentation JS file: ', file.path);
      })
      .pipe(gulp.dest('dist/documentation/js/jquery/jquery-ui-1.13.0.custom'))
      .on('end', () => console.log('Documentation JS files written to dist/documentation/js/jquery/jquery-ui-1.13.0.custom'));
  });
  
  gulp.task('legalTexts', function () {
    return gulp.src(paths.legalTexts)
      .on('data', function(file) {
        console.log('Processing legal text file: ', file.path);
      })
      .pipe(gulp.dest('dist/Legal Texts'))
      .on('end', () => console.log('Legal text files written to dist/Legal Texts'));
  });
  
  gulp.task('build', gulp.series('html', 'css', 'js', 'img', 'docsImg', 'docsJs', 'legalTexts'));
  
  gulp.task('deploy', function (cb) {
    ghPages.publish(path.join(process.cwd(), 'dist'), cb);
  });
  
  gulp.task('default', gulp.series('build', 'deploy'));
  