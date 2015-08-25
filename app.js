var mongodb = require('mongodb'),
    Application = require('./app_config');

mongodb.MongoClient.connect('mongodb://localhost:27017/labpad', function(error, db) {
  if (error) throw error;
  
  var app = new Application().startOnPort(8080);
  var routes = require('./routes');
  routes(app, db);
});
