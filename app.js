var express = require('express'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    mongodb = require('mongodb'); 

mongodb.MongoClient.connect('mongodb://localhost:27017/labpad', function(error, db) {
  if (error) throw error;

  var app = express();
  var routes = require('./routes');

  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(require('stylus').middleware(path.join(__dirname, 'public')));
  app.use(express.static(path.join(__dirname, 'public')));  
  
  // application routes
  routes(app, db);

  app.listen(8080);
  console.log('Express server listening on port 8080');
});
