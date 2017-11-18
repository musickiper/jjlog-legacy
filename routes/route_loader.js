var route_loader = {};

var config = require('../config/config');

route_loader.init = function(app, router){
    console.log('route_loader.init called.');

    initRoutes(app,router);
};

function initRoutes(app, router){
    console.log('route_loader.initRoutes called.');

    for(var i = 0; i < config.route_info.length; i++){
        var curItem = config.route_info[i];

        var curModule = require(curItem.file);
        if(curItem.type == 'get'){
            app.get(curItem.path, curModule[curItem.method]);
        }
        else if(curItem.type == 'post'){
            app.post(curItem.path, curModule[curItem.method]);
        }
        else{
            console.err('Unidentified type. : ' + curItem.type);
        }

        app.use('/', router);
    }
};

module.exports = route_loader;