var mongoose = require('mongoose');

var database = {};

database.init = function(app,config){
    console.log('database.init() called.');

    connect(app, config);
};

function connect(app, config){
    var databaseUrl = config.db_url;

    console.log("Try to connect to the database...");
    mongoose.Promise = global.Promise;
    var promise = mongoose.connect(databaseUrl, {
        useMongoClient:true
    });
    database["db"] = mongoose.connection;

    createSchema(app, config);
};

function createSchema(app, config){
    var schemaLen = config.db_schemas.length;
    console.log('The number of schemas set : %d', schemaLen);

    for(var i = 0; i < schemaLen; i++){
        var curItem = config.db_schemas[i];

        var curSchema = require(curItem.file).createUserSchema(mongoose);
        var curModel = mongoose.model(curItem.collection, curSchema);

        database[curItem.schemaName] = curSchema;
        database[curItem.modelName] = curModel;
        console.log('Schema [%s], Model [%s] add to the database Obj as an attribute.', curItem.schemaName, curItem.modelName);
    }

    app.set('database', database);
    console.log('database obj added to the app obj as an attribute.');
}

module.exports = database;

