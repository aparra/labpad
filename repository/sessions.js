var crypto = require('crypto'),
    Q = require('Q');

function SessionRepository(db) {
  var sessions = db.collection("sessions");

  this.startSession = function(user) {
    var deferred = Q.defer();
  
    var current_date = (new Date()).valueOf().toString();
    var random = Math.random().toString();
    var session_id = crypto.createHash('sha1').update(current_date + random).digest('hex');

    sessions.insert({'_id': session_id, 'email': user.email}, function(error, data) {
      if (error) {
        deferred.reject(new Error(error));
      } else {
        deferred.resolve(user);
      }    
    });

    return deferred.promise;
  }
}

module.exports = SessionRepository;
