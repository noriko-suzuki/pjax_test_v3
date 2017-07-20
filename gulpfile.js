var gulp = require('gulp');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var notify  = require('gulp-notify');
var globImporter = require('sass-glob-importer');
var autoprefixer = require('gulp-autoprefixer');
var BrowserSync = require('browser-sync');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

var browserSync = BrowserSync.create();


gulp.task('html', function() {
  gulp.src('src/**/*.html')
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
});

gulp.task('sass', function() {
  gulp.src('src/scss/**/*.scss')

    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(sass({ importer: globImporter() }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
});

gulp.task('js', function() {
  gulp.src([
      'src/js/libs/jquery.js',
      'src/js/libs/jquery.easing.1.3.js',
      'src/js/libs/jquery.pjax.js',
      'src/js/libs/jquery.scrollify.js',
      'src/js/libs/jquery.waypoints.js',
      'src/js/libs/imagesloaded.pkgd.js',
      'src/js/index.js',
    ])
    .pipe(plumber())
    .pipe(concat('bundle.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.stream());
});

gulp.task('img', function() {
  gulp.src('src/img/**/*.{png,jpg,svg,gif}')
    .pipe(gulp.dest('dist/img'))
    .pipe(browserSync.stream());
});

gulp.task('font', function() {
  gulp.src('src/fonts/**/*.{eot,svg,ttf,woff}')
    .pipe(gulp.dest('dist/fonts'))
    .pipe(browserSync.stream());
});

gulp.task('browser-sync', [
    'html',
    'sass',
    'js'
  ], () => {
  browserSync.init({
    server: 'dist/'
  });
});

gulp.task('watch', ['sass'], function () {
  gulp.watch('src/**/*.html', ['html']);
  gulp.watch('src/scss/**/*.scss', ['sass']);
  gulp.watch('src/js/**/*.js', ['js']);
  gulp.watch('src/img/**/*.{png,jpg,svg,gif}', ['img']);
});

gulp.task('default', ['watch', 'browser-sync']);
