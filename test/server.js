var mongo = require('mongodb'),
    Fixture = require('./fixture'),
    Application = require('../app_config');    

function MockServer(route, done) {

  mongo.MongoClient.connect('mongodb://localhost:27017/labpad-test', function(err, db) {
    var app = new Application().startOnPort(8082);
    new Fixture().loadTo(db);
    route(app, db);
    done();
  });

}

module.exports = MockServer;
