
module.exports = exports = function(app, db) {
  new require('./posts')(app, db);
  new require('./users')(app, db);
}
