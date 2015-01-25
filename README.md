## Static Prototype Generator

An opinionated static site generator / prototyping framework built on [Metalsmith](http://www.metalsmith.io/).

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

* Add fingerprint variable / function to stylus (metalsmith-stylus)
* Handle adding / deleting files more gracefully (metalsmith-dev)
* Refactor dev into my own plugin
* Polish plugins for open sourcing

### Future

* Automated setup / script
* Minify assets
* Better BodyClass / slug
* Gzip assets
* Deploy script
