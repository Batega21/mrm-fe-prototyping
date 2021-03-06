/*
 * Modules used within this gulpfile
 */
const gulp = require('gulp');
const browserify = require('browserify');
const sourcemaps = require('gulp-sourcemaps');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const babel = require('babelify');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const argv = require('yargs').argv;
const clean = require('gulp-clean');


/*
 * Configuration of the script
 */
const config = require('./config.json');
const DEBUG = argv[config.productionModeFlag] === 'undefined' ? 
  (config.defaultDebug ? true : false) : // No production flag has been sent, take the default one
  false; // Production flag has ben sent to the task

// process JS files and return the stream.
gulp.task('js', () =>{

  const bundler = browserify(
    config.scripts.sourcePath + config.scripts.entryScript,
    { debug: DEBUG }
  ).transform(babel);

  // Return the stream
  return bundler.bundle()
    .on('error', (err)=>{
      console.error(err);
      this.emit('end');
    })
    .pipe(source(config.scripts.compiledFileName))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.scripts.destinationPath));
});

// create a task that ensures the `js` task is complete before
// reloading browsers
gulp.task('js-watch', ['js'], (done) => {
  browserSync.reload();
  done();
});

gulp.task('concat-styles', ['sass'], ()=>{
  return gulp.src(config.temporaryFolder + '**.css')
    .pipe(sourcemaps.init())
    .pipe(concat(config.styles.compiledFileName))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.styles.destinationPath));
});

gulp.task('sass', ()=>{
  return gulp.src(config.styles.sourcePath + '*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.temporaryFolder));
});

gulp.task('sass-watch', ['concat-styles'], (done)=>{
  browserSync.reload();
  done();
});

gulp.task('copyhtml', ()=>{
  // Copy html
  return gulp.src(config.serverBaseDirectory + '*.html')
        .pipe(gulp.dest('./dist/'));
});

gulp.task('html-watch', ['copyhtml'], (done)=>{
  browserSync.reload();
  done();
});

gulp.task('copyfonts', ()=>{
  // Copy html
  return gulp.src([config.fonts.sourcePath + '*', config.fonts.sourcePath + '*/*'])
        .pipe(gulp.dest(config.fonts.destinationPath));
});

gulp.task('fonts-watch', ['copyfonts'], (done)=>{
  browserSync.reload();
  done();
});

// use default task to launch Browsersync and watch JS files
gulp.task('serve', ['clean:build'], ()=>{

  // Serve files from the root of this project
  browserSync.init({
    server: {
      baseDir: config.serverBaseDirectory,
    },
  });

  // add browserSync.reload to the tasks array to make
  // all browsers reload after tasks are complete.
  gulp.watch([config.scripts.sourcePath + '*.js', config.scripts.sourcePath + '/*/*.js'], ['js-watch']);
  gulp.watch([config.styles.sourcePath + '*.scss', config.styles.sourcePath + '/*/*.scss'], ['sass-watch']);
  gulp.watch(config.serverBaseDirectory + '*.html', ['html-watch']);
  gulp.watch(config.fonts.sourcePath, ['fonts-watch']);
});

// Clean built files
gulp.task('clean', () => {
  return gulp.src([
    config.temporaryFolder,
    config.styles.destinationPath,
    config.scripts.destinationPath,
    config.fonts.destinationPath,
  ], { read: false })
    .pipe(clean());
});

// Build task
gulp.task('build',
  [
    'js',
    'concat-styles',
    'copyhtml',
    'copyfonts',
  ], (done)=> {
    done();
  });

// Clean built files and rebuild
gulp.task('clean:build', ['clean', 'build']);

// Default task build
gulp.task('default', ['clean:build']);
