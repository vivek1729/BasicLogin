var express = require('express');
var config = require('../config');
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var User   = require('../models/user'); // get our mongoose model
var router = express.Router();

/* GET users listing. */
router.get('/authenticate', function(req, res, next) {
  var token = req.cookies.auth_token;
  if(token){
  	// verifies secret and checks exp
    jwt.verify(token, config.secret , function(err, decrypted) {      
      if (err) {
        throw new Error('User is not logged in!');
      } else {
        // if everything is good, save to request for use in other routes
        var user = decrypted._doc;
        res.json({success: true, message: 'Authentication successful', user_data: user.name});
      }
    });
  }
  else{
  	throw new Error('User is not logged in!');
  }
});

router.post('/register', function(req, res, next) {
  /* create a sample user. 
  1. Doesn't check if user already exists.
  2. Password saved in plain text.
  These two issues can be addressed.
  */
  var newUser = new User({ 
    name: req.body.username, 
    password: req.body.password
  });

  // save the sample user
  newUser.save(function(err) {
    if (err) throw err;
    console.log('User saved successfully');
    res.clearCookie('auth_token'); //Clear cookie forcing invalidation of last logged in user.
    res.json({ success: true });
  });
});

router.post('/login', function(req, res, next) {
	  // find the user
  User.findOne({
    name: req.body.username,
    password: req.body.password
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {
      /*User found, generate TOKEN and set cookie
      *Right now the cookie and the token both expire in 1 day.
      *To invalidate the login, the cookie can just be cleared.
      */
      var token = jwt.sign(user, config.secret , {
          expiresIn: "1d" // expires in 24 hours
      });
      res.cookie('auth_token', token, { maxAge: 86400000, httpOnly: true }).json({ success: true, message: 'Authentication successful', user_data: user.name });
    }
   });
});

module.exports = router;
