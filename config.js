module.exports = {
    server_port:process.env.PORT || 3000,
    db_url:"mongodb://localhost:27017/local",
   // db_url:"mongodb://leedo01219:Jun1452563#@ds249605.mlab.com:49605/heroku_bmbp7spr",
    db_schemas:[
        {file:"./user_schema",collection:"users",schemaName:"UserSchema",modelName:"UserModel"}
    ],
    route_info:[
        {file:'./user',path:'/process/login',method:'login',type:'post'}
        ,{file:'./user',path:'/process/adduser',method:'adduser',type:'post'}
    ]
}