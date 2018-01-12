var nodemailer = require('nodemailer');
var post = require('./post');

var showMain = (req,res)=>{
    console.log('/ path called.');

    if(!req.user){
        res.render("main.ejs",{user:""});
    }
    else if(req.user[0]) {
        res.render("main.ejs",{user:req.user[0]});
    }
    else{
        res.render("main.ejs",{user:req.user});
    }
}

var showCList = (req,res)=>{
    console.log('/showCList path called.');

    if(!req.user){
        console.log('user authorizing is failed.');
        res.redirect('/confirmLogin');
        return;
    }

    console.log('user authorizing is succeed.');
    
    req.courseType = 'c';
    req.paramPage = Number(req.params.page) - 1;

    post.listpost(req,res);
};

var showCppList = (req,res)=>{
    console.log('/showCppList path called.');

    if(!req.user){
        console.log('user authorizing is failed.');
        res.redirect('/confirmLogin');
        return;
    }

    console.log('user authorizing is succeed.');
    
    req.courseType = 'cpp';
    req.paramPage = Number(req.params.page) - 1;

    post.listpost(req,res);
};

var showHtmlcssList = (req,res)=>{
    console.log('/showCList path called.');

    if(!req.user){
        console.log('user authorizing is failed.');
        res.redirect('/confirmLogin');
        return;
    }

    console.log('user authorizing is succeed.');
    
    req.courseType = 'htmlcss';
    req.paramPage = Number(req.params.page) - 1;

    post.listpost(req,res);
};

var contactMe = (req,res)=>{
    console.log('/contactMe path called.');

    if(!req.user){
        res.render("contactMe",{user:""});
    }
    else if(req.user[0]) {
        res.render("contactMe",{user:req.user[0]});
    }
    else{
        res.render("contactMe",{user:req.user});
    }
}

var sendContactMe = (req,res)=>{
    console.log('/sendContactMe path called.');

    var transporter = nodemailer.createTransport({
        service:'naver',
        auth:{
            user:'leedo01219@naver.com',
            pass:'jung1234'
        }
    });
    
    var content = req.body;

    var date = new Date();

    var mailOptions = {
        from:'leedo01219@naver.com',
        to:'leedo01219@gmail.com',
        subject:content.userSubject,
        text: 'UserName: ' + content.userName + ', UserEmail: ' + content.userEmail + ', Content: ' + content.commentText 
    };
    
    transporter.sendMail(mailOptions,(error,info)=>{
        if(error){
            console.log(error);
        }
        else{
            console.log('Email sent!: ' + info.response);
        }
        transporter.close();
    });

    res.redirect('/');
};

module.exports.showMain = showMain;
module.exports.showCList = showCList;
module.exports.showCppList = showCppList;
module.exports.showHtmlcssList = showHtmlcssList;
module.exports.contactMe = contactMe;
module.exports.sendContactMe = sendContactMe;