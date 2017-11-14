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

//Import modules made by me.
var user = require('./routes/user');
var config = require('./config');
var db_config = require('./database/database');

//Express Obj
var app = express();

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
        user.init(database, UserSchema, UserModel);
    }
};

//Router
var router = express.Router();

router.route('/process/login').post(user.login);

router.route('/process/adduser').post(user.adduser);

app.use('/', router);

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
