let gulp = require('gulp'),
sass = require('gulp-sass'),
browserSync = require('browser-sync');

gulp.task('sass', () => { 
	return gulp.src('app/sass/**/*.scss')
	.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
	.pipe(gulp.dest('app/css'))
	// .pipe(browserSync.reload());		
});

gulp.task('browser-sync', () => {
	browserSync({
		server: {
			baseDir: 'app'
		},
		port: 8080,
		tunnel: "mixalezhnev",
		notify: false
	});
});

gulp.task('watch', ["browser-sync", "sass"], () => {
	gulp.watch('app/sass/**/*.scss', ['sass', browserSync.reload]);
	gulp.watch('app/*.html', browserSync.reload);
	gulp.watch('app/js/**/*.js', browserSync.reload);
});

gulp.task('default', ['watch']);