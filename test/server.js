var mongo = require('mongodb'),
    Fixture = require('./fixture'),
    Application = require('../app_config');    

function MockServer() {

  var server;
  
  this.start = function(route, done) {
    mongo.MongoClient.connect('mongodb://localhost:27017/labpad-test', function(err, db) {
      var app = new Application().init();
      new Fixture().loadTo(db);

      route(app, db);
      server = app.listen(8082);

      done();
    });
  }

  this.shutdown = function() {
    server.close();
  }
}

module.exports = MockServer;
