
var passport = require('passport');
//var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var FacebookStrategy=require('passport-facebook').Strategy;
var configAuth      =require('./auth');
// load up the user model
var User = require('../app/models/user');

// expose this function to our app using module.exports
module.exports = function(passport) {


  // used to serialize the user for the session
     passport.serializeUser(function(user, done) {
         done(null, user.id);
     });

      passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
      done(err,user);
    });
  });

  function serializeClient(req, res, next) {
  if (req.query.permanent === 'true') {
    db.client.updateOrCreate({
      user: req.user
    }, function(err, client) {
      if (err) {
        return next(err);
      }
      // we store information needed in req.user
      req.user.clientId = client.id;
      next();
    });
  } else {
    next();
  }
}


const db = {
  updateOrCreate: function(user, cb){
    // db dummy, we just cb the user
    cb(null, user);
  }
};
  passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
      done(err,user);
    });
  });


    passport.use(new GoogleStrategy({

        clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL,

    },
    function(token, refreshToken, profile, done) {

        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(function() {

            // try to find the user based on their google id
            User.findOne({ 'google.id' : profile.id }, function(err, user) {
                if (err)
                    return done(err);

                if (user) {

                    // if a user is found, log them in
                    return done(null, user);
                } else {
                    // if the user isnt in our database, create a new user
                     var newUser          = new User();

                    // set all of the relevant information
                    newUser.google.id    = profile.id;
                    newUser.google.token = token;
                    newUser.google.name  = profile.displayName;
                    newUser.google.email = profile.emails[0].value; // pull the first email

                     //save the user
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });
        });

    }));



 passport.use(new FacebookStrategy({

        // pull in our app id and secret from our auth.js file
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL,
        profileFields   : [ 'email', 'name' ]
    },
//facebook sends back token to profile
function(token,refreshToken,profile,done){
    process.nextTick(function(){
      User.findOne({'facebook.id':profile.id},function(err,user){
        if(err)
          return done(err);
        if (user) {
          return done(null,user);
        }
        else{
          //if no user found
          var newUser=new User();
          //set facebook infomation
          newUser.facebook.id=profile.id;
          newUser.facebook.token=token;
          newUser.facebook.name=profile.name.givenName + ' ' + profile.name.familyName;
          //newUser.facebook.email=profile.emails[0].value;

          newUser.save(function(err){
            if (err)
              throw err;
            return done(null,newUser);
          });

      }
  });
});
}));

}



function generateRefreshToken(req, res, next) {
  if (req.query.permanent === 'true') {
    req.token.refreshToken = req.user.clientId.toString() + '.' + crypto.randomBytes(
      40).toString('hex');
    db.client.storeToken({
      id: req.user.clientId,
      refreshToken: req.token.refreshToken
    }, next);
  } else {
    next();
  }
}
