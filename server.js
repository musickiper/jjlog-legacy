//Express basic modules.
var express = require('express');
var http = require('http');
var path = require('path');

//Express object allocation.
var app = express();

//Setting a port number for the server.
app.set('port', process.env.PORT||3000);

//Import modules from outside.
var static = require('serve-static');
var bodyParser = require('body-parser');
var expressErrorHandler = require('express-error-handler');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

//The middleWare for using path to connect to the specific folder.
app.use('/html', static(path.join(__dirname, 'html')));

//middleWares for getting information using post method.
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Set for saving cookies.
app.use(cookieParser());

//Set for saving sessions.
app.use(expressSession({
    secret:'my key',
    resave:true,
    saveUninitialized:true
}));

//Set for using mongodb.
var mongoose = require('mongoose');

var database;
var UserSchema;
var UserModel;

function connectDB(){
    var databaseUrl = 'mongodb://<leedo01219>:<Jun1452563#>@ds249605.mlab.com:49605/heroku_bmbp7spr';

    console.log('Trying to connect to the database.');
    mongoose.Promise = global.Promise;
    mongoose.connect(databaseUrl);
    database = mongoose.connection;

    database.on('open', function(){
        console.log('Connection Suceed : ' + databaseUrl);

        UserSchema = mongoose.Schema({
            id:String,
            name:String,
            password:String
        });
        console.log('UserSchema is defined.');

        UserModel = mongoose.model('user', UserSchema);
        console.log('UserModel is defined.');
    });

    database.on('disconnected', function(){
        console.log('The connection is disconnected. Try again after 5sec.');
        setInterval(connectDB, 5000);
    });

    database.on('error', console.error.bind(console, 'mongoose connection error'));
}

//Function for authorizing user from mongodb.
var authUser = function(db, id, password, callback){
    console.log('authUser called.');

    UserModel.find({'id':id, 'password':password}, function(err,result){
        if(err){
            callback(err,null);
            return;
        }

        if(result.length > 0){
            console.log('User authorizing suceed.');
            callback(null, result);
        }
        else{
            console.log('User authorizing failed.');
            callback(null,null);
        }
    });
}

//Function for adding new user information to the mongodb.
var addUser = function(db, id, password, name, callback){
    console.log('addUser is called.');

    var user = new UserModel({'id':id, 'password':password, 'name':name});

    user.save(function(err){
        if(err){
            callback(err,null);
            return;
        }
        console.log('New user is successfully added.');
        callback(null,user);
    });
};

//Set router.
var router = express.Router();

router.route('/process/login').post(function(req,res){
    console.log('/process/login called.');

    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;

    if(database){
        authUser(database, paramId, paramPassword, function(err,result){
            if(err) throw err;

            if(result){
                console.log('Login succeed.');
                res.redirect('/html/index.html');
            }
            else{
                console.log('Login failed.');
                res.redirect('/html/login.html');
            }
        })
    }
    else{
        res.writeHead(200, {"Content-Type":"text/html;charser='utf8'"});
        res.write('<h2>Database connection failed.');
        res.end();
    }
});

router.route('/process/addUser').post(function(req,res){
    console.log('/process/addUser called.');

    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    var paramName = req.body.name || req.query.name;

    if(database){
        addUser(database, paramId, paramPassword, paramName, function(err,result){
            if(err) throw err;

            if(result){
                res.writeHead(200,{"Content-Type":"text/html;charset='utf8'"});
                res.write('<h2>User adding succeed.');
                res.write('<div><a href="/html/login.html">Go back to the login page.</a></div>');
                res.end();
            }
            else{
                res.writeHead(200, {"Content-Type":"text/html;charser='utf8'"});
                res.write('<h2>User adding failed.');
                res.write('<div><a href="/html/addUser.html">Go back to try again.</a></div>');
                res.end();
            }
        })
    }
});

app.use('/', router);

//Error control.
var errorHandler = expressErrorHandler({
    static:{
        '404':'./html/404.html'
    }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

//Making server.
app.listen(app.get('port'), function(){
    console.log('Server is waiting requests from clients on port #' + app.get('port'));
    connectDB();
});