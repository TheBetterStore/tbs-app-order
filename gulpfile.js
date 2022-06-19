const gulp = require('gulp');
const del = require('del');
const zip = require('gulp-zip');
const install = require('gulp-install');
const ts = require('gulp-typescript');

// pull in the project TypeScript config
const tsProject = ts.createProject('tsconfig.json');


gulp.task('clean', function(cb) {
  return del('dist', cb);
});


gulp.task('scripts', function() {
  const tsResult = tsProject.src()
      .pipe(tsProject());
  return tsResult.js.pipe(gulp.dest('dist'));
});

gulp.task('buildonce', gulp.series('scripts', function() {
  return gulp.src('src/**/*.js')
      .pipe(gulp.dest('dist'));
}));

gulp.task('config', function() {
  return gulp.src('src/resources/**')
      .pipe(gulp.dest('dist/resources'));
});

// Here we want to install npm packages to dist, ignoring devDependencies.
gulp.task('npm', function() {
  return gulp.src('./package.json')
      .pipe(gulp.src('./.npmrc'))
      .pipe(gulp.dest('./dist/'))
      .pipe(install({production: true}));
});

/* Note the nodir is required for Windows builds,
  so appropriate file permissions are set in zoip for Lambda to see */
gulp.task('default', gulp.series('clean', 'buildonce', 'config', 'npm',
    function() {
      return gulp.src(['dist/**/*'],
          {nodir: true})
          .pipe(zip('dist/tbs-app-order.zip'))
          .pipe(gulp.dest('./'));
    }));
