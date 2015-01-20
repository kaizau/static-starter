var path = require('path');
var metalsmith = require('metalsmith');

var include = require('metalsmith-include');
var collections = require('metalsmith-collections');
var templates = require('metalsmith-templates');
var combine = require('metalsmith-combine');
var branch = require('metalsmith-branch');

var stylus = require('metalsmith-stylus');
var coffee = require('metalsmith-coffee');
var fingerprint = require('metalsmith-fingerprint');

var jade = require('metalsmith-jade');
var markdown = require('metalsmith-markdown');
var ignore = require('metalsmith-ignore');

var dev = require('metalsmith-dev');
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

// FUNCTIONALITY

stack
  .use(include())
  .use(collections({
    articles: {}
  }))
  .use(templates({
    engine: 'jade',
    directory: 'templates',
    pretty: true
  }))
  .use(combine());

// ASSETS

stack
  .use(branch('assets/stylesheets/[^_]**.styl')
    .use(stylus())
  )
  .use(branch('assets/javascripts/[^_]**.coffee')
    .use(coffee())
  )
  .use(fingerprint({
    pattern: [
      'assets/javascripts/**.js',
      'assets/stylesheets/**.css'
    ]
  }));

// CONTENT

stack
  .use(branch('[^_]**.jade')
    .use(jade({
      basedir: path.join(__dirname, 'source'),
      useMetadata: true,
      pretty: true
    }))
  )
  .use(branch('[^_]**.md')
    .use(markdown({
      smartypants: true,
      gfm: true,
      tables: true,
      breaks: true
    }))
  );

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
