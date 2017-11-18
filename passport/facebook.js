var FacebookStrategy = require('passport-facebook').Strategy;
var config = require('../config/config');

module.exports = function(app,passport){
    return new FacebookStrategy({
        clientID : config.facebook.clientID,
        clientSecret : config.facebook.clientSecret,
        callbackURL : config.facebook.callbackURL,
        //passReqToCallback : true,
        profileFields : ['id', 'email', 'name']
    }, function(accessToken, refreshToken, profile, done){
        console.log("passport's facebook called.");

        var database = app.get('database');
        database.UserModel.findById(profile.id, function(err,user){
            console.log(user);

            if(user.length > 0){
                return done(err, user);
            }

            var user = new database.UserModel({
                name:profile.name.givenName,
                email:profile.emails[0].value,
                provider:'facebook',
                id:profile.id
            });

            user.save(function(err){
                if(err){
                    console.log(err);
                    return done(err,user);
                }
                return done(null,user);
            });
        });
    });
};