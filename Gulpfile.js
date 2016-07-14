const gulp = require('gulp');
const concat = require('gulp-concat');
const del = require('del');
const babel = require('gulp-babel');
const ngAnnotate = require('gulp-ng-annotate');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const inject = require('gulp-inject');
const nodemon = require('gulp-nodemon');
const plumber = require('gulp-plumber');
const mbf = require('main-bower-files');

const paths = {
  js: {
    input: ['app/js/**/*.js', 'app/css/assets/*.js'],
    output: 'public/js',
  },
  css: {
    input: 'app/css/**/*.css',
    output: 'public/css',
  },
  html: {
    input: 'app/html/**/*.html',
    output: 'public/html',
  },
};

gulp.task('default', ['build', 'watch', 'index', 'serve']);
gulp.task('build', ['html', 'js', 'css']);
gulp.task('watch', ['watch:js', 'watch:html', 'watch:css']);
gulp.task('serve', () => nodemon({ ignore: ['./app', './public'] }));

gulp.task('js', ['clean:js'], () => gulp.src(paths.js.input)
.pipe(plumber())
.pipe(sourcemaps.init())
.pipe(babel({ presets: 'es2015' }))
.pipe(concat('bundle.js'))
.pipe(ngAnnotate())
.pipe(uglify())
.pipe(sourcemaps.write())
.pipe(gulp.dest(paths.js.output)));

gulp.task('html', ['clean:html'], () => gulp.src(paths.html.input)
.pipe(gulp.dest(paths.html.output)));

gulp.task('css', ['clean:css'], () => gulp.src(paths.css.input)
.pipe(plumber())
.pipe(gulp.dest(paths.css.output)));

gulp.task('watch:js', () => gulp.watch(paths.js.input, ['js']));
gulp.task('watch:html', () => gulp.watch(paths.html.input, ['html']));
gulp.task('watch:css', () => gulp.watch(paths.css.input, ['css']));

gulp.task('clean:js', () => del([paths.js.output]));
gulp.task('clean:html', () => del([paths.html.output]));
gulp.task('clean:css', () => del([paths.css.output]));

gulp.task('index', () => gulp.src('app/html/index.html')
.pipe(inject(gulp.src(mbf(), { read: false }), { name: 'bower.js' }))
.pipe(inject(gulp.src(mbf(), { read: false }), { name: 'bower.css' }))
.pipe(inject(gulp.src(['./public/js/bundle.js',
'/css/assets/bootswatch-cyborg.min.css',
'/css/assets/animate.css', '/css/main.css'],
{ read: false })))
.pipe(gulp.dest('./public/index.html')));

// Browser Sync Plugin
// var gulp = require('gulp');
// var browserSync = require('browser-sync');
// var nodemon = require('gulp-nodemon');
//
// // we'd need a slight delay to reload browsers
// // connected to browser-sync after restarting nodemon
// var BROWSER_SYNC_RELOAD_DELAY = 500;
//
// gulp.task('nodemon', function (cb) {
//   var called = false;
//   return nodemon({
//
//     // nodemon our expressjs server
//     script: 'app.js',
//
//     // watch core server file(s) that require server restart on change
//     watch: ['app.js'],
//   })
//     .on('start', function onStart() {
//       // ensure start only got called once
//       if (!called) { cb(); }
//       called = true;
//     })
//     .on('restart', function onRestart() {
//       // reload connected browsers after a slight delay
//       setTimeout(function reload() {
//         browserSync.reload({
//           stream: false
//         });
//       }, BROWSER_SYNC_RELOAD_DELAY);
//     });
// });
//
// gulp.task('browser-sync', ['nodemon'], function () {
//
//   // for more browser-sync config options: http://www.browsersync.io/docs/options/
//   browserSync({
//
//     // informs browser-sync to proxy our expressjs app which would run at the following location
//     proxy: 'http://localhost:3000',
//
//     // informs browser-sync to use the following port for the proxied app
//     // notice that the default port is 3000, which would clash with our expressjs
//     port: 4000,
//
//     // open the proxied app in chrome
//     browser: ['google-chrome']
//   });
// });
//
// gulp.task('js',  function () {
//   return gulp.src('public/**/*.js')
//     // do stuff to JavaScript files
//     //.pipe(uglify())
//     //.pipe(gulp.dest('...'));
// });
//
// gulp.task('css', function () {
//   return gulp.src('public/**/*.css')
//     .pipe(browserSync.reload({ stream: true }));
// })
//
// gulp.task('bs-reload', function () {
//   browserSync.reload();
// });
//
// gulp.task('default', ['browser-sync'], function () {
//   gulp.watch('public/**/*.js',   ['js', browserSync.reload]);
//   gulp.watch('public/**/*.css',  ['css']);
//   gulp.watch('public/**/*.html', ['bs-reload']);
// });
