
var User=require('./models/user');
module.exports=function(app,passport){
    app.get('/',function(req,res){
      res.render('index.ejs');
    });


    //route for google+
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    app.get('/auth/google/callback',
            passport.authenticate('google', {
                    successRedirect : '/profile',
                    failureRedirect : '/'
            }));
    //route for processing showing the profile page
    app.get('/profile', isLoggedIn, function(req, res) {

        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });
    


    // FACEBOOK ROUTES
    // route for facebook authentication and login
    app.get('/auth/facebook',
passport.authenticate('facebook', { scope: ['email']}),
    function(req, res){
});
    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {successRedirect : '/profile',
                                           failureRedirect : '/'
        }));
//logout
     app.get('/logout', function(req, res) {
       req.logout();
       res.redirect('/');
   });
};


function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
<<<<<<< HEAD
} 
=======
}
>>>>>>> be9adb0279e93fe14a2ca9077c8d5849c68076d9
