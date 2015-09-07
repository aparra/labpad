var crypto = require('crypto'),
    Q = require('Q');

function SessionRepository(db) {
  var sessions = db.collection("sessions");

  this.startSession = function(user) {
    var deferred = Q.defer();
  
    var currentDate = (new Date()).valueOf().toString();
    var random = Math.random().toString();
    var sessionId = crypto.createHash('sha1').update(currentDate + random).digest('hex');

    sessions.insert({'_id': sessionId, 'email': user._id}, function(error, data) {
      if (error) {
        deferred.reject(new Error(error));
      } else {
        deferred.resolve(user);
      }    
    });

    return deferred.promise;
  }

  this.getEmailBy = function(sessionId) {
    var deferred = Q.defer();

    var orElse = function(value, otherValue) {
      return value ? value : otherValue;
    };

    sessions.findOne({'_id': orElse(sessionId, 'undefined')}, function(error, session) {
      if (error || !session || !session.email) {
        deferred.reject(new Error(error));
      } else {
        deferred.resolve(session.email);
      }
    });

    return deferred.promise;        
  }
}

module.exports = SessionRepository;
