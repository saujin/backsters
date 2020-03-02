var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var babel = require('gulp-babel');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var path = require('path');
var watch = require('gulp-watch');

var paths = {
  src: 'app/**/*.js',
  dist: 'app.js',
  dest: 'dist'
};

gulp.task('build', function () {
  gulp
    .src(paths.src)
    .pipe(sourcemaps.init())
    .pipe(babel({ presets: ['babel-preset-es2015'] }))
    //.pipe(concat(paths.dist))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.dest));
});

gulp.task('less', function () {
  return gulp.src('app/less/style.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(minifyCSS())
    .pipe(gulp.dest('app/public/styles'));
});


gulp.task('watch', function () {
    gulp.watch('app/less/*.less', ['less']);
});