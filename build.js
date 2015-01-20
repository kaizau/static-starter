var path = require('path');
var metalsmith = require('metalsmith');

var branch = require('metalsmith-branch');
var combine = require('metalsmith-combine');
var stylus = require('metalsmith-stylus');
var coffee = require('metalsmith-coffee');
var uglify = require('metalsmith-uglify');
var fingerprint = require('metalsmith-fingerprint');

var markdown = require('metalsmith-markdown');
var jade = require('metalsmith-jade');
var templates = require('metalsmith-templates');
var ignore = require('metalsmith-ignore');

var dev = require('metalsmith-dev');
var gzip = require('metalsmith-gzip');
var debug = function(files, ms, done) {
  console.log(ms);
  done();
};

// CONFIG

var stack = metalsmith(__dirname);
var useServer = true;

stack
  .source('source')
  .destination('public')
  .metadata({
    environment: 'development',
    projectTitle: 'Project Title',
    googleAnalytics: 'X-XXX-XXXX'
  });

// ASSETS

stack
  .use(combine())
  .use(branch('assets/stylesheets/[^_]**.styl')
    .use(stylus())
  )
  .use(branch('assets/javascripts/[^_]**.coffee')
    .use(coffee())
  )
  .use(uglify({
    filter: ['assets/javascripts/[^_]**.js', '!**/*.min.js'],
    preserveComments: 'some'
  }))
  .use(fingerprint({
    pattern: [
      'assets/javascripts/**.js',
      'assets/stylesheets/**.css'
    ]
  }));

// CONTENT

stack
  .use(branch('[^_]**.md')
    .use(markdown({
      smartypants: true,
      gfm: true,
      tables: true
    }))
  )
  .use(branch('[^_]**.jade')
    .use(jade({
      basedir: path.join(__dirname, 'source'),
      useMetadata: true
    }))
  )
  .use(templates({
    engine: 'jade',
    basedir: path.join(__dirname, 'source'),
    directory: 'source/shared',
    locals: stack.metadata()
  }));

// FINISH

stack
  .use(ignore([
    'assets/bower_components/**',
    'assets/{bower.json,README.md}',
    '**/_*{,/*}'
  ]));

if (useServer) {
  dev.watch(stack);
  dev.serve(stack);
} else {
  stack
    .build(function(err) {
      if (err) throw err;
    });
}
