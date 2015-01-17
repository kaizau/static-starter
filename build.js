var development = false;

var metalsmith = require('metalsmith');

var include = require('metalsmith-include');
var collections = require('metalsmith-collections');
var templates = require('metalsmith-templates');
var branch = require('metalsmith-branch');

var jade = require('metalsmith-jade');
var markdown = require('metalsmith-markdown');
var stylus = require('metalsmith-stylus');
var coffee = require('metalsmith-coffee');

var watch = require('metalsmith-watch');
var serve = require('metalsmith-serve');
var ignore = require('metalsmith-ignore');

var smith = metalsmith(__dirname)
  .source('source')
  .destination('public')

  // FUNCTIONALITY

  .use(include())
  .use(collections({
    articles: {}
  }))
  .use(templates({
    engine: 'jade',
    directory: 'templates',
    pretty: true
  }))

  // CONTENT

  .use(branch('[^_]**.jade')
    .use(jade({
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
  )

  // STYLE

  .use(branch('assets/stylesheets/[^_]**.styl')
    .use(stylus())
  )

  // SCRIPT

  .use(branch('assets/javascripts/[^_]**.coffee')
    .use(coffee())
  );

// DEV SERVER

if (development) {
  smith
    .use(serve())
    .use(watch({
      pattern : '**/*',
      livereload: true
    }));
}

// FINISH

smith
  .use(ignore([
    'assets/bower_components/**',
    'assets/{bower.json,README.md}',
    '**/_*{,/*}'
  ]))
  .build(function(err) {
    if (err) throw err;
  });
