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

  it.skip('should GET the homepage', function(done) {
    request.get('http://localhost:8082/').end(function(err, res) {
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
    server.enabledFakeLogin();
    request.get('http://localhost:8082/post').end(function(err, res) {
      expect(res.status).to.equal(200);
      expect(res.text).to.have.string('<h1>Create a new post</h1>');
      done();
    });
  });

  it('should not show the page to create a new post when user is not logged', function(done) {
    server.mockGet("/user/login", function(req, res, next) {
      res.json({body: "mock login page"});
    });

    request.get('http://localhost:8082/post').end(function(err, res) {
      expect(res.status).to.equal(200);
      expect(res.text).to.have.string('{"body":"mock login page"}');
      done();
    });
  });  

  it.skip('should create a new post', function(done) {
    server.enabledFakeLogin();	  
    request.post('http://localhost:8082/post')
      .send({
        title: "My new post",
        urlMarkdown: "https://raw.githubusercontent.com/aparra/follower_maze/master/README.md",
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

  it('should not create a new post when user is not logged', function(done) {
    server.mockGet("/user/login", function(req, res, next) {
      res.json({body: "mock login page"});
    });
    
    request.post('http://localhost:8082/post')
      .send({
        title: "My new post",
        urlMarkdown: "https://raw.githubusercontent.com/aparra/follower_maze/master/README.md",
        author: "Ander",
        published: "on",
        tags: "first; hello"
      })
      .end(function(err, res) {
        expect(res.status).to.equal(200);
        expect(res.text).to.have.string('{"body":"mock login page"}');
        done();
      });
  });
});

