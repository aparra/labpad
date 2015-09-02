var request = require('superagent'),
    expect = require('chai').expect,
    route = require('../../routes/users'),
    MockServer = require('../server');

describe('Route: users', function() {

  var server = new MockServer();

  before(function(done) {
    server.start(route, done);
  });

  after(function() {
    server.shutdown();
  })

  it('should show the page to signin', function(done) {
    request.get('http://localhost:8082/user/login').end(function(err, res) {
      console.log(err);
      expect(res.status).to.equal(200);
      expect(res.text).to.have.string('<h1>Sign in to continue to labpad</h1>');
      done();
    });
  });
});
