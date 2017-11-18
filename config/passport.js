var local_login = require('../passport/local_login');
var local_signup = require('../passport/local_signup');

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

    passport.use('local-login', local_login(app));
    passport.use('local-signup', local_signup(app));
};