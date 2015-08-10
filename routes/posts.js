var express = require('express'),
    mongodb = require('mongodb');

var router = express.Router();

router.get('/', function(req, res, next) {
  req.execute(function(db) {
    db.collection('posts').find().toArray(function(error, posts) {
      res.render('posts', { 'posts': posts });
      db.close();
    });
  });
});

module.exports = router;
