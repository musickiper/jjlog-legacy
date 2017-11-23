var entities = require('html-entities').AllHtmlEntities;

var addpost = function(req,res){
    console.log("post's addpost called.");

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

            var userObjectId = result[0]._id;

            var post = new database.PostModel({
                title:paramTitle,
                contents:paramContents,
                writer:userObjectId
            });

            post.savePost(function(err,result){
                if(err) throw err;

                console.log('Post added : ' + post._id);

                return res.redirect('/process/showpost/' + post._id);
            });
        });
    }
};

var showpost = function(req,res){
    console.log("post's showpost called.");

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
                res.writeHead(200,{"Content-Type":"text/html;charset='utf8'"});

                var context = {
                    title:'Search',
                    posts:result,
                    Entities:entities
                };

                req.app.render('showpost',context,function(err,html){
                    if(err) throw err;

                    res.end(html);
                });
            }
        });
    }
};

var listpost = function(req,res){
    console.log("post's listpost called.");

    var paramPage = req.body.page || req.query.page;
    var paramPerPage = req.body.perPage || req.query.perPage;

    var database = req.app.get('database');

    if(database.db){
        var options = {
            page:paramPage,
            perPage:paramPerPage
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
                database.PostModel.count().exec(function(err,count){
                    res.writeHead(200,{"Content-Type":"text/html;charset='utf8'"});

                    var context = {
                        title:'Contents list',
                        posts:result,
                        page:parseInt(paramPage),
                        pageCount:Math.ceil(count/paramPerPage),
                        perPage:paramPerPage,
                        totalRecords:count,
                        size:paramPerPage
                    };

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
                });                    
            }
        });
    }
};

module.exports.addpost = addpost;
module.exports.showpost = showpost;
module.exports.listpost = listpost;