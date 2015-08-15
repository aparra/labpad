var express = require('express');

var router = express.Router();

router.get('/', function(req, res, next) {
  req.execute(function(db) {
    db.collection('posts').aggregate(
      [
        { $match: { published: true } },
        { $group: { _id: { $dateToString: { format: "%m/%Y", date: "$date" } },
           posts: { "$push": "$$ROOT" } }
        }
      ], function(error, posts) {
        db.close();
        res.render('posts/list', {'postsByMonth': posts});
      });
  });
});

router.get('/post', function(req, res, next) {
  res.render('posts/new');
});

router.post('/post', function(req, res, next) {
  var post = {
    title: req.body.title,
    body: req.body.body,
    author: req.body.author,
    date: new Date(),
    published: req.body.published === 'on',
    tags: req.body.tags.split(';')
  };
  
  req.execute(function(db) {
    db.collection('posts').insert(post, function(error, data) {
      db.close();
      res.redirect('/')
    });
  });
});

router.get('/post/:title', function(req, res, next) {
  var title = req.params.title.replace(/_/g, ' ');
  req.execute(function(db) {
    db.collection('posts').findOne({title: {$regex: new RegExp(title, 'i')}}, function(error, post) {
      db.close();
      res.render('posts/show', {'post': post});
    });
  });
});

module.exports = router;
