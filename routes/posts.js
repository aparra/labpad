var express = require('express'),
    mongodb = require('mongodb');

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
        res.render('posts', { 'postsByMonth': posts });
      });
  });
});

router.get('/post', function(req, res, next) {
  res.render('posts/new.jade');
});

router.post('/post', function(req, res, next) {
  var post = {
    title: req.body.title,
    body: req.body.body,
    author: req.body.author,
    date: new Date(),
    published: req.body.published === 'on'
  };
  
  req.execute(function(db) {
    db.collection('posts').insert(post, function(error, data) {
      db.close();
      res.redirect('/')
    });
  });
});

module.exports = router;
