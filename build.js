var metalsmith = require('metalsmith');
var combine = require('metalsmith-combine');
var metadata = require('metalsmith-metadata');
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
    asset: function(path) {
      path = (path[0] === '/') ? path : '/' + path;
      if (global.environment === 'production' && global.assetHost) {
        return global.assetHost + path;
      } else {
        return path;
      }
    }
  });

// ASSETS

stack
  .use(combine())
  .use(metadata({
    global: '_shared/global.yaml'
  }))
  .use(ignore([
    'assets/bower_components/**{,/.*}',
    'assets/{bower.json,README.md}',
    '**/_*{,/**,/**/.*}',
    '**/.DS_Store'
  ]))
  .use(fingerprint({
    pattern: 'assets/images/**'
  }))
  .use(stylus({
    'include css': true
  }))
  .use(coffee())
  .use(fingerprint({
    pattern: [
      'assets/javascripts/**.js',
      'assets/stylesheets/**.css'
    ]
  }))
  .use(ignore([
    'assets/**',
    '!assets/**/*-*[0-9]*.*'
  ]));

// CONTENT

marked.setOptions({
  gfm: true,
  tables: true,
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
