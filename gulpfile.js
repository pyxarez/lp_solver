const gulp = require('gulp'),
	sass = require('gulp-sass'),
	del = require('del'),
	babel = require('gulp-babel'),
	browserSync = require('browser-sync');

gulp.task('sass', () => { 
	return gulp.src('app/sass/**/*.scss')
	.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload({stream: true}));		
});

gulp.task('browser-sync', () => {
	browserSync({
		server: {
			baseDir: 'app'
		},
		port: 8080,
		tunnel: "sanchez",
		notify: false
	});	
});

gulp.task('build', ['sass', 'transpile'], () => {
	const buildCss = gulp.src([
		'app/css/main.css'
	])
	.pipe(gulp.dest('dist/css'));

	const buildImg = gulp.src('app/img/*.svg')
	.pipe(gulp.dest('dist/img'));

	const buildHtml = gulp.src([
		'app/*.html'
	])
	.pipe(gulp.dest('dist'));
});

gulp.task('clean', () => {
	return del.sync('dist');
});

gulp.task('transpile', () => {
	gulp.src(['app/js/draw.js', 'app/js/math.js','app/js/main.js'])
		.pipe(babel({
			presets:['es2015'],
			minified: true,
			comments: false
		}))
		.pipe(gulp.dest('dist/js'));
});

gulp.task('watch', ["browser-sync", "sass"], () => {
	gulp.watch('app/sass/**/*.scss', ['sass']);
	gulp.watch('app/*.html', browserSync.reload);
	gulp.watch('app/js/**/*.js', browserSync.reload);
});

gulp.task('default', ['watch']);