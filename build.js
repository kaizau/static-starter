var path = require('path');
var metalsmith = require('metalsmith');
var combine = require('metalsmith-combine');
var branch = require('metalsmith-branch');
var stylus = require('metalsmith-stylus');
var coffee = require('metalsmith-coffee');
var fingerprint = require('metalsmith-fingerprint');
var marked = require('marked')
var jade = require('metalsmith-jade');
var ignore = require('metalsmith-ignore');
var permalinks = require('metalsmith-permalinks');
var dev = require('metalsmith-dev');
//var gzip = require('metalsmith-gzip');

// CONFIG

var stack = metalsmith(__dirname);

stack
  .source('source')
  .destination('public')
  .metadata({
    environment: 'development', // use 'development' to start local server
    projectTitle: 'Project Title',
    googleAnalytics: 'X-XXX-XXXX'
  });

// ASSETS

stack
  .use(combine())
  .use(branch('assets/stylesheets/[^_]**.styl')
    .use(stylus({
      'include css': true
    }))
  )
  .use(branch('assets/javascripts/[^_]**.coffee')
    .use(coffee())
  )
  .use(fingerprint({
    pattern: [
      'assets/images/**',
      'assets/javascripts/**.js',
      'assets/stylesheets/**.css'
    ]
  }));

// CONTENT

marked.setOptions({
  smartypants: true
});

stack
  .use(branch('[^_]**.jade')
    .use(jade({
      useMetadata: true,
      basedir: path.join(__dirname, 'source'),
      pretty: true
    }))
  );

// FINISH

stack
  .use(ignore([
    'assets/bower_components/**',
    'assets/{bower.json,README.md}',
    '**/_*{,/*}'
  ]))
  .use(permalinks());

if (stack.metadata().environment == 'development') {
  dev.watch(stack);
  dev.serve(stack);
} else {
  stack
    .build(function(err) {
      if (err) throw err;
    });
}
