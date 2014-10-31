var concat = require('gulp-concat');
var filesize = require('gulp-filesize');
var gulp = require('gulp');
var gzip = require('gulp-gzip');
var maven = require('gulp-maven-deploy');
var minifyCSS = require('gulp-minify-css');
var pkg = require('./package');
var rename = require('gulp-rename');
var rimraf = require('gulp-rimraf');
var sourcemaps = require('gulp-sourcemaps');
var spawn = require('child_process').spawn;
var tar = require('gulp-tar');
var util = require('gulp-util');

var distDir = './dist/';
var buildDir = './build/';
var destinationDir = distDir + pkg.name + '-' + pkg.version;

var debugMode = false;

gulp.task('clean', function(){
	return gulp.src([
		buildDir,
		distDir
	], {read: false}).pipe(rimraf({force:true}));
});

gulp.task('copy-src-toDist', ['clean'], function(){
	return gulp.src([
		'./src/**'
	], {base: 'src/'})
	.pipe(gulp.dest(destinationDir));
});

gulp.task('copy-to-build', ['clean'], function(){
	return gulp.src([
		'./src/styles/**',
		'./src/styles/legacy/**'
		], {base: 'src/styles/'})
		.pipe(gulp.dest(buildDir));
});

gulp.task('sass', ['copy-to-build'], function(){
	// add SASS support....
});

gulp.task('build-so-css', ['sass'], function(){
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
		.pipe(gulp.dest(destinationDir))
		.pipe(sourcemaps.init())
		.pipe(minifyCSS({
			keepBreaks: false,
			processImport: true,
			debug: true
		}))
		.pipe(concat('spaden.min.css'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(destinationDir))
});

gulp.task('build-legacy-css', ['sass'], function(){
	gulp.src(buildDir + '/legacy/**')
		.pipe(concat('legacy.css'))
		.pipe(gulp.dest(destinationDir))
		.pipe(sourcemaps.init())
		.pipe(minifyCSS({
			keepBreaks: false,
			processImport: true,
			debug: false
		}))
		.pipe(concat('legacy.min.css'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(destinationDir))
});

gulp.task('package', ['copy-src-toDist', 'build-so-css', 'build-legacy-css'], function(){
	return gulp.src([
			distDir + '/' + pkg.name + '-' + pkg.version + '/**'
			],
			{base: distDir + '/' + pkg.name + '-' + pkg.version + '/'}
		)
		.pipe(tar(pkg.name + '-' + pkg.version + '.tar'))
		.pipe(gzip())
		.pipe(gulp.dest('./dist'));
});

gulp.task('npm-version', function(done){
	var versionType = util.env.versionType;
	spawn('npm', ['version', versionType], { stdio: 'inherit' }).on('close', done);	
});

gulp.task('npm-publish', ['package'], function(done) {
  spawn('npm', ['publish', '.'], { stdio: 'inherit' }).on('close', done);
});

gulp.on('err', function(e) {
  console.log(e.err.stack);
});

gulp.task('release', [
	'npm-version',
	'copy-src-toDist',
	'build-so-css',
	'build-legacy-css',
	'package',
	'npm-publish'
]);
gulp.task('default', [
	'sass',
	'build-so-css',
	'build-legacy-css',
	'package'
]);