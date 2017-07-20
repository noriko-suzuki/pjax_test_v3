import gulp from 'gulp';
import sass from 'gulp-sass';
import plumber from 'gulp-plumber';
import notify  from 'gulp-notify';
import globImporter from 'sass-glob-importer';
import autoprefixer from 'gulp-autoprefixer';
import BrowserSync from 'browser-sync';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';

import browserSync from 'browser-sync';
import browserify from 'browserify';
import babelify from 'babelify';


gulp.task('html', () => {
  gulp.src('src/**/*.html')
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
});

gulp.task('sass', () => {
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

gulp.task('js', () => {
  gulp.src([
      'src/js/libs/jquery.js',
      'src/js/libs/jquery.easing.1.3.js',
      'src/js/libs/jquery.pjax.js',
      'src/js/libs/jquery.scrollify.js',
      'src/js/libs/jquery.waypoints.js',
      'src/js/libs/imagesloaded.pkgd.js',
      'src/js/index.js',
    ])
    return browserify({
        'entries': ['src/js/index.js'],
        'debug': true,
        'transform': [
            babelify.configure({
                'presets': ['es2015', 'react']
            })
        ]
    })
    .bundle()
    // .on('error', function () {
    //     var args = Array.prototype.slice.call(arguments);
    //
    //     plugins().notify.onError({
    //         'title': 'Compile Error',
    //         'message': '<%= error.message %>'
    //     }).apply(this, args);
    //
    //     this.emit('end');
    // })
    .pipe(plumber())
    .pipe(concat('bundle.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.stream());
});

gulp.task('img', () => {
  gulp.src('src/img/**/*.{png,jpg,svg,gif}')
    .pipe(gulp.dest('dist/img'))
    .pipe(browserSync.stream());
});

gulp.task('font', () => {
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

gulp.task('watch', ['sass'], () => {
  gulp.watch('src/**/*.html', ['html']);
  gulp.watch('src/scss/**/*.scss', ['sass']);
  gulp.watch('src/js/**/*.js', ['js']);
  gulp.watch('src/img/**/*.{png,jpg,svg,gif}', ['img']);
});

gulp.task('default', ['watch', 'browser-sync']);
