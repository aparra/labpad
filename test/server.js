var mongo = require('mongodb'),
    Fixture = require('./fixture'),
    Application = require('../app_config');    

function MockServer() {
  var app, server, isCookieEnabled;
  
  this.start = function(route, done) {
    var that = this;
    mongo.MongoClient.connect('mongodb://localhost:27017/labpad-test', function(err, db) {
      app = new Application().init();
      new Fixture().loadTo(db);
      
      that.requestCookie(app);
      route(app, db);
      server = app.listen(8082);
      
      console.log("server started and listening on 8082");
      done();
    });
  }

  this.requestCookie = function() {
    app.use(function(req, res, next) {
      if (isCookieEnabled) {
        req.cookies['session'] = "dc016f862f3963134f051ff1f102dc5d3a2443b1";
        isCookieEnabled = false;
      }
      next();
    });
  }

  this.enabledFakeLogin = function() {
    isCookieEnabled = true;
  }

  this.mockGet = function(path, action) {
    app.get(path, action);
  }

  this.shutdown = function() {
    server.close();
  }
}

module.exports = MockServer;
