var request = require('superagent'),
    expect = require('chai').expect,
    route = require('../../routes/posts'),
    MockServer = require('../server');

describe('Route: posts', function() {
  
  var server = new MockServer();

  before(function(done) {
    server.start(route, done);
  });

  after(function() {
    server.shutdown();
  });

  it('should GET the homepage', function(done) {
    request.get('http://localhost:8082').end(function(err, res) {
      expect(res.status).to.equal(200);
      done();
    });
  });

  it('should show a specific post', function(done) {
    request.get('http://localhost:8082/post/post_1').end(function(err, res) {
      expect(res.status).to.equal(200);
      expect(res.text).to.have.string('<h1>Post 1</h1>');
      done();
    });
  });

  it('should show the page to create a new post', function(done) {
    request.get('http://localhost:8082/post').end(function(err, res) {
      expect(res.status).to.equal(200);
      expect(res.text).to.have.string('<h1>Create a new post</h1>');
      done();
    });
  });

  it('should create a new post', function(done) {
    request.post('http://localhost:8082/post')
      .send({
        title: "My new post",
        body: "Hello world!",
        author: "Ander",
        published: "on",
        tags: "first; hello"
      })
      .end(function(err, res) {
        expect(res.status).to.equal(200);
        expect(res.text).to.have.string('My new post');
        done();
      });
  });
});

