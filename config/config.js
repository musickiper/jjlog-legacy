module.exports = {
    server_port:process.env.PORT || 3000,
    //db_url:"mongodb://localhost:27017/local",
    db_url:"mongodb://leedo01219:Jun1452563#@ds249605.mlab.com:49605/heroku_bmbp7spr",
    db_schemas:[
        //{file:"./user_schema",collection:"users",schemaName:"UserSchema",modelName:"UserModel"}
        {file:"./post_schema",collection:"posts",schemaName:"PostSchema",modelName:"PostModel"}
    ],
    route_info:[
        {file:'./post',path:'/process/addpost',method:'addpost',type:'post'}
        ,{file:'./post',path:'/process/showpost/:id',method:'showpost',type:'get'}
    ],
    facebook:{
        clientID:"1115438201923916",
        clientSecret:"0dd647ce7e5d276dee5734ecee4fa091",
        callbackURL:"/auth/facebook/callback"
    }
};