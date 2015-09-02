var express = require('express'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser');

function App() {

  this.init = function() {
    var app = express();
    
    this.setupViewEngine(app);
    this.setupUseTools(app);

    return app;
  }

  this.setupViewEngine = function(app) {
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');
  }
  
  this.setupUseTools = function(app) {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(require('stylus').middleware(path.join(__dirname, 'public')));
    app.use(express.static(path.join(__dirname, 'public')));
  }

}

module.exports = App;
