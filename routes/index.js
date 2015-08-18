var PostController = require('./posts');

module.exports = exports = function(app, db) {
  new PostController(app, db);
}
