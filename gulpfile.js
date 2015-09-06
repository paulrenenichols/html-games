// # gulpfile.js

// ### Requires

// This is where the build dependencies get loaded
var     parseArgs   = require('minimist')
    ,   gulp        = require('gulp')
    ,   jade        = require('gulp-jade')
    ,   sass        = require('gulp-sass')
    ,   run         = require('gulp-run')
    ,   util        = require('gulp-util')
    ,   debug       = require('gulp-debug')
    ,   jshint      = require('gulp-jshint')
    ,   gls         = require('gulp-live-server')
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
    ,   fs          = require('fs')
    ,   browserify  = require('browserify')
    ,   source      = require('vinyl-source-stream')
    ,   buffer      = require('vinyl-buffer')
    ,   uglify      = require('gulp-uglify')
    ,   sourcemaps  = require('gulp-sourcemaps')
    ,   es          = require('event-stream')
    ,   docco       = require('docco');



// Load the package.json file, which is used in building.
var projectPackageJson = require('./package.json');

// ### Build Configuration

// This is where we store all of the build configuration information,
// including paths to files, destination directories, and jade locals data.
var buildConfig = {
  
// **Front End configuration block**
  frontend: {

// **index.jade configuration**
    index: {
      src: 'source/frontend/html/index.jade',
      dest: 'build/public',
      locals: {
        title: "HTML5 Games!"
      }
    },

// **game jade files configuration**
    games: {
      src: 'source/frontend/html/games/**/*.jade',
      dest: 'build/public/games',
      locals: {
        bubbleShooter: {
          title: "Bubble Shooter!"
        }
      }
    },

// **javascript configuration**
    js: {

// **front end code**
      project: {
        src: 'source/frontend/js/**/*.js',
        dest: 'build/public/js'
      },

// **front end tests**
      test: {
        src: 'test/frontend/**/*.js',
        dest: null
      },

// **[Browserify](https://github.com/substack/node-browserify) Bundles configuration**
//
// These *bundles* options objects are formatted for [buildBrowserifyBundle](#buildBrowserifyBundle)
// and used by [build-frontend-js-bundles](#build-frontend-js-bundles).
      bundles: {

// **index.js bundle**
        index: {
          entries: 'source/frontend/js/index.js',
          require: [],
          external: ['jquery', 'q', 'lodash'],
          output: 'index.js',
          dest: 'build/public/js'
        },

// **engine.js bundle**
        engine: {
          entries: 'source/frontend/js/engine/engine.js',
          require: [
            {
              file: './source/frontend/js/engine/vector2d.js',
              expose: 'vector2d'
            }
          ],
          external: [],
          output: 'engine.js',
          dest: 'build/public/js/engine'
        },

// **bubble-shooter.js bundle**
        bubbleShooter: {
          entries: 'source/frontend/js/games/bubble-shooter.js',
          require: [],
          external: ['jquery', 'q', 'lodash', 'vector2d'],
          output: 'bubble-shooter.js',
          dest: 'build/public/js/games'
        },

// **vendor.js bundle**
        vendor: {
          entries: 'source/frontend/vendor/js/development/vendor.js',
          require: ['jquery', 'q', 'lodash'],
          external: [],
          output: 'vendor.js',
          dest: 'build/public/vendor/js'
        }
      }
    },

// **css build configuration**
//
// *we currently build scss*
    css: {
      project: {
        src: 'source/frontend/css/**/*.scss',
        dest: 'build/public/css'
      },
      vendor: {
        src: 'source/frontend/vendor/css/**/*.scss'
      }
    },

// **image build configuration**
    img: {
      src: 'source/frontend/img/**/*',
      dest: 'build/public/img'
    },

// **frontend test configuration**
    test: {
      karmaConfigPath: '/test/karma.conf.js',
      all: 'test/**/*'
    },
    all: "source/frontend/**/*"
  },

// **Server Configuration Block**
  server: {
    js: {
      src: 'source/server/**/*.js'
    },
    test: {
      src: 'test/server/**/*.js'
    },
    all: 'source/server/**/*'
  },
  allSource: "source/**/*",
  allTest: "test/**/*"
};


// ### Helper Functions

// <span id="clean"><span>
// **clean** 
//
// Deletes a folder (path) and its contents.
// Used by the [clean-server](#clean-server) and [clean-frontend](#clean-frontend) gulp tasks.
function clean(path) {
  return gulp.src(path, {read: false})
    .pipe(vinylPaths(del));
}

// <span id="buildBrowserifyBundle"></span>
// **buildBrowserifyBundle** 
//
// Builds a [Browserify](https://github.com/substack/node-browserify) bundle based on `bundleOptions`.
// Used by [build-frontend-js-bundles](#build-frontend-js-bundles)
function buildBrowserifyBundle(bundleOptions) {
    var b = browserify({
      entries: bundleOptions.entries,
      debug: true
    });

    b.require(bundleOptions.require);
    b.external(bundleOptions.external);

    return b.bundle()
      .pipe(source(bundleOptions.output))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(bundleOptions.dest));
}

// <span id="buildServer"><span>
// **buildServer** 
//
// Copies the http server files into the build directory.
//
// Used by the [clean-server](#clean-server) and [clean-frontend](#clean-frontend) gulp tasks.
function buildServer () {
  return gulp.src(buildConfig.server.all)
    .pipe(gulp.dest('build'));
}


// <span id="generateDocumentation"><span>
// **generateDocumentation** 
//
// Generates documentation from source using [Docco](http://jashkenas.github.io/docco/).
//
// Used by the [gendoc](#gendoc) task.
function generateDocumentation(inputPath, outputPath) {
  
  var arguments = ['docco', '-o', outputPath, inputPath];
  docco.run(arguments);
}

// ## Gulp Tasks

// ### Documentation Tasks

// <span id="gendoc"><span>
// **gendoc** 
//
// Generates documentation from source using [Docco](http://jashkenas.github.io/docco/).
//
// Uses the [generateDocumentation](#generateDocumentation) helper function.
//
// To run this task, type `gulp gendoc` on the command line.
gulp.task('gendoc', function () {

  generateDocumentation('gulpfile.js', 'docs');
  return gulp.src('index.jade')
    .pipe(jade({
      pretty: true,
    }))
    .pipe(gulp.dest('./'));
});

// ### Server Tasks

// <span id="lint-server"></span>
// **lint-server** 
//
// This task lints server JavaScript code.
//
// To run this task, type `gulp lint-server` on the command line.
gulp.task('lint-server', function () {
  
  return gulp.src(buildConfig.server.js.src)
    .pipe(jshint({ 
      laxcomma: true
    }))
    .pipe(jshint.reporter(stylish))
    pipe(jshint.reporter('fail'));

});

// <span id='test-server'></span>
// **test-server**
//
// This task runs tests against the project's server code.
//
// To run this task, type `gulp test-server` on the command line.
//
// This task depends on [lint-server](#lint-server).
gulp.task('test-server', ['lint-server'], function (done) {
  return gulp.src(buildConfig.server.test.src, {read: false})
          .pipe(mocha({reporter: 'spec'}));
});


// <span id='clean-server'></span>
// **clean-server**
//
// This task deletes the contents of the build folder.
//
// To run this task, type `gulp clean-server` on the command line.
//
// Uses the [clean](#clean) helper function.
gulp.task('clean-server', function () {
  return clean('build/*');
})

// <span id='build-server'></span>
// **build-server**
//
// This task copies the http server files into the build directory.
//
// To run this task, type `gulp build-server` on the command line.
//
// Uses the [buildServer](#buildServer) helper function.
gulp.task('build-server', ['clean-server', 'test-server'], function () {
  return buildServer();
});



// ### Frontend Tasks

// <span id='clean-frontend'></span>
// **clean-frontend**
//
// This task deletes frontend build artifacts from the build folder.
//
// To run this task, type `gulp clean-frontend` on the command line.
//
// Uses the [clean](#clean) helper function.
gulp.task('clean-frontend', function () {
  return clean('build/public/*');
});

// <span id='lint-frontend'></span>
// **lint-frontend**
//
// This task lints frontend JavaScript code.
//
// To run this task, type `gulp lint-frontend` on the command line.
gulp.task('lint-frontend', function () {
  
  return gulp.src(buildConfig.frontend.js.project.src)
    .pipe(jshint({ 
      browser: true,
      laxcomma: true
    }))
    .pipe(jshint.reporter(stylish))
    pipe(jshint.reporter('fail'));

});

// <span id='test-frontend'></span>
// **test-frontend**
//
// This task tests frontend JavaScript code.
//
// To run this task, type `gulp test-frontend` on the command line.
//
// Depends on [lint-frontend](#lint-frontend).
gulp.task('test-frontend', ['lint-frontend'], function (done) {
  new karmaServer({
    configFile: __dirname + buildConfig.frontend.test.karmaConfigPath,
    singleRun: true
  }, done).start();
});


// <span id='build-frontend-copy-img'></span>
// **build-frontend-copy-img**
//
// This task copies image assets into the build folder.
//
// To run this task, type `gulp build-frontend-copy-img` on the command line.
//
// Depends on [clean-frontend](#clean-frontend).
gulp.task('build-frontend-copy-img', ['clean-frontend'], function () {
  return gulp.src(buildConfig.frontend.img.src)
    .pipe(gulp.dest(buildConfig.frontend.img.dest));
});


// <span id='build-frontend-css'></span>
// **build-frontend-css**
//
// This task builds css from scss source.
//
// To run this task, type `gulp build-frontend-css` on the command line.
//
// Depends on [clean-frontend](#clean-frontend).
gulp.task('build-frontend-css', ['clean-frontend'], function () {

  util.log(buildConfig.frontend.css.project.src, buildConfig.frontend.css.vendor.src);
  util.log(buildConfig.frontend.css.project.dest);
  return gulp.src([buildConfig.frontend.css.vendor.src, buildConfig.frontend.css.project.src])
    .pipe(sass())
    .pipe(gulp.dest(buildConfig.frontend.css.project.dest));

});


// <span id='build-frontend-index-html'></span>
// **build-frontend-index-html**
//
// This task builds index.html from index.jade.  This file is the front page
// of our games site.
//
// To run this task, type `gulp build-frontend-index-html` on the command line.
//
// Depends on [clean-frontend](#clean-frontend).
gulp.task('build-frontend-index-html', ['clean-frontend'], function () {
  
  return gulp.src(buildConfig.frontend.index.src)
    .pipe(jade({
      pretty: true,
      locals: buildConfig.frontend.index.locals
    }))
    .pipe(gulp.dest(buildConfig.frontend.index.dest));

});


// <span id='build-frontend-games-html'></span>
// **build-frontend-games-html**
//
// This task builds html pages for our games from their jade source.
//
// To run this task, type `gulp build-frontend-games-html` on the command line.
//
// Depends on [clean-frontend](#clean-frontend).
gulp.task('build-frontend-games-html', ['clean-frontend'], function () {
  
  return gulp.src(buildConfig.frontend.games.src)
    .pipe(jade({
      pretty: true,
      locals: buildConfig.frontend.games.locals
    }))
    .pipe(gulp.dest(buildConfig.frontend.games.dest));

});

// <span id="build-frontend-js-bundles"></span>
// **build-frontend-js-bundles**
//
// This task builds all of our [Browserify](https://github.com/substack/node-browserify)
// bundles.
//
// To run this task, type `gulp build-frontend-js-bundles` on the command line.
//
// It uses the [buildBrowserifyBundle](#buildBrowserifyBundle) helper function to accomplish this.
//
// Depends on [clean-frontend](#clean-frontend) and [test-frontend](#test-frontend) tasks.
gulp.task('build-frontend-js-bundles', ['test-frontend', 'clean-frontend'], function () {
  
  var tasks = _.map(buildConfig.frontend.js.bundles, function (bundleOptions) {
    return buildBrowserifyBundle(bundleOptions);
  });

  // create a merged stream
  return es.merge.apply(null, tasks);
});

// <span id="build-frontend"></span>
// **build-frontend**
//
// This task runs all frontend build tasks.
//
// To run this task, type `gulp build-frontend` on the command line.
//
// Depends on the following tasks:
// * [build-frontend-index-html](#build-frontend-index-html)
// * [build-frontend-games-html](#build-frontend-games-html)
// * [build-frontend-js-bundles](#build-frontend-js-bundles)
// * [build-frontend-css](#build-frontend-css)
// * [build-frontend-copy-img](#build-frontend-copy-img)
gulp.task('build-frontend', ['build-frontend-index-html', 'build-frontend-games-html', 'build-frontend-js-bundles', 'build-frontend-css', 'build-frontend-copy-img']);

// <span id="build-all"></span>
// **build-all**
//
// This task runs all server and frontend build tasks.
//
// To run this task, type `gulp build-all` on the command line.
//
// Depends on the following tasks:
// * [build-frontend](#build-frontend)
// * [build-server](#build-server)
gulp.task('build-all', ['build-frontend', 'build-server'], function(done) { done(); });


// <span id="install"></span>
// **install**
//
// This task installs node_modules in the build folder for deployment.
//
// To run this task, type `gulp install` on the command line.
//
// Depends on the following tasks:
// * [build-all](#build-all)
gulp.task('install', ['build-all'], function (cb) {
  var buildPackageJsonWithPrefix = {
    prefix: 'build'
  };

  _.merge(buildPackageJsonWithPrefix, projectPackageJson);

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
});

// <span id="serve"></span>
// **serve**
//
// This tasks runs the express server in our build directory, and
// then continuously rebuilds our frontend code as we make modifications.
//
// [Gulp Live Server](https://github.com/gimm/gulp-live-server)
// starts our express server and also starts a websocket server to
// provide automatic [LiveReload](https://github.com/livereload/LiveReload) 
// broswer refreshes as we modify our code.
//
// To run this task, type `gulp serve` on the command line.
//
// Depends on the following tasks:
// * [build-all](#build-all)
gulp.task('serve', ['build-all'], function() {
  
  // run the server
  var server = gls.new('build/app.js', 
    {
      env: {
        NODE_ENV: 'development',
        DEBUG: 'html-games:*, express:*'
      }
  });

  server.start('build/bin/www');

  // notify the server of file changes
  gulp.watch(['build/public/**/*'], function (file) {
    server.notify.apply(server, [file]);
  });

  // watch the frontend source and tests, rebuild as they are modified.
  gulp.watch([buildConfig.frontend.all, buildConfig.frontend.test.all], ['build-frontend']);
});


// <span id="default"></span>
// **default**
//
// This is the default gulp task.  All it does is run [serve](#serve).
//
// To run this task, type `gulp` on the command line.
//
// Depends on the following tasks:
// * [serve](#serve)
gulp.task('default', ['serve']);


