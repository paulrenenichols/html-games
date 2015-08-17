var     parseArgs   = require('minimist')
    ,   gulp        = require('gulp')
    ,   jade        = require('gulp-jade')
    ,   sass        = require('gulp-sass')
    ,   run         = require('gulp-run')
    ,   util        = require('gulp-util')
    ,   debug       = require('gulp-debug')
    ,   jshint      = require('gulp-jshint')
    ,   stylish     = require('jshint-stylish')
    ,   nodeUtil    = require('util')
    ,   through2    = require('through2')
    ,   npm         = require('npm')
    ,   _           = require('lodash')
    ,   Q           = require('q')
    ,   mocha       = require('gulp-mocha')
    ,   del         = require('del')
    ,   vinylPaths  = require('vinyl-paths')
    ,   karmaServer = require('karma').Server
    ,   fs          = require('fs');

var buildPackageJson = require('./source/server/package.json');

var projectPackageJson = require('./package.json');

var consoleStream = through2.obj(function(file, encoding, cb) {
  file.contents.pipe(process.stdout);

  this.push(file);
  cb();
});


var buildConfig = {
  
  frontend: {
    index: {
      src: 'source/frontend/html/index.jade',
      dest: 'build/public',
      locals: {
        title: "HTML5 Games!"
      }
    },
    games: {
      src: 'source/frontend/html/games/**/*.jade',
      dest: 'build/public/games',
      locals: {
        bubbleShooter: {
          title: "Bubble Shooter!"
        }
      }
    },
    js: {
      project: {
        src: 'source/frontend/js/**/*.js',
        dest: 'build/public/js'
      },
      test: {
        src: 'test/frontend/**/*.js',
        dest: null
      },
      vendor: {
        src: 'source/frontend/vendor/js/development/**/*.js',
        dest: 'build/public/vendor/js'
      }
    },
    css: {
      project: {
        src: 'source/frontend/css/**/*.scss',
        dest: 'build/public/css'
      },
      vendor: {
        src: 'source/frontend/vendor/css/**/*.scss'
      }
    },
    img: {
      src: 'source/frontend/img/**/*',
      dest: 'build/public/img'
    },
    test: {
      karmaConfigPath: '/test/karma.conf.js'
    }
  },

  server: {
    js: {
      src: 'source/server/**/*.js'
    },
    test: {
      src: 'test/server/**/*.js'
    },
    all: 'source/server/**/*'
  }
};



/*
 *
 *  Server Tasks
 *
 */

// jsHint task for server code
gulp.task('lint-server', function () {
  
  return gulp.src(buildConfig.server.js.src)
    .pipe(jshint({ 
      laxcomma: true
    }))
    .pipe(jshint.reporter(stylish))
    pipe(jshint.reporter('fail'));

});

// mocha tests for server
gulp.task('test-server', ['lint-server'], function (done) {
  return gulp.src(buildConfig.server.test.src, {read: false})
          .pipe(mocha({reporter: 'spec'}));
});

function clean() {
  return gulp.src('build', {read: false})
    .pipe(vinylPaths(del));
}

// Task that removes build folder
gulp.task('clean', function () {
  return clean();
})

function buildServer () {
  return gulp.src(buildConfig.server.all)
    .pipe(gulp.dest('build'));
}

// Task that copies server files into build directory
gulp.task('build-server', ['clean', 'test-server'], function () {
  return buildServer();
});



/*
 *
 *  Frontend Tasks
 *
 */

// jsHint task for frontend code
gulp.task('lint-frontend', function () {
  
  return gulp.src(buildConfig.frontend.js.project.src)
    .pipe(jshint({ 
      browser: true,
      laxcomma: true
    }))
    .pipe(jshint.reporter(stylish))
    pipe(jshint.reporter('fail'));

});

// karma-mocha tests for frontend
gulp.task('test-frontend', ['lint-frontend'], function (done) {
  new karmaServer({
    configFile: __dirname + buildConfig.frontend.test.karmaConfigPath,
    singleRun: true
  }, done).start();
});

// Frontend Build Tasks

gulp.task('build-frontend-copy-img', ['clean'], function () {
  return gulp.src(buildConfig.frontend.img.src)
    .pipe(gulp.dest(buildConfig.frontend.img.dest));
});

gulp.task('build-frontend-css', ['clean'], function () {

  util.log(buildConfig.frontend.css.project.src, buildConfig.frontend.css.vendor.src);
  util.log(buildConfig.frontend.css.project.dest);
  return gulp.src([buildConfig.frontend.css.vendor.src, buildConfig.frontend.css.project.src])
    .pipe(sass())
    .pipe(gulp.dest(buildConfig.frontend.css.project.dest));

});

gulp.task('build-frontend-index-html', ['clean'], function () {
  
  return gulp.src(buildConfig.frontend.index.src)
    .pipe(jade({
      pretty: true,
      locals: buildConfig.frontend.index.locals
    }))
    .pipe(gulp.dest(buildConfig.frontend.index.dest));

});

gulp.task('build-frontend-games-html', ['clean'], function () {
  
  return gulp.src(buildConfig.frontend.games.src)
    .pipe(jade({
      pretty: true,
      locals: buildConfig.frontend.games.locals
    }))
    .pipe(gulp.dest(buildConfig.frontend.games.dest));

});

gulp.task('build-frontend-js-vendor', ['clean'], function () {
  
  return gulp.src(buildConfig.frontend.js.vendor.src)
    .pipe(gulp.dest(buildConfig.frontend.js.vendor.dest));

});

gulp.task('build-frontend-js-project', ['test-frontend', 'clean'], function () {
  
  return gulp.src(buildConfig.frontend.js.project.src)
    .pipe(gulp.dest(buildConfig.frontend.js.project.dest));

});

// Main frontend build task
gulp.task('build-frontend', ['build-frontend-index-html', 'build-frontend-games-html', 'build-frontend-js-project', 'build-frontend-js-vendor', 'build-frontend-css', 'build-frontend-copy-img']);

// Build all, don't npm install
gulp.task('build-all', ['build-frontend', 'build-server'], function(done) { done(); });


gulp.task('install', ['build-all'], function (cb) {
  var buildPackageJsonWithPrefix = {
    prefix: 'build'
  };

  _.merge(buildPackageJsonWithPrefix, buildPackageJson);

  npm.load(buildPackageJsonWithPrefix, function () {
    npm.commands.install(function (error) {
      if (error) {
        cb(error);
      }
      else {
        cb();
      }
    });
  });
})


gulp.task('start', ['stop'], function (cb) {
 
  var runDirectoryPrefix = {
    prefix: 'build'
  };

  _.merge(runDirectoryPrefix, buildPackageJson);

  npm.load(runDirectoryPrefix, function () {
    npm.commands.start(function (error) {
      if (error) {
        cb(error);
      }
      else {
        cb();
      }
    });
  });
});

gulp.task('stop', function (cb) {
 
  var runDirectoryPrefix = {
    prefix: 'build'
  };

  _.merge(runDirectoryPrefix, buildPackageJson);

  npm.load(runDirectoryPrefix, function () {
    npm.commands.stop(function (error) {
      if (error) {
        cb(error);
      }
      else {
        cb();
      }
    });
  });
});

gulp.task('watch-frontend', ['install'], function () {
  gulp.watch([buildConfig.frontend.js.project.src,
              buildConfig.frontend.js.test.src,
              buildConfig.frontend.index.src,
              buildConfig.frontend.css.project.src], ['build-frontend']);
});


