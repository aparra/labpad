var PostRepository = require('../repository/posts'),
    UserRepository = require('../repository/users'),
    SessionHandler = require('./sessions'),
    httpinvoke = require('httpinvoke'),
    showdown = require('showdown'),
    Q = require('q');

function PostController(router, db) {

  var posts = new PostRepository(db);
  var users = new UserRepository(db);
  var sessionHandler = new SessionHandler(db);

  router.get('/', function(req, res, next) {
    Q.all([users.getPrincipal(), posts.getAllPublisheds()]).spread(function(principalUser, publicPosts) {
      res.render('posts/list', {'user': principalUser, 'postsByMonth': publicPosts});
    });
  });

  router.get('/post', sessionHandler.checkAuth, function(req, res, next) {
    res.render('posts/new');
  });

  router.post('/post', sessionHandler.checkAuth, function(req, res, next) {
    httpinvoke(req.body.urlMarkdown, 'GET').then(function(res) {
      return posts.create({
        title: req.body.title,
        body: res.body,
        author: req.body.author,
        date: new Date(),
        published: req.body.published === 'on',
        tags: req.body.tags.split(';'),
        comments: []
      });
    }).then(function() {
      res.redirect('/');
    });
  });

  router.get('/post/:title', function(req, res, next) {
    posts.getByTitle(req.params.title.replace(/_/g, ' ')).then(function(post) {
      var converter = new showdown.Converter();
      post.parsedBody = converter.makeHtml(post.body);
      return post;
    }).then(function(post) {
      res.render('posts/show', {'post': post});
    });
  });

  router.post("/post/:title/comment", function(req, res, next) {
    var title = req.params.title;
    var comment = {author: req.body.author, message: req.body.message};

    posts.addComment(title.replace(/_/g, ' '), comment).then(function() {
      res.redirect('/post/' + title);  
    });
  });
}

module.exports = PostController;
