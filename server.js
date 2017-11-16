//Import express basic modules.
var express = require('express')
    ,http = require('http')
    ,path = require('path');


//Import express non-basic modules.
var static = require('serve-static');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var expressErrorHandler = require('express-error-handler');
var mongoose = require('mongoose');
var crypto = require('crypto');
var passport = require('passport');
var flash = require('connect-flash');
var LocalStrategy = require('passport-local').Strategy;

//Import modules made by me.
//var user = require('./routes/user');
var config = require('./config');
var db_config = require('./database/database');
//var route_loader = require('./routes/route_loader');

//Express Obj
var app = express();

//Set view engine.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
console.log('View engine is set : ejs');

//the middleware set for connecting to the files using specific path.
app.use('/', static(path.join(__dirname, "html")));

//the middleware for using information through post method.
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//the middleware for cookie.
app.use(cookieParser());

//the middleware for session.
app.use(expressSession({
    secret:'my key',
    resave:true,
    saveUninitialized:true
}));

//Passport initialization.
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//Database connection.
var database;
var UserSchema;
var UserModel;

//Function for connect mongoDB.
function connectDB(){

    //Initializing database and make the userSchema && userModel added as one of the attributes of app obj.
    //Whenever we update config file's db_schemas, it automatically update schemas and models of this server.
    //Through it, we can add new schema or new model without changing server file, just need to update config file. 
    db_config.init(app, config);

    database = db_config.db;

    database.on('error', console.error.bind(console, 'mongoose connection error'));

    database.on('open', function(){
        console.log('Success to connect to the database : ' + config.db_url);

        createUserSchema();
    });

    database.on('disconnected', function(){
        console.log('Connection is failed... Try again after 5sec...');
        setInterval(connectDB, 5000);
    });
}

//Function for define UserSchema && UserModel
function createUserSchema(){
    var db = app.get('database');

    for(var i = 0; i < config.db_schemas.length; i++){
        UserSchema = db[config.db_schemas[i].schemaName];
        UserModel = db[config.db_schemas[i].modelName];
        //user.init(database, UserSchema, UserModel);
    }
};

//Passport login setting.
passport.use('local-login', new LocalStrategy({
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
            console.log('The account is not registered.');
            return done(null,false,req.flash('loginMessage','No registered account.'));
        }

        //No registered password
        var authenticated = user.authenticate(password, user.salt, user.hashed_password);

        if(!authenticated){
            console.log('The password is not registered.');
            return done(null,false,req.flash('loginMessage','The password is not registered'));
        }

        console.log('The id and password are registered.');
        return done(null,user);
    });
}));

//Passport adduser setting.
passport.use('local-signup', new LocalStrategy({
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
                console.log('Account is already exist.');
                return done(null, false, req.flash('signupMessage','The account is already existing.'));
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
}));

//Information store to the session.
passport.serializeUser(function(user,done){
    console.log('serializeUser() called.');
    done(null,user);
});

passport.deserializeUser(function(user,done){
    console.log('deserializeUser() called.');
    done(null,user);
});

//Router
//route_loader.init(app, express.Router());
var router = express.Router();

app.use('/',router);

//Home page - index.ejs
router.route('/').get(function(req,res){
    console.log('/ path called.');
    res.render('index.ejs');
});

//Login form link.
app.get('/login', function(req,res){
    console.log('/login path called.');
    res.render('login.ejs', {message:req.flash('loginMessage')});
});

app.post('/login', passport.authenticate('local-login', {
    successRedirect:'/profile',
    failureRedirect:'/login',
    failureFlash:true
}));

//Sign up form link.
app.get('/signup', function(req,res){
    console.log('/signup path called.');
    res.render('signup.ejs',{message:req.flash('signupMessage')});
});

app.post('/signup', passport.authenticate('local-signup',{
    successRedirect:'/profile',
    failureRedirect:'/signup',
    failureFlash:true
}));

//Profile page
router.route('/profile').get(function(req,res){
    console.log('/profile path called.');

    if(!req.user){
        console.log('user auth is failed.');
        res.redirect('/');
        return;
    }

    console.log('user auth is succeed.');
    if(Array.isArray(req.user)){
        res.render('profile.ejs',{user:req.user[0]._doc});
    }
    else{
        res.render('profile.ejs',{user:req.user});
    }
});

//Logout
app.get('/logout', function(req,res){
    console.log('/logout path called.');
    req.logout();
    res.redirect('/');
});

//Error handling.
var errorHandler = expressErrorHandler({
    static:{
        '404':'./html/404.html'
    }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

//Express server set.
app.listen(config.server_port, function(){
    console.log('Express server is working on the port :' + config.server_port);
    connectDB();
});
