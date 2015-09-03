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
      expect(res.status).to.equal(200);
      expect(res.text).to.have.string('<h1>Sign in to continue to labpad</h1>');
      done();
    });
  });

  it('should signin using valid user', function(done) {
    server.mockGet("/", function(req, res, next) {
      res.json({body: "mock index"});
    });

    request.post('http://localhost:8082/user/login')
      .send({
        email: "ander.pp@gmail.com",
        password: "123qwe"  
      })
      .end(function(err, res) {
        expect(res.status).to.equal(200);
        expect(res.text).to.have.string('{"body":"mock index"}');
        done();
      });
  });

  it('should not signin using invalid user', function(done) {
    request.post('http://localhost:8082/user/login')
      .send({
        email: "invalid@gmail.com",
        password: "123qwe"  
      })
      .end(function(err, res) {
        expect(res.status).to.equal(200);
        expect(res.text).to.have.string('Invalid user and/or password');
        done();
      });
  });
});
