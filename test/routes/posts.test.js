var http = require('http'),
    route = require('../../routes/posts'),
    MockServer = require('../server');

describe('posts route', function() {

  before(function(done) {
    new MockServer(route, done);
  });

  describe("test", function() {
    sleep = require('sleep');	  
    it('returns something', function(done) {
      http.get('http://localhost:8082', function(err, res) {
	console.log(res);
        done();
      });
    });
  });

});

