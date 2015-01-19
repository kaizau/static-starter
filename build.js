var path = require('path');
var metalsmith = require('metalsmith');

var include = require('metalsmith-include');
var collections = require('metalsmith-collections');
var templates = require('metalsmith-templates');
var branch = require('metalsmith-branch');

var stylus = require('metalsmith-stylus');
var coffee = require('metalsmith-coffee');
var fingerprint = require('metalsmith-fingerprint');

var jade = require('metalsmith-jade');
var markdown = require('metalsmith-markdown');

var watch = require('metalsmith-watch');
var serve = require('metalsmith-serve');
var ignore = require('metalsmith-ignore');

var debug = function(files, ms, done) {
  console.log(ms);
  done();
};

var build = metalsmith(__dirname);
var development = false;

// CONFIG

build
  .source('source')
  .destination('public')
  .metadata({
    projectTitle: 'Project Title',
    googleAnalytics: 'X-XXX-XXXX'
  });

// FUNCTIONALITY

build
  .use(include())
  .use(collections({
    articles: {}
  }));
  /*
  .use(templates({
    engine: 'jade',
    directory: 'templates',
    pretty: true
  }));
  */

// ASSETS

build
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

build
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


// DEV SERVER

if (development) {
  build
    .use(serve())
    .use(watch({
      pattern : '**/*',
      livereload: true
    }));
}

// FINISH

build
  .use(ignore([
    'assets/bower_components/**',
    'assets/{bower.json,README.md}',
    '**/_*{,/*}'
  ]))
  .build(function(err) {
    if (err) throw err;
  });
