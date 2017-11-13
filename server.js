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

//Router
var router = express.Router();

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
});
