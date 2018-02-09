const gulp = require('gulp');
const babel = require('babelify');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const notify = require('gulp-notify');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const imagemin = require('gulp-imagemin');
const concat = require('gulp-concat');


gulp.task('styles', () => {
	return gulp.src('./dev/styles/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(concat('style.css'))
		.pipe(gulp.dest('./public/styles'))
});

gulp.task('js', () => {
	return browserify('dev/scripts/**/*.js', {debug: true})
		.transform('babelify', {
			sourceMaps: true,
			presets: ['es2015']
		})
		.bundle()
		.on('error',notify.onError({
			message: "Error: <%= error.message %>",
			title: 'Error in JS 💀'
		}))
		// .pipe(source('app.js'))
		.pipe(buffer())
		.pipe(gulp.dest('public/scripts'))
		.pipe(reload({stream:true}));
});

gulp.task('assets', () => {
	return gulp.src('./dev/assets/**/*')
		.pipe(imagemin([
			imagemin.gifsicle({ interlaced: true }),
			imagemin.jpegtran({ progressive: true }),
			imagemin.optipng({ optimizationLevel: 5 }),
			imagemin.svgo({
				plugins: [
					{ removeViewBox: true },
					{ cleanupIDs: false }
				]
			})
		]))
		.pipe(gulp.dest('./public/assets/'))
		.pipe(reload({ stream: true }));
});

gulp.task('bs', () => {
	return browserSync.init({
		server: {
			baseDir: './'
		}
	});
});

gulp.task('default', ['bs', 'styles', 'assets'], () => {
	gulp.watch('dev/**/*.js', ['scripts']);
	gulp.watch('dev/**/*.scss', ['styles']);
	gulp.watch('./dev/assets/**/*', ['assets']);
	gulp.watch('./public/styles/style.css', reload);
});