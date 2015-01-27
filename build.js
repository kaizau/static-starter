var metalsmith = require('metalsmith');
var combine = require('metalsmith-combine');
var stylus = require('metalsmith-stylus');
var coffee = require('metalsmith-coffee');
var fingerprint = require('metalsmith-fingerprint');
var marked = require('marked')
var jade = require('metalsmith-jade');
var ignore = require('metalsmith-ignore');
var permalinks = require('metalsmith-permalinks');
var local = require('metalsmith-dev');
//var gzip = require('metalsmith-gzip');

// CONFIG

var stack = metalsmith(__dirname);

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
  .use(ignore([
    'assets/bower_components/**{,/.*}',
    'assets/{bower.json,README.md}',
    '**/.DS_Store',
    '**/_*{,/**,/**/.*}'
  ]))
  .use(fingerprint({
    pattern: 'assets/images/**',
    exclude: true
  }))
  .use(stylus({
    'include css': true
  }))
  .use(coffee())
  .use(fingerprint({
    pattern: [
      'assets/javascripts/**.js',
      'assets/stylesheets/**.css'
    ],
    exclude: true
  }));

// CONTENT

marked.setOptions({
  smartypants: true
});

stack
  .use(jade({
    useMetadata: true,
    basedir: stack.path('source'),
    pretty: true
  }))
  .use(permalinks({
    relative: false
  }));

// FINISH

local.watch(stack);
local.serve(stack);
