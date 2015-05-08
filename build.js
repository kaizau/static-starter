var extend = require('util')._extend;
var path = require('path');
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

var global = {
  environment: 'development',
  assetHost: '//example.cloudfront.net',
  googleAnalytics: '',
  projectTitle: 'Project Title',
  useJquery: false,
  useModernizr: false
};

var helpers = {
  asset: function(file) {
    file = (file.charAt(0) === '/') ? file : '/' + file;
    if (global.environment === 'production') {
      return assetHost + file;
    } else{
      return file;
    }
  },
  bodyClass: function(current) {
    var str;
    if (current !== '/') {
      str = (current.charAt(0) === '/' ? current.slice(1) : current).split(/[/\W]/);
      for (var i in str) {
        str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
      }
      str = str.join('');
    } else {
      str = 'Index';
    }
    return 'Body' + str;
  }
};

// ASSETS

var stack = metalsmith(__dirname);

stack
  .source('source')
  .destination('public')
  .metadata(extend(global, helpers))
  .use(combine())
  //.use(metadata({ varName: '_shared/example.yaml' }))
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
  .use(function(files, ms, done) {
    var url;
    for (var file in files) {
      url = path.join('/', path.dirname(file), path.basename(file, path.extname(file)));
      files[file].current = (url !== '/index') ? url : '/';
    }
    done();
  })
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
