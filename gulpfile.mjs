/*import gulp from 'gulp';
import htmltidy from 'gulp-htmltidy';
import autoprefixer from 'gulp-autoprefixer';
import cssmin from 'gulp-cssmin';
import csslint from 'gulp-csslint';

//gulp.task('default', ()=>{return ['html', 'css']});


gulp.task('html', () => {
  
  console.log('Processing HTML files...');

  gulp.src('src/index.html')
  .pipe(htmltidy())
  .pipe(gulp.dest('build'))});

gulp.task('css', () => {

  console.log('Processing CSS files...');

  gulp.src('src/css/*.css')
  .pipe(csslint())
  .pipe(csslint.formatter('compact'))
  .pipe(autoprefixer({
    //browsers: ['last 5 versions'],
    overrideBrowserslist: ['last 5 versions'],
    cascade: false,
  })).pipe(cssmin())
  .pipe(gulp.dest('build/css'))
});

// Default task
gulp.task('default', gulp.series(
  gulp.parallel('html','css'),
  (done) => {
      console.log('All tasks completed successfully.');
      done();
  }
));*/
import gulp from 'gulp';
import htmltidy from 'gulp-htmltidy';
import autoprefixer from 'gulp-autoprefixer';
import cssmin from 'gulp-cssmin';
import csslint from 'gulp-csslint';

gulp.task('html', () => {
  console.log('Processing HTML files...');
  return gulp.src('src/index.html')
    .pipe(htmltidy())
    .pipe(gulp.dest('build'));
});

gulp.task('css', () => {
  console.log('Processing CSS files...');
  return gulp.src('src/css/*.css')
    .pipe(csslint())
    .pipe(csslint.formatter('compact'))
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 5 versions'],
      cascade: false,
    }))
    .pipe(cssmin())
    .pipe(gulp.dest('build/css'));
});

// Default task
gulp.task('default', gulp.series(
  gulp.parallel('html', 'css'),
  (done) => {
    console.log('All tasks completed successfully.');
    done();
  }
));
