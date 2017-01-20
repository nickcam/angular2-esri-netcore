var webroot = "wwwroot";
var gulp = require('gulp');

var sass = require('gulp-sass');
var runSequence = require('run-sequence');
var cache = require('gulp-cached');
var del = require('del');
var exec = require('child_process').exec;

var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json", {
    typescript: require('typescript'),
    inlineSources: false, //need to use gulp-sourcemaps when compiling within gulp
    sourceMaps: false
});

/**
    Copy external lib files needed to run the app from node_modules to the webroot.
*/
gulp.task('copy:nodeMods', function (callback) {

    //Copy css from node_modules to csslib
    gulp.src([
      'node_modules/bootstrap/dist/css/bootstrap*.css',
    ],
    { base: './node_modules/' }
    ).pipe(gulp.dest(webroot + '/csslib/'));

    //copy js files from node_modules to wwwroot/lib. Use base of ./node_modules to retain folder structure (not including the node_modules folder though)
    return gulp.src([
      'node_modules/@angular/**',
      'node_modules/rxjs/**',
      'node_modules/angular-in-memory-web-api/**',
      'node_modules/systemjs/dist/system-polyfills.js',
      'node_modules/systemjs/dist/system.src.js',
      'node_modules/reflect-metadata/Reflect.js',
      'node_modules/zone.js/dist/**',
      'node_modules/core-js/client/**',
      'node_modules/esri-system-js/dist/esriSystem.js',
    ],
    { base: './node_modules/' }
    ).pipe(gulp.dest(webroot + '/lib/'));

});


/**
    compile sass and copy to css folder under wwwroot
*/
gulp.task('sass:css', function () {

    //copy any imgs from img folder into css folder as well
    gulp.src('css/img/*.*').pipe(gulp.dest(webroot + '/css/img'));

    return gulp.src('css/**/*.scss')
      .pipe(sass().on('error', function (e) { console.log(e); }))
      .pipe(gulp.dest(webroot + '/css'));
});

/**
    compile any sass files in the app folder (component's individual styles) and copy them over as well.
*/
gulp.task('sass:app', function () {

    //compile the sass files under app folder and pipe them in place and to the wwwroot folder.
    //compile them in place so the angular compiler can read them when using ahead of time compilation.
    return gulp.src('app/**/*.scss')
    .pipe(sass().on('error', function (e) { console.log(e); }))
    .pipe(gulp.dest("app/."))
    .pipe(gulp.dest(webroot + '/app'));

});

/**
    Run all sass tasks
*/
gulp.task('sass', ['sass:css', 'sass:app']);

/**
    copy component templates to app folder in webroot.
*/
gulp.task('copy:templates', function () {
    return gulp.src('app/**/*.html')
     .pipe(cache('html'))
     .pipe(gulp.dest(webroot + '/app')); 
});


/**
    watch for changes on certain files and run when changed
*/
gulp.task('watch', function () {
    gulp.watch('app/**/*.scss', ['sass:app']); //run sass every time an scss file is saved.
    gulp.watch('css/**/*.scss', ['sass:css']);
    gulp.watch('app/**/*.html', ['copy:templates']); //copy every time a template file is saved.
});


gulp.task('typescript:compile', function (cb) {
    var tsResult = tsProject.src()
        .pipe(tsProject());

    return tsResult.js.pipe(gulp.dest(webroot));

});


/**
    Runs some tasks required for a dev build to work.
*/
gulp.task('build:dev', function (cb) {
    runSequence("copy:nodeMods", "copy:typings", "copy:templates", "sass", cb);
});

/**
    Use Anuglar 2 compiler to ahead of time compile the angular code
*/
gulp.task('dist:ngc-compile', function (cb) {
    exec('node_modules\\.bin\\ngc -p tsconfig.aot.json', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

/**
    Use Rollup to bundle the ahead of time compiled code into a single file, that has had tree-shaking applied.
*/
gulp.task('dist:rollup', function (cb) {
    exec('node_modules\\.bin\\rollup -c rollup.js', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

/**
    Run the two tasks to compile using ngc and create a build file using rollup. 
    Note: had to add a normal dev typescript compile step after rollup otherwise the non dist build would break. Not sure why?
*/
gulp.task('build:dist', function (callback) {
    runSequence("dist:ngc-compile", "dist:rollup", "typescript:compile", callback);
});
