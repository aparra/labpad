var Q = require('q');

function PostRepository(db) {
  var posts = db.collection('posts');

  this.create = function(post) {
    var deferred = Q.defer();

    posts.insert(post, function(error, data) {
      if (error) {
        deferred.reject(new Error(error));
      } else {
        console.log("insert " + data);	      
        deferred.resolve(data);
      }
    });

    return deferred.promise;
  }

  this.getAllPublisheds = function() {
    console.log("call getAllPublisheds");
    var deferred = Q.defer();

    posts.aggregate(
      [
        {"$match": {"published": true}},
        {"$group": {"_id": {"$dateToString": {"format": "%m/%Y", "date": "$date"}}, "posts": {"$push": "$$ROOT"}}}
      ], 
      function(error, posts) {
        if (error) {
          console.log("Aggregation error: " + error);
          deferred.reject(new Error(error));
        } else {
          console.log("Posts" + posts);	  	
          deferred.resolve(posts);
        }
    });

    return deferred.promise;
  }

  this.getByTitle = function(title) {
    var deferred = Q.defer();

    posts.findOne({title: {$regex: new RegExp(title, 'i')}}, function(error, post) {
      if (error) {
        deferred.reject(new Error(error));
      } else {
        console.log(post);
        deferred.resolve(post);
      }
    });

    return deferred.promise;
  }
}

module.exports = PostRepository;
