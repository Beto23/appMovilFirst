var gulp = require('gulp');
var webserver = require('gulp-webserver');
var stylus = require('gulp-stylus');
var nib = require('nib');
var minifyCSS = require('gulp-minify-css');
var browserify = require('browserify');
var source = require ('vinyl-source-stream');
var buffer = require ('vinyl-buffer');
var uglify = require ('gulp-uglify');
var imgop = require ('gulp-image-optimization');
var smoosher = require ('gulp-smoosher');

var config = {
	styles:{
		main: './src/styles/main.styl',
		watch: './src/styles/**/*.styl',
		output: './build/css'
	},
	html: {
		main: './src/index.html',
		watch: './src/*.html',
		output: './build'
	},
	scripts:{
		main:'./src/scripts/main.js',
		watch: './src/scripts/**/*.js',
		output: './build/js'
	},
	images:{
		watch: ['./src/img/*.jpg', './src/img/*.png'],
		output: './build/img'
	}
}

gulp.task('server', function(){
	gulp.src('./build')
		.pipe(webserver({
			host: '0.0.0.0',
			port: 8000,
			livereload: true
		}))
 });

gulp.task('build:css', function(){
	gulp.src(config.styles.main)
		.pipe(stylus({
			use: nib(),
			'include css': true
		}))
		.pipe(minifyCSS())
		.pipe(gulp.dest(config.styles.output));
});

gulp.task('build:html', function(){
	gulp.src(config.html.main)
		.pipe(gulp.dest(config.html.output));
});

gulp.task('images', function(){
	gulp.src(config.images.watch)
		.pipe(imgop({
			optimizationLevel: 5,
			progressive: true,
			interlaced: true
			}))
		.pipe(gulp.dest(config.images.output));
	});

gulp.task('build:js', function(){
	return browserify(config.scripts.main)
	.bundle()
	.pipe(source('bundle.js'))
	.pipe(buffer())
	.pipe(uglify())
	.pipe(gulp.dest(config.scripts.output))
	})

gulp.task('watch', function(){
	gulp.watch(config.images.watch, ['images']);
	gulp.watch(config.scripts.watch, ['build:js']);
	gulp.watch(config.html.watch, ['build:html', 'build']);
	gulp.watch(config.styles.watch, ['build:css']);
	})

gulp.task('build', ['build:css', 'build:html', 'build:js', 'images']);

gulp.task('default', ['server', 'watch' ,'build']);
