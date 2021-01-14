// Requires Gulp v4.
// $ npm uninstall --global gulp gulp-cli
// $ rm /usr/local/share/man/man1/gulp.1
// $ npm install --global gulp-cli
// $ npm install
const { src, dest, watch, series, parallel } = require('gulp');
const browsersync = require('browser-sync').create();
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
//const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const sasslint = require('gulp-sass-lint');
const cache = require('gulp-cached');
const notify = require('gulp-notify');
const beeper = require('beeper');

// Compile CSS from Sass.
function buildStyles() {
    return src('scss/style.scss')
        .pipe(plumbError()) // Global error handler through all pipes.
        //.pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'expanded', indentWidth: 4, })) //Expanded for dev.
        .pipe(autoprefixer(['last 2 versions', '> 1%', 'ie 11']))
        //.pipe(sourcemaps.write())
        .pipe(dest('.'))
        .pipe(browsersync.reload({ stream: true }));
}

// Watch changes on all *.scss files, lint them and
// trigger buildStyles() at the end.
function watchStyles() {
    watch(
        ['scss/*.scss', 'scss/**/*.scss'],
        { events: 'all', ignoreInitial: false },
        series(sassLint, buildStyles)
    );
}

// Refresh page on PHP and JS change
function watchOther() {
    return watch(
        ['*.php', '**/*.php', '*.js', '**/*.js'],
        { events: 'all', ignoreInitial: true },
        function (done) {
            browsersync.reload();
            done();
        }
    );
}

// Init BrowserSync.
function browserSync(done) {
    browsersync.init({
        proxy: 'localhost:3000/gutenbase-wp/', // Change this value to match your local URL.
        browser: 'google chrome',
        open: 'external',
    });
    done();
}

// Init Sass linter.
function sassLint() {
    return src(['scss/*.scss', 'scss/**/*.scss'])
        .pipe(cache('sasslint'))
        .pipe(sasslint({
            configFile: '.sass-lint.yml'
        }))
        .pipe(sasslint.format())
    //.pipe(sasslint.failOnError()); //no failure on SASS Linting error
}

// Error handler.
function plumbError() {
    return plumber({
        errorHandler: function (err) {
            notify.onError({
                templateOptions: {
                    date: new Date()
                },
                title: "Gulp error in " + err.plugin,
                message: err.formatted
            })(err);
            beeper();
            this.emit('end');
        }
    })
}

// Export commands.
exports.default = browserSync, parallel(watchStyles, watchOther); // $ gulp
exports.watch = series(browserSync, parallel(watchStyles, watchOther)); // $ gulp watch
exports.build = series(buildStyles); // $ gulp build