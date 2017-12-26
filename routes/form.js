var showMain = (req,res)=>{
    console.log('/ path called.');

    res.render("main.ejs");
}

var showCList = (req,res)=>{
    console.log('/showCList path called.');

    if(!req.user){
        console.log('user authorizing is failed.');
        res.redirect('/confirmLogin');
        return;
    }

    console.log('user authorizing is succeed.');
    if(req.user[0]){
        res.render('cList.ejs',{user:req.user[0]});
    }
    else{
        res.render('cList.ejs',{user:req.user});
    }
}

module.exports.showMain = showMain;
module.exports.showCList = showCList;