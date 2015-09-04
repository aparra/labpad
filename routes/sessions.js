var SessionRepository = require('../repository/sessions');

function SessionHandler(db) {

  var sessions = new SessionRepository(db);

  this.checkAuth = function(req, res, next) {
    var sessionId = req.cookies.session;
    sessions.getEmailBy(sessionId)
      .then(function(email) {
        return next();
      })
      .fail(function() {
        return res.redirect("/user/login")
      });
  }
}

module.exports = SessionHandler;

