var nodemailer = require('nodemailer');

var showMain = (req,res)=>{
    console.log('/ path called.');

    if(!req.session.passport){
        res.render("main.ejs",{user:""});
    }
    else{
        res.writeHead(200,{"Content-Type":"text/html;charset='UTF8'"});
        res.render("main.ejs",{user:req.session.passport.user});
    }
}

var showCList = (req,res)=>{
    console.log('/showCList path called.');

    if(!req.session.passport){
        console.log('user authorizing is failed.');
        res.redirect('/confirmLogin');
        return;
    }

    console.log('user authorizing is succeed.');

    if(req.session.passport){
        res.render('cList.ejs',{user:req.session.passport.user});
    }
}

var contactMe = (req,res)=>{
    console.log('/contactMe path called.');

    if(!req.session.passport){
        res.render("contactMe.ejs",{user:""});
    }
    else{
        res.render("contactMe.ejs",{user:req.session.passport.user});
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
module.exports.contactMe = contactMe;
module.exports.sendContactMe = sendContactMe;