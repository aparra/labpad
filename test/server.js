var mongo = require('mongodb'),
    Fixture = require('./fixture'),
    Application = require('../app_config');    

function MockServer() {
  var app;
  var server;
  
  this.start = function(route, done) {
    mongo.MongoClient.connect('mongodb://localhost:27017/labpad-test', function(err, db) {
      app = new Application().init();
      new Fixture().loadTo(db);

      route(app, db);
      server = app.listen(8082);

      done();
    });
  }

  this.mockGet = function(path, action) {
    app.get(path, action);
  }

  this.shutdown = function() {
    server.close();
  }
}

module.exports = MockServer;
