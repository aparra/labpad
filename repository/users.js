var bcrypt = require('bcrypt-nodejs'),
    Q = require('q');

function UserRepository(db) {
  var users = db.collection('users');

  this.create = function(user) {
    var deferred = Q.defer();

    var salt = bcrypt.genSaltSync();
    var password_hash = bcrypt.hashSync(user.password, salt);
    user.password = password_hash;

    users.insert(user, function(error, data) {
      if (error) {
        deferred.reject(new Error(error));
      } else {
        deferred.resolve(data);
      }
    });

    return deferred.promise;
  }

  this.login = function(email, password) {
    var deferred = Q.defer();

    var validateLogin = function(error, user) {
      if (user && bcrypt.compareSync(password, user.password)) {
        deferred.resolve(user);
      } else {
        deferred.reject(new Error('Invalid user and/or password'));
      }
    }

    users.findOne({'_id': email}, validateLogin);
    return deferred.promise;
  }

  this.getPrincipal = function() {
    var deferred = Q.defer();

    users.findOne({principal: true}, function(error, user) {
      if (error) {
        deferred.reject(new Error(error));
      } else {
        deferred.resolve(user);
      }
    });

    return deferred.promise;
  }
}

module.exports = UserRepository;
