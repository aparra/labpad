var glob = require("glob")
    fs = require('fs'),
    path = require('path'),
    Q = require('q');

function Fixture(db) {
  
  this.load = function() {
    var that = this;
    var promises = [];

    this.loadFixtures().forEach(function(fixture) {
      fixture.collection.forEach(function(data) {
        var deferred = Q.defer();
        db.collection(fixture.name).insert(data, function(error) {
          if (error) {
            deferred.reject(new Error(error));
          } else {
            console.log("insert");
            deferred.resolve();
          }
        });
        
        promises.push(deferred.promise);
      });
    });

    return Q.all(promises);
  }

  this.drop = function(name) {
    var deferred = Q.defer();

    db.collection(name).drop(function(error) {
      if (error) {
        deferred.reject(new Error(error));
      } else {
        deferred.resolve();
      }
    });

    return deferred.promise;
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
