var Q = require('q'),
    _ = require('underscore'),
    UserRepository = require('../repository/users'),
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
      })
      .fail(function(error) {
        res.render('users/login', {'error': error});
      });
  });

  router.get('/user', function(req, res, next) {
    res.render('users/new');
  });

  router.post('/user', function(req, res, next) {
    validateSignup(req.body)
      .then(users.create)
      .then(function(user) {
        res.redirect('/user/login');
      })
      .fail(function(error) {
        res.render('users/new', error)
      });
  });

  function validateSignup(user) {
    var error = {};

    if (!/^[\S]+@[\S]+\.[\S]+$/.test(user.email)) {
      error['email_error'] = "invalid email address";
    }
    if (!/^.{3,20}$/.test(user.password)) {
      error['password_error'] = "Invalid password";
    }
    if (user.password != user.verify) {
      error['verify_error'] = "Password must match";
    }

    var deferred = Q.defer();

    if (_.isEmpty(error)) {
       deferred.resolve(user);
    } else {
       deferred.reject(error);
    }

    return deferred.promise;
  }
}

module.exports = UserController;
