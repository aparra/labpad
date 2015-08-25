var http = require('http'),
    route = require('../../routes/posts'),
    MockServer = require('../server');
 
describe('posts route', function() {

  var server = new MockServer(route);

  describe("test", function() {
    it('returns something', function(done) {
      http.get('/', function(err, res) {
	console.log(res);
        done();
      });
    });
  });

});

