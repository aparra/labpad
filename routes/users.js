var UserRepository = require('../repository/users'),
    SessionRepository = require('../repository/sessions');

function UserController(router, db) {
  var users = new UserRepository(db);
  var sessions = new SessionRepository(db);

  router.get('/user/login', function(req, res, next) {
    res.render('users/login');
  });

  router.post('/user/login', function(req, res, next) {
    users.login(req.body.email, req.body.password)
      .then(sessions.startSession)
      .then(function(user) {
        res.redirect('/');
      });
  });

  router.get('/user', function(req, res, next) {
    res.render('users/new');
  });

  router.post('/user', function(req, res, next) {
    users.create(req.body.email, req.body.password).then(function(user) {
      res.redirect('/user/login');
    });
  });
}

module.exports = UserController;
