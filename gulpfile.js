var gulp = require("gulp");
var sass = require("gulp-sass");
var pug = require("gulp-pug");
var browserSync = require("browser-sync");
var useref = require("gulp-useref");
var gulpIf = require("gulp-if");
var strip = require("gulp-strip-comments");
var cssnano = require("cssnano");
var autoprefixer = require("autoprefixer");
var postcss = require("gulp-postcss");
var uncss = require("postcss-uncss");
var uglify = require("gulp-uglify");
var cache = require("gulp-cache");
var del = require("del");
var runSequence = require("run-sequence");
var rename = require("gulp-rename");
var unused = require("gulp-unused");
var gm = require("gulp-gm");
var newer = require("gulp-newer");
var imgmin = require("gulp-imagemin");
var base64 = require("gulp-base64");

// Pug

// Watchers
gulp.task("watch", function() {
  gulp.watch("app/scss/**/*.scss", ["sass"]);
});

gulp.task("sass", function() {
  return gulp
    .src("app/scss/**/*.scss") // Gets all files ending with .scss in app/scss and children dirs
    .pipe(sass().on("error", sass.logError)) // Passes it through a gulp-sass, log errors to console
    .pipe(gulp.dest("dist/css")) // Outputs it in the css folder
    .pipe(
      browserSync.reload({
        pretty: false,
        // Reloading with Browser Sync
        stream: true
      })
    );
});

// Default
gulp.task("default", function(callback) {
  runSequence(["sass", "css", "watch"]);
});

gulp.task("css", function() {
  var plugins = [autoprefixer({ browsers: ["last 1 version"] }), cssnano()];
  return gulp
    .src("app/css/main.css")
    .pipe(postcss(plugins))
    .pipe(gulp.dest("dist/css"));
});

// Cleaning
gulp.task("clean", function() {
  return del.sync("dist").then(function(cb) {
    return cache.clearAll(cb);
  });
});

gulp.task("clean:dist", function() {
  return del.sync(["dist/**/*"]);
});

// Build Sequences
// ---------------

gulp.task("build", function(callback) {
  runSequence("clean:dist", "sass", ["css"], callback);
});
