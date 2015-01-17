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
    pretty: true
  }))

  // CONTENT

  .use(branch('*.jade')
    .use(jade({
      pretty: true
    }))
  )

  .use(branch('*.md')
    .use(markdown({
      smartypants: true,
      gfm: true,
      tables: true,
      breaks: true
    }))
  )

  // STYLE

  .use(branch('*.styl')
    .use(stylus())
  )

  // SCRIPT

  .use(branch('*.coffee')
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

smith.build(function(err) {
  if (err) throw err;
});
