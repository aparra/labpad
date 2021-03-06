var Q = require('q');

function PostRepository(db) {
  var posts = db.collection('posts');

  this.create = function(post) {
    var deferred = Q.defer();

    posts.insert(post, function(error, data) {
      if (error) {
        deferred.reject(new Error(error));
      } else {
        deferred.resolve(data);
      }
    });

    return deferred.promise;
  }

  this.getAllPublisheds = function() {
    var deferred = Q.defer();

    posts.aggregate(
      [
        {$match: {published: true}},
        {$group: {
          _id: {$dateToString: {format: "%m/%Y", date: "$date"}},
          posts: {$push: {title: "$title", tags: "$tags"}}
        }}
      ], 
      function(error, posts) {
        if (error) {
          deferred.reject(new Error(error));
        } else {
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
        deferred.resolve(post);
      }
    });

    return deferred.promise;
  }

  this.addComment = function(title, comment) {
    var deferred = Q.defer();    
    
    posts.update({title: {$regex: new RegExp(title, 'i')}}, {$push: {comments: comment}}, function(error) {
      if (error) {
        deferred.reject(new Error(error));
      } else {
        deferred.resolve();
      }
    });

    return deferred.promise;
  }
}

module.exports = PostRepository;
