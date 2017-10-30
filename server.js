var express = require('express');
var http = require('http');
var path = require('path');

var app = express();

var router = express.Router();

//Import modules from outside.
var static = require('serve-static');
var expressErrorHandler = require('express-error-handler');
var bodyParser = require('body-parser');

//Setting port number for the server.
app.set('port', process.env.PORT||3000);

//The middleWare for using path to connect to the specific folder.
app.use('/', static(path.join(__dirname, 'html')));

//middleWares for using router.
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

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
http.createServer(app).listen(app.get('port'), function(){
    console.log('Server is waiting requests from clients on port #' + app.get('port'));
});