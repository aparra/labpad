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
        db.close();
      });
  });
});

module.exports = router;
