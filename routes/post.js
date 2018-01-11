var entities = require('html-entities').AllHtmlEntities;

var writepost = function(req,res){
    var courseType = req.params.type;

    console.log('/writepost/' + courseType + ' called');

    if(!req.user){
        res.render("confirmLogin",{user:""});
    }
    else if(req.user[0]){
        res.render("writepost",{user:req.user[0], type:courseType});
    }
    else{
        res.render("writepost",{user:req.user, type:courseType});
    }
}

var addpost = function(req,res){
    var paramType = req.body.courseType;

    console.log("post's addpost/" + paramType + " called.");

    var paramTitle = req.body.title || req.query.title;
    var paramContents = req.body.contents || req.query.contents;
    var paramWriter = req.body.writer || req.query.writer;

    var database = req.app.get('database');

    if(database.db){
        database.UserModel.findByEmail(paramWriter, function(err,result){
            if(err){
                console.log('Error happen when adding a post to BBS : ' + err.stack);

                res.writeHead(200,{"Content-Type":"text/html;charset='utf8'"});
                res.write('<h2>Error happen when adding a post to BBS</h2>');
                res.write('<p>' + err.stack + '</p>');
                res.end();
                return;
            }

            if(result == undefined || result.length < 1){
                res.writeHead(200,{"Content-Type":"text/html;charset='utf8'"});
                res.write('<h2>Can not find the user : ' + paramWriter + '</h2>');
                res.end();
                return;
            }

            var userObjectId = result[0]._doc;

            var post = new database.PostModel({
                courseType:paramType,
                title:paramTitle,
                contents:paramContents,
                writer:userObjectId
            });

            post.savePost(function(err,result){
                if(err) throw err;

                console.log('Post added : ' + post._id);

                return res.redirect('/showpost/' + post._id);
            });
        });
    }
};

var showpost = function(req,res){
    console.log("post's showpost/" + req.body.courseType + " called.");

    var paramId = req.body.id || req.query.id || req.params.id;

    console.log('Called param : ' + paramId);

    var database = req.app.get('database');

    if(database.db){
        database.PostModel.load(paramId, function(err,result){
            if(err){
                console.error('Error happen when searching BBS : ' + err.stack);

                res.writeHead(200,{"Content-Type":"text/html;charset='utf8'"});
                res.write('<h2>Error happen when searching a content from BBS</h2>');
                res.write('<p>' + err.stack + '</p>');
                res.end();
                return;
            }

            if(result){
                if(req.session.passport){
                    if(req.session.passport.user[0]){
                        res.render('showpost', {title:'Search',posts:result,Entities:entities,user:req.session.passport.user[0]});
                    }
                    else if(req.session.passport.user){
                        res.render('showpost', {title:'Search',posts:result,Entities:entities,user:req.session.passport.user});
                    }
                    else{
                        res.render('confirmLogin',{user:""})
                    }
                }
                else{
                    res.render('confirmLogin',{user:""});
                }
            }
        });
    }
};

var listpost = function(req,res){
    console.log("post's listpost with " + req.courseType+ " called.");

    var database = req.app.get('database');

    if(database.db){

        var options = {
            criteria:{courseType:req.courseType},
            page:req.paramPage,
            perPage:10
        }

        database.PostModel.list(options, function(err,result){
            if(err){
                console.error('Error happen when searching BBS lists : ' + err.stack);

                res.writeHead(200,{"Contents-Type":"text/html;charset='utf8'"});
                res.write('<h2>Error happen when searching BBS lists.</h2>');
                res.write('<p>' + err.stack + '</p>');
                res.end();

                return;
            }

            if(result){
                database.PostModel.count({courseType:req.courseType}).exec(function(err,count){

                    var context = {
                        title:'Contents list',
                        posts:result,
                        page:options.page + 1,
                        pageCount:Math.ceil(count/options.perPage),
                        perPage:options.perPage,
                        totalRecords:count,
                    };

                    if(!req.user){
                        res.render("confirmLogin",{user:""});
                    }
                    else if(req.user[0]){
                        res.render("listpost",{user:req.user[0], context});
                    }
                    else{
                        res.render("listpost",{user:req.user, context});
                    }
                    /*
                    req.app.render('listpost', context, function(err,html){
                        if(err){
                            console.log('Error happen when maiking res web-doc : ' + err.stack);

                            res.writeHead(200,{"Content-Type":"text/html;charset='utf8'"});
                            res.write('<h2>Error happen when maiking res web-doc</h2>');
                            res.write('<p>' + err.stack + '</p>');
                            res.end();

                            return;
                        }
                        res.end(html);
                    });
                    */
                });                    
            }
        });
    }
};

module.exports.writepost = writepost;
module.exports.addpost = addpost;
module.exports.showpost = showpost;
module.exports.listpost = listpost;