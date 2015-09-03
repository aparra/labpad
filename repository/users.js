var bcrypt = require('bcrypt-nodejs'),
    Q = require('Q');

function UserRepository(db) {
  var users = db.collection('users');

  this.create = function(email, password) {
    var deferred = Q.defer();

    var salt = bcrypt.genSaltSync();
    var password_hash = bcrypt.hashSync(password, salt);

    users.insert({'_id': email, 'password': password_hash}, function(error, data) {
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
}

module.exports = UserRepository;
