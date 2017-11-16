var database;
var UserSchema;
var UserModel;

var init = function(db, schema, model){
    database = db;
    UserSchema = schema;
    UserModel = model;
};

//Function for user authorization.
var authUser = function(database, id, password, callback){
    console.log('authUser is called.');

    UserModel.findById(id, function(err,result){
        if(err){
            callback(err,null);
            return;
        }

        if(result.length > 0){
            console.log('Valid id.');

            //Password validation checkcing.
            var user = new UserModel({id:id});
            var authenticated = user.authenticate(password, result[0].salt, result[0].hashed_password);

            if(authenticated){
                console.log('Valid password.');
                callback(null,result);
            }
            else{
                console.log('Invalid password');
                callback(null,null);
            }
        }
        else{
            console.log('Invalid user.');
            callback(null,null);
        }
    });
}

//Function for adding user.
var addUser = function(database, id, password, name, callback){
    console.log('addUser is called.');

    var user = new UserModel({"id":id, "password":password, "name":name});

    user.save(function(err){
        if(err){
            callback(err,null);
            return;
        }
        console.log('Addition succeed.');
        callback(null,user);
    });
}

//Function for login.
var login = function(req,res){
    console.log('/process/login is called.');

    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;

    if(database){
        authUser(database, paramId, paramPassword, function(err,result){
            if(err) throw err;

            if(result){
                var username = result[0].name;

                res.writeHead(200,{"Content-Type":"text/html;charset='utf8'"});

                var context = {userid:paramId, username:username};
                req.app.render('login_success',context, function(err,html){
                    if(err){
                        console.err("Error happen durung view rendering.");

                        res.writeHead(200,{"Content-Type":"text/html;charset='utf8'"});
                        res.write('<h2>Error happen during view rendering.</h2>');
                        res.write('<p>' + err.stack + '</p>');
                        res.end();

                        return;
                    }
                    res.end(html);
                });
            }
            else{
                res.writeHead(200,{"Content-Type":"text/html;charset='utf8'"});
                res.write('<h1>Login failed.</h1>');
                res.write('<div><p>Re-check the id or password.</p></div>');
                res.write("<br><br><a href='/login.html'>Login again</a>");
                res.end();
            }
        });
    }
    else{
        res.writeHead(200,{"Content-Type":"text/html;charset='utf8'"});
        res.write('<h2>Database connection failed.</h2>');
        res.write('<div><p>Database connection failed.</p></div>');
        res.end();
    }
};

//Function for adduser.
var adduser = function(req,res){
    console.log('/process/adduser is called.');

    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    var paramName = req.body.name || req.query.name;

    if(database){
        addUser(database, paramId, paramPassword, paramName, function(err,result){
            if(err) throw err;

            if(result){
                res.writeHead(200,{"Content-Type":"text/html;charset='utf8'"});

                var context={userid:paramId};

                req.app.render('adduser', context, function(err,html){
                    if(err){
                        console.error("Error happen durung view rendering.");

                        res.write('<h2>Error happen during view rendering.</h2>');
                        res.write('<p>' + err.stack + '</p>');
                        res.end();

                        return;
                    }
                    res.end(html);
                });
            }
            else{
                res.writeHead(200,{"Content-Type":"text/html;charset='utf8'"});
                res.write('<h2>User adiition is failed.')
                res.end();
            }
        });
    }
    else{
        res.writeHead(200,{"Content-Type":"text/html;charset='utf8'"});
        res.write('<h2>Database connection failed.</h2>');
        res.write('<div><p>Database connection failed.</p></div>');
        res.end();
    }
};

module.exports.init = init;
module.exports.login = login;
module.exports.adduser = adduser;
