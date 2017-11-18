var local_login = require('../passport/local_login');
var local_signup = require('../passport/local_signup');
var facebook = require('../passport/facebook');

module.exports = function (app, passport){
    console.log('config/passport called.');

    //Information store to the session.
    passport.serializeUser(function(user,done){
        console.log('serializeUser() called.');
        done(null,user);
    });

    //Restore the information of the user from the session.
    passport.deserializeUser(function(user,done){
        console.log('deserializeUser() called.');
        done(null,user);
    });

    //Adding strategy for login and signup to the passport.
    passport.use('local-login', local_login(app));
    passport.use('local-signup', local_signup(app));

    //Adding strategy for login using facebook OAuth way.
    passport.use('facebook', facebook(app,passport));
};