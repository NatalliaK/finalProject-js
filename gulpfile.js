const gulp = require('gulp'),
	sass = require('gulp-sass'),
	postcss = require("gulp-postcss"),
	autoprefixer = require("autoprefixer"),
	sourcemaps = require('gulp-sourcemaps'),
	plumber = require('gulp-plumber'),
	server = require("browser-sync").create(),
	del = require("del"),
	imagemin = require("gulp-imagemin"),
	svgstore = require("gulp-svgstore"),
	svgmin = require("gulp-svgmin"),
	rename = require("gulp-rename"),
	typograf = require("gulp-typograf"),
	notify = require('gulp-notify'),
	babelify = require('babel-preset-es2015'),
	browserify = require("browserify"),
	source = require('vinyl-source-stream'),
	buffer = require('vinyl-buffer'),
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat');

gulp.task('sass', function() {
	return gulp.src('./src/sass/style.scss')
		.pipe(plumber({
			errorHandler: notify.onError(function(err) {
				return {
					title: 'Sass',
					message: err.message
				};
			})
		}))
		.pipe(sass())
		.pipe(postcss([
			autoprefixer({browsers: [
				"last 2 versions"
			]})
		]))
		.pipe(gulp.dest('build'))
		.pipe(server.stream());
});

gulp.task('assetHtml', function() {
	return gulp.src('./src/**.html')
		.pipe(plumber())
		.pipe(gulp.dest('build'))
});

gulp.task('assetJs', function() {
	return browserify(['./src/script/index.js'])
		.transform('babelify', {
			presets: ['es2015']
		})
		.bundle()
		.pipe(source('script.js'))
		.pipe(buffer())
		//.pipe(uglify())
		.pipe(gulp.dest('build'))
});

gulp.task("images", function() {
	return gulp.src("src/img/**/*.{png,jpg,gif}")
		.pipe(imagemin([
			imagemin.optipng({optimizationLevel: 3}),
			imagemin.jpegtran({progressive: true})
		]))
		.pipe(gulp.dest("build/img"));
});

gulp.task("symbols", function() {
	return gulp.src("src/**/*.svg")
		.pipe(svgmin())
		.pipe(svgstore({
			inlineSvg: true
		}))
		.pipe(rename("symbols.svg"))
		.pipe(gulp.dest("build/img"));
});

gulp.task("typograf", function() {
	gulp.src("src/*.html")
		.pipe(typograf({ locale: ["ru", "en-US"] }))
		.pipe(gulp.dest("build"));
});

gulp.task("copyFonts", function() {
	return gulp.src("src/fonts/**/*")
		.pipe(gulp.dest("build/fonts"));
});

gulp.task("copyDist", function() {
	return gulp.src("src/dist/**/*")
		.pipe(gulp.dest("build/dist"));
});

gulp.task("clean", function() {
	return del(["build/dist", "build/fonts", "build/img", "build/index.html", "build/style.css", "build/script.js"]);
});

gulp.task("serve", ["sass", 'assetHtml','assetJs', 'images', 'symbols', 'copyFonts', 'copyDist', 'typograf'], function() {
	return server.init({
		server: {
			baseDir: "build"
		}
	});
});

gulp.task('default', ['clean', 'serve'], () => {
	gulp.watch("src/sass/**/*.scss", ["sass"]);
	gulp.watch("src/**.html", ['assetHtml'])
		.on("change", server.reload);
	gulp.watch("src/script/**/*.js", ['assetJs'])
		.on("change", server.reload);
	gulp.watch("src/img/**.*", ['images'])
		.on("change", server.reload);
});

