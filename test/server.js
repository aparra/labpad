var MongoMock = require('mongomock'),
    Application = require('../app_config');

function MockServer(route) {
  var app = new Application().startOnPort(8082);
  route(app, new MongoMock({posts: []}));
}

module.exports = MockServer;
