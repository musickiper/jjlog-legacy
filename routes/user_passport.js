module.exports = function(app, passport){
    console.log('user_passport called.');

    //Confirm Login Page
    app.get('/confirmLogin', function(req,res){
        console.log('/ path called.');
        res.render('confirmLogin.ejs');
    });

    //Login form linkage.
    app.get('/login', function(req,res){
        console.log('/login path called.');
        res.render('login.ejs', {message:req.flash('loginMessage')});
    });

    //Sign up form linkage.
    app.get('/signup', function(req,res){
        console.log('/signup path called.');
        res.render('signup.ejs',{message:req.flash('signupMessage')});
    });
    //Profile page

    app.get('/profile', function(req,res){
        console.log('/profile path called.');

        if(!req.user){
            console.log('user authorizing is failed.');
            res.redirect('/');
            return;
        }

        console.log('user authorizing is succeed.');
        if(Array.isArray(req.user)){
            res.render('profile.ejs',{user:req.user[0]});
        }
        else{
            res.render('profile.ejs',{user:req.user});
        }
    });

    //Logout
    app.get('/logout', function(req,res){
        console.log('/logout path called.');
        req.logout();
        res.redirect('/');
    });

    //Facebook Auth
    app.get('/auth/facebook', passport.authenticate('facebook',{
        authType:'rerequest',
        scope:['public_profile','email']
    }));
    //Facebook Auth callback
    app.get('/auth/facebook/callback', passport.authenticate('facebook',{
        successRedirect:'/',
        failureRedirect:'/login'
    }));

    //Getting information from login form called above as post method, and autheticate using passport.
    app.post('/login', passport.authenticate('local-login', {
        successRedirect:'/',
        failureRedirect:'/login',
        failureFlash:true
    }));

    //Getting information from signup form called above as post method, and autheticate using passport.
    app.post('/signup', passport.authenticate('local-signup',{
        successRedirect:'/profile',
        failureRedirect:'/signup',
        failureFlash:true
    }));
};