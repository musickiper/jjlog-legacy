var LocalStrategy = require('passport-local').Strategy;

//Set the Local(local-signup) strategy.
module.exports = function(ap){
    var app = ap;

    return new LocalStrategy({
        usernameField:'email',
        passwordField:'password',
        passReqToCallback:true
    },function(req,email,password,done){
        var paramName = req.body.name || req.query.name;

        console.log("passport's local-signup called.");

        process.nextTick(function(){
            var database = app.get('database');
            database.UserModel.findOne({'email':email}, function(err,user){
                if(err){
                    return done(err);
                }

                if(user){
                    console.log('Already exist account');
                    return done(null, false, req.flash('signupMessage','Already exist account.'));
                }
                else{
                    var user = new database.UserModel({'email':email,'password':password,'name':paramName});

                    user.save(function(err){
                        if(err) throw err;
                        console.log('User information added.');
                        return done(null,user);
                    });
                }
            });
        });
    });
};