var glob = require("glob")
    fs = require('fs'),
    path = require('path');

function Fixture() {
  
  this.loadTo = function(db) {
    this.loadFixtures().forEach(function(fixture) {
      db.collection(fixture.name).drop();
      fixture.collection.forEach(function(data) {
        db.collection(fixture.name).insert(data);
      });
    });
  }

  this.loadFixtures = function() {
    var fixtures = new Array();

    glob.sync("./test/fixtures/*.json").forEach(function(file) {
      var data = fs.readFileSync(file, "utf8")
      var content = JSON.parse(data, function(key, value) {
        if (key == 'date') return new Date(value);
        return value;
      });

      fixtures.push({
        name: path.basename(file).replace('.json', ''),
        collection: content
      });
    });

    return fixtures;
  }
}

module.exports = Fixture;
