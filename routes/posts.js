var PostRepository = require('../repository/posts');

function PostController(router, db) {
  var posts = new PostRepository(db);

  router.get('/', function(req, res, next) {
    posts.getAllPublisheds().then(function(publicPosts) {
      res.render('posts/list', {'postsByMonth': publicPosts});
    });
  });
  
  router.get('/post', function(req, res, next) {
    res.render('posts/new');
  });

  router.post('/post', function(req, res, next) {
    posts.create({
      title: req.body.title,
      body: req.body.body,
      author: req.body.author,
      date: new Date(),
      published: req.body.published === 'on',
      tags: req.body.tags.split(';')
    }).then(function() {
      res.redirect('/')
    });
  });

  router.get('/post/:title', function(req, res, next) {
    posts.getByTitle(req.params.title.replace(/_/g, ' ')).then(function(post) {
      res.render('posts/show', {'post': post});
    });
  });
}

module.exports = PostController;
