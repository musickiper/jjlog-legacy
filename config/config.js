module.exports = {
    server_port:process.env.PORT || 3000,
    //db_url:"mongodb://localhost:27017/local",
    db_url:"mongodb://leedo01219:Jun1452563#@ds249605.mlab.com:49605/heroku_bmbp7spr",
    db_schemas:[
        {file:"./user_schema",collection:"users",schemaName:"UserSchema",modelName:"UserModel"}
        ,{file:"./posts_schema",collection:"posts",schemaName:"PostSchema",modelName:"PostModel"}
    ],
    route_info:[
        {file:'./form',path:'/',method:'showMain',type:'get'}
        ,{file:'./form',path:'/c/:page',method:'showCList',type:'get'}
        ,{file:'./form',path:'/c',method:'showCList',type:'post'}
        ,{file:'./form',path:'/contactMe',method:'contactMe',type:'get'}
        ,{file:'./form',path:'/sendContactMe',method:'sendContactMe',type:'post'}
        ,{file:'./post',path:'/addpost/:type',method:'writepost',type:'get'}
        ,{file:'./post',path:'/addpost',method:'addpost',type:'post'}
        ,{file:'./post',path:'/showpost/:id',method:'showpost',type:'get'}
        /*
        ,{file:'./post',path:'/listpost/',method:'listpost',type:'get'}
        ,{file:'./post',path:'/listpost',method:'listpost',type:'post'}
        */
    ],
    facebook:{
        clientID:"1115438201923916",
        clientSecret:"0dd647ce7e5d276dee5734ecee4fa091",
        callbackURL:"/auth/facebook/callback"
    }
};