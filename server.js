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

//Express Obj
var app = express();
app.set('port', process.env.PORT || 3000);

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
    var databaseUrl = 'mongodb://leedo01219:Jun1452563#@ds249605.mlab.com:49605/heroku_bmbp7spr';

    console.log("Try to connect to the database...");
    mongoose.Promise = global.Promise;
    var promise = mongoose.connect(databaseUrl, {
        useMongoClient:true
    });
    database = mongoose.connection;

    database.on('error', console.error.bind(console, 'mongoose connection error'));

    database.on('open', function(){
        console.log('Success to connect to the database : ' + databaseUrl);

        UserSchema = mongoose.Schema({
            id:{type:String,required:true,unique:true}
            ,name:{type:String,required:true}
            ,password:{type:String,required:true}
            ,name:{type:String,index:'hashed'}
            ,age:Number
            ,created_at:{type:Date,index:{unique:false,expires:'1d'}}
            ,updated_at:{type:Date,index:{unique:false,expires:'1d'}}
        });

        UserSchema.static('findById', function(id, callback){
            return this.find({id:id}, callback);
        });

        UserSchema.static('findAll', function(callback){
            return this.find({},callback);
        });

        console.log('UserSchema is defined.');

        UserModel = mongoose.model('users', UserSchema);
        console.log('UserModel is defined.');
    });

    database.on('disconnected', function(){
        console.log('Connection is failed... Try again after 5sec...');
        setInterval(connectDB, 5000);
    });
}

//Function for user authorization.
var authUser = function(database, id, password, callback){
    console.log('authUser is called.');

    UserModel.findById(id, function(err,result){
        if(err){
            callback(err,null);
            return;
        }

        if(result.length > 0){
            if(result[0].password === password){
                console.log('Valid password.');
                callback(null,result);
            }
            else{
                console.log('Invalid password');
                callback(null,null);
            }
        }
        else{
            console.log('Invalid user.');
            callback(null,null);
        }
    });
}

//Function for adding user.
var addUser = function(database, id, password, name, callback){
    console.log('addUser is called.');

    var user = new UserModel({"id":id, "password":password, "name":name});

    user.save(function(err){
        if(err){
            callback(err,null);
            return;
        }
        console.log('Addition succeed.');
        callback(null,user);
    });
}

//Router
var router = express.Router();

router.route('/process/login').post(function(req,res){
    console.log('/process/login is called.');

    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;

    if(database){
        authUser(database, paramId, paramPassword, function(err,result){
            if(err) throw err;

            if(result){
                var username = result[0].name;
                res.writeHead(200,{"Content-Type":"text/html;charset='utf8'"});
                res.write('<h1>Login succeed.</h1>');
                res.write("<br><br><a href='/login.html'>Login again</a>");
                res.end();
            }
            else{
                res.writeHead(200,{"Content-Type":"text/html;charset='utf8'"});
                res.write('<h1>Login failed.</h1>');
                res.write('<div><p>Re-check the id or password.</p></div>');
                res.write("<br><br><a href='/login.html'>Login again</a>");
                res.end();
            }
        });
    }
    else{
        res.writeHead(200,{"Content-Type":"text/html;charset='utf8'"});
        res.write('<h2>Database connection failed.</h2>');
        res.write('<div><p>Database connection failed.</p></div>');
        res.end();
    }
});

router.route('/process/adduser').post(function(req,res){
    console.log('/process/adduser is called.');

    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    var paramName = req.body.name || req.query.name;

    if(database){
        addUser(database, paramId, paramPassword, paramName, function(err,result){
            if(err) throw err;

            if(result){
                res.writeHead(200,{"Content-Type":"text/html;charset='utf8'"});
                res.write('<h2>User addition is compete.');
                res.end();
            }
            else{
                res.writeHead(200,{"Content-Type":"text/html;charset='utf8'"});
                res.write('<h2>User adiition is failed.')
                res.end();
            }
        });
    }
    else{
        res.writeHead(200,{"Content-Type":"text/html;charset='utf8'"});
        res.write('<h2>Database connection failed.</h2>');
        res.write('<div><p>Database connection failed.</p></div>');
        res.end();
    }
});

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
app.listen(app.get('port'), function(){
    console.log('Express server is working on the port :' + app.get('port'));
    connectDB();
});
