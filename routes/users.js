
function UserController(router, db) {

  router.get('/user/login', function(req, res, next) {
    res.render('users/login');
  });


}

module.exports = UserController;
