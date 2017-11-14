module.exports = {
    server_port:process.env.PORT || 3000,
    db_url:"mongodb://localhost:27017/local",
    db_schemas:[
        {file:"./user_schema",collection:"users",schemaName:"UserSchema",modelName:"UserModel"}
    ],

}