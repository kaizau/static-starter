## Static Prototype Generator

An opinionated static site generator / prototyping framework built on [Metalsmith](http://www.metalsmith.io/).

### Install

```sh
# Copy Files
mkdir my-project && cd my-project
git clone git@github.com:kaizau/static-starter.git .
git clone git@github.com:kaizau/assets.git source/assets
rm -rf .git source/assets/.git

# Install packages
npm install
cd source/assets && bower install
```

### TODO

* Allow build to accept passed variables (PROD, BUILD, etc.)  
* Integrate ms-watch 1.0.0 + ms-serve
* Minify assets
* Gzip assets
* Explore using Octopress deploy / another S3 script

* Use ms-metadata only on necessary pages (load via frontmatter?)
* Handle adding / deleting files more gracefully
