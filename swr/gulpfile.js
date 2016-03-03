(function() {
'use strict';

var 
    gulp       = require('gulp'),
	nodemon    = require('gulp-nodemon'),
	livereload = require('gulp-livereload'),
end_require= true;

var livereload_paths = [
	    'client/*.html',
	    'client/css/*',
	    'client/img/*',
	    'client/js/*',
	    'client/js/controller/*',
	    'client/js/service/*',
	    'client/lib/*',
	    'client/view/*',
	];

gulp.task('welcome', function() {
    console.log( '-------------------------------------------------------------------' );
	console.log( '>> welcome...' );
	console.log( '-------------------------------------------------------------------' );
});

gulp.task('livereload', function() {
	console.log( '>> detect change index.html..' );
	return gulp.src(livereload_paths)
        .pipe(livereload());
});

gulp.task('nodemon', function() {
    nodemon({
        script: 'server/server.js',
        env: {
            'NODE_ENV': 'development'
        },
		ignore: ["localdata/*"],
    })
    .on('restart');
});

gulp.task('watch', function() {
	livereload.listen();
    gulp.watch(livereload_paths, ['livereload']);
});

gulp.task('default', ['welcome', 'nodemon', 'watch' ]);

}());
