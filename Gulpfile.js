'use strict';

const gulp       = require('gulp');
const concat     = require('gulp-concat');
const del        = require('del');
const babel      = require('gulp-babel');
const ngAnnotate = require('gulp-ng-annotate');
const uglify     = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const inject     = require('gulp-inject');
const nodemon    = require('gulp-nodemon');
const plumber    = require('gulp-plumber');
const mbf        = require('main-bower-files');


let paths = {
  js : {
    input : 'app/js/**/*.js',
    output: 'public/js'
  },
  css : {
    input : 'app/css/**/*.css',
    output: 'public/css'
  },
  html : {
    input : 'app/html/**/*.html',
    output: 'public/html'
  }
}

gulp.task('default', ['build', 'watch', 'index', 'serve']);
gulp.task('build', ['html', 'js', 'css']);
gulp.task('watch', ['watch:js', 'watch:html', 'watch:css']);
gulp.task('serve', ()=> nodemon({ignore : ['./app' ,'./public']}));

gulp.task('js',   ['clean:js'],   ()=>{
  return gulp.src(paths.js.input)
  .pipe(plumber())
  .pipe(sourcemaps.init())
  .pipe(babel({presets : 'es2015'}))
  .pipe(concat('bundle.js'))
  .pipe(ngAnnotate())
  .pipe(uglify())
  .pipe(sourcemaps.write())
  .pipe(gulp.dest(paths.js.output))
});
gulp.task('html', ['clean:html'], ()=>{
  return gulp.src(paths.html.input)
  .pipe(gulp.dest(paths.html.output))
});
gulp.task('css',  ['clean:css'],  ()=>{
  return gulp.src(paths.css.input)
  .pipe(plumber())
  .pipe(gulp.dest(paths.css.output))
});

gulp.task('watch:js',   ()=> gulp.watch(paths.js.input, ['js']));
gulp.task('watch:html', ()=> gulp.watch(paths.html.input, ['html']));
gulp.task('watch:css',  ()=> gulp.watch(paths.css.input, ['css']));

gulp.task('clean:js',   ()=> del([paths.js.output]));
gulp.task('clean:html', ()=> del([paths.html.output]));
gulp.task('clean:css',  ()=> del([paths.css.output]));

gulp.task('index', ()=>{
  return gulp.src('app/html/index_gulp.html')
  .pipe(inject(gulp.src(mbf(), {read : false}, {name: 'bower'})))
  .pipe(inject(gulp.src(['./public/js/bundle.js', 'app/css/assets/bootswatch-cyborg.min.css', 'app/css/assets/animate.css', 'app/css/main.css'], {read : false})))
  .pipe(gulp.dest('./public'));
})
