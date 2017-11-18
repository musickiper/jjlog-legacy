var LocalStrategy = require('passport-local').Strategy;

//Set the Local(local-login) strategy.
module.exports = function(app){
    return new LocalStrategy({
        usernameField:'email',
        passwordField:'password',
        passReqToCallback:true
    },function(req,email,password,done){
        console.log("passport's local-login called.");

        var database = app.get('database');
        database.UserModel.findOne({'email':email}, function(err,user){
            if(err){
                return done(err);
            }

            //No registered user
            if(!user){
                console.log('Invalid user-email');
                return done(null,false,req.flash('loginMessage','Invalid user-email'));
            }

            //No registered password
            var authenticated = user.authenticate(password, user.salt, user.hashed_password);

            if(!authenticated){
                console.log('Invalid user-email');
                return done(null,false,req.flash('loginMessage','Invalid user-password'));
            }

            console.log('Valid user-email and user-password');
            return done(null,user);
        });
    });
};