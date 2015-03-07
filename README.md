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

* Minify assets
* Better BodyClass / slug
* Gzip assets
* Split build.js into serve and pack
* Handle adding / deleting files more gracefully (metalsmith-dev)
