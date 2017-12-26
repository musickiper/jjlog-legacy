/*---------- Modules ----------*/

//Import express basic modules.
var express = require('express')
var http = require('http')
var path = require('path');

//Express Obj.
var app = express();

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
var expressLayouts = require('express-ejs-layouts');

//Import modules made by me.
//var user = require('./routes/user');
var config = require('./config/config');
var db_config = require('./database/database');
var route_loader = require('./routes/route_loader');
var configPassport = require('./config/passport');
var userPassport = require('./routes/user_passport');

/*----------View Engine----------*/

//Set view engine.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

/*
//Set view layout
app.set('layout', 'layouts/layout');
app.set("layout extractScripts",true);
app.use(expressLayouts);
*/

console.log('View engine is set : ejs');

/*----------Middlewares for basic setting----------*/

//the middleware set for connecting to the files using specific path.
app.use('/', static(path.join(__dirname, "public")));

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

/*----------DataBase(MongoDB)----------*/

//Database connection.
var database;

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
    });

    database.on('disconnected', function(){
        console.log('Connection is failed... Try again after 5sec...');
        setInterval(connectDB, 5000);
    });
};

/*----------Passport----------*/

//Passport initialization.
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//Passport setting.
configPassport(app, passport);

/*----------Router----------*/

var router = express.Router();

//Read router information from config and set the information as atrributes of app obj.
route_loader.init(app, router);

//Use router for passport.
userPassport(app,passport);

//Middleware for router working.
app.use('/',router);

/*----------Error Handling----------*/

//Error handling.
var errorHandler = expressErrorHandler({
    static:{
        '404':'./public/404.html'
    }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

//Express server set.
app.listen(config.server_port, function(){
    console.log('Express server is working on the port :' + config.server_port);
    connectDB();
});
