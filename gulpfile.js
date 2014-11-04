var concat = require('gulp-concat');
var filesize = require('gulp-filesize');
var gulp = require('gulp');
var gzip = require('gulp-gzip');
var minifyCSS = require('gulp-minify-css');
var pkg = require('./package');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var rimraf = require('gulp-rimraf');
var sourcemaps = require('gulp-sourcemaps');
var spawn = require('child_process').spawn;
var tar = require('gulp-tar');
var util = require('gulp-util');

var distDir = './dist/';
var buildDir = './src/styles/';
var destinationDir = distDir + pkg.name + '-' + pkg.version;

var debugMode = false;

gulp.task('clean', function() {
    return gulp.src([
            distDir
        ], {
            read: false
        })
        .pipe(rimraf({
            force: true
        }));
});

gulp.task('copy-images-to-dist', ['clean'], function() {
    return gulp.src('./src/img/**', {
            base: 'src/'
        })
        .pipe(gulp.dest(destinationDir));
});

gulp.task('sass', ['copy-images-to-dist'], function() {
    // add SASS support....
});

gulp.task('build-so-css', ['sass'], function() {
    return gulp.src([
            buildDir + '/core/core.css',
            buildDir + '/components/components.css'
        ])
        .pipe(sourcemaps.init())
        .pipe(minifyCSS({
            keepBreaks: true,
            processImport: true,
            debug: false
        }))
        .pipe(concat('spaden.css'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(destinationDir + '/styles/'))
        .pipe(sourcemaps.init())
        .pipe(minifyCSS({
            keepBreaks: false,
            processImport: true,
            debug: true
        }))
        .pipe(concat('spaden.min.css'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(destinationDir + '/styles/'))
});

gulp.task('build-legacy-css', ['sass'], function() {
    gulp.src(buildDir + '/legacy/**')
        .pipe(concat('legacy.css'))
        .pipe(gulp.dest(destinationDir + '/styles/'))
        .pipe(sourcemaps.init())
        .pipe(minifyCSS({
            keepBreaks: false,
            processImport: true,
            debug: false
        }))
        .pipe(concat('legacy.min.css'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(destinationDir + '/styles/'))
});

gulp.task('package', ['replace-imgpaths'], function() {
    var artifactVersion = pkg.version;
    if (util.env.versionOverride) {
        artifactVersion = util.env.versionOverride;
        console.log('version overrrid', artifactVersion);
    }
    return gulp.src([
            distDir + '/' + pkg.name + '-' + pkg.version + '/**'
        ], {
            base: distDir + '/' + pkg.name + '-' + pkg.version + '/'
        })
        .pipe(tar(pkg.name + '-' + artifactVersion + '.tar'))
        .pipe(gzip())
        .pipe(gulp.dest('./dist'));
});

gulp.task('replace-imgpaths', ['build-so-css', 'build-legacy-css'], function() {
    return gulp.src(destinationDir + '/**/*.css')
        .pipe(replace(/\.\.\/\.\.\/img\//g, 'img/'))
        .pipe(replace(/\/img\//g, 'img/'))
        .pipe(gulp.dest(destinationDir));
});


gulp.task('npm-version', ['clean'], function() {
    var versionType = util.env.versionType;
    /*spawn('npm', ['version', versionType], {
        stdio: 'inherit'
    }).on('close', done);*/
    spawn('echo', ['hola', versionType], {
        stdio: 'inherit'
    });
});

gulp.task('npm-publish', ['package'], function() {
    /*spawn('npm', ['publish', '.'], {
        stdio: 'inherit'
    }).on('close', done);*/
});

gulp.on('err', function(e) {
    console.log(e.err.stack);
});

gulp.task('release', [
    'npm-version',
    'copy-images-to-dist',
    'replace-imgpaths',
    'build-so-css',
    'build-legacy-css',
    'package',
    'npm-publish'
]);
gulp.task('default', [
    'replace-imgpaths',
    'sass',
    'build-so-css',
    'build-legacy-css',
    'package'
]);
