var gulp = require('gulp'),
    json = require('json-file'),
    image = require('gulp-image'),
    $ = require('gulp-load-plugins')(),
    browserSync = require('browser-sync').create();

// Project Var
var proxy = json.read('./package.json').get('proxy');
var sassPaths = [
    './node_modules/font-awesome/scss',
    './node_modules/bootstrap-sass/assets/stylesheets'/*,
    './node_modules/slick-carousel/slick'*/
];
gulp.task('scss', function() {
    return gulp.src(['./assets/scss/*.scss'])
        .pipe($.sourcemaps.init())
        .pipe($.sass({ includePaths: sassPaths, outputStyle: 'expanded' }).on('error', $.sass.logError))
        .pipe($.groupCssMediaQueries())
        .pipe($.autoprefixer({ browsers: ['last 2 versions', 'ie >= 9'] }))
        .pipe($.cleanCss())
        .pipe($.rename({
            suffix: ".min",
            extname: ".css"
        }))
        .pipe($.sourcemaps.write('./maps'))
        .pipe(gulp.dest('./css'))
        .pipe(browserSync.stream());
});
gulp.task('js', function() {
    return gulp.src([
            // JQUERY
            './node_modules/jquery/dist/jquery.js',

            // BOOTSTRAP
            './node_modules/bootstrap-sass/assets/javascripts/bootstrap.js',

            // IMAGES LOADED
            './node_modules/imagesloaded/imagesloaded.pkgd.js',

            // PACKERY
            //'./node_modules/packery/dist/packery.pkgd.js',

            // SLICK SLIDER
            //'./node_modules/slick-carousel/slick/slick.js',

            // MODERNIZR
            './assets/js/lib/modernizr-custom.js',

            // GLOBAL
            './assets/js/app.js',
        ])
        .pipe($.sourcemaps.init())
        .pipe($.concat('app.min.js', { newLine: ';' }))
        .pipe($.uglify())
        .pipe($.sourcemaps.write('./maps'))
        .pipe(gulp.dest('./js'))
        .pipe(browserSync.stream());
});

gulp.task('image', function () {
  gulp.src('./assets/images/*')
    .pipe(image())
    .pipe(gulp.dest('./img'));
});

gulp.task('watch', ['scss', 'js', 'image'], function() {
    /*browserSync.init({
        proxy: proxy,
        host: '10.0.1.73',
        port: 3000,
        open: true
    });*/

    gulp.watch(['./assets/scss/**/*.scss'], ['scss']);
    gulp.watch(['./assets/js/**/*.js'], ['js']);
    gulp.watch(['./**/*.php']).on('change', browserSync.reload);
});
gulp.task('default', ['scss', 'js', 'image', 'watch']);

