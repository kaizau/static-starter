var path = require('path');
var marked = require('marked')
var metalsmith = require('metalsmith');
var combine = require('metalsmith-combine');
var branch = require('metalsmith-branch');
var stylus = require('metalsmith-stylus');
var coffee = require('metalsmith-coffee');
var fingerprint = require('metalsmith-fingerprint');
var jade = require('metalsmith-jade');
var ignore = require('metalsmith-ignore');
var permalinks = require('metalsmith-permalinks');
var dev = require('metalsmith-dev');
var gzip = require('metalsmith-gzip');

var debug = function(files, ms, done) {
  console.log(ms);
  done();
};

// CONFIG

var stack = metalsmith(__dirname);
var useServer = true;

marked.setOptions({
  breaks: true,
  smartypants: true
});

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

if (useServer) {
  dev.watch(stack);
  dev.serve(stack);
} else {
  stack
    .build(function(err) {
      if (err) throw err;
    });
}
