var crypto = require('crypto');

var Schema = {};

Schema.createUserSchema = function(mongoose){

    var UserSchema = mongoose.Schema({
        email:{type:String,required:true,unique:true,'default':''}
        ,hashed_password:{type:String,require:true,'default':''}
        ,salt:{type:String,require:true}
        ,name:{type:String,required:true,index:'hashed','default':''}
        ,created_at:{type:Date,index:{unique:false,expires:'1d'},'default':Date.now}
        ,updated_at:{type:Date,index:{unique:false,expires:'1d'},'default':Date.now}
    });

    //Atrribute for encryption of password.
    UserSchema
        .virtual('password')
        .set(function(password){
            this._password = password;
            this.salt = this.makeSalt();
            this.hashed_password = this.encryptPassword(password);
        })
        .get(function(){return this._password});

    //Validate exist of email.
    UserSchema.path('email').validate(function(email){
        return email.length;
    }, 'There is no email column.');

    //Validate exist of hashed_password.
    UserSchema.path('hashed_password').validate(function(hashed_password){
        return hashed_password.length;
    }, 'There is no hashed_password column.');

    //Method 1 using for password encryption.
    UserSchema.method('encryptPassword',function(plainText, inSalt){
        if(inSalt){
            return crypto.createHmac('sha512',inSalt).update(plainText).digest('hex');
        }
        else{
            return crypto.createHmac('sha512',this.salt).update(plainText).digest('hex');
        }
    });

    //Making salt(which is random value for encryption)
    UserSchema.method('makeSalt', function(){
        return Math.round((new Date().valueOf()*Math.random())) + '';
    });

    //Authenication method.
    UserSchema.method('authenticate', function(plainText, inSalt, hashed_password){
        if(inSalt){
            return this.encryptPassword(plainText, inSalt) === hashed_password;
        }
        else{
            return this.encryptPassword(plainText) === this.hashed_password;
        }
    });

    //Method for finding the user information by email.
    UserSchema.static('findByEmail', function(email, callback){
        return this.find({email:email}, callback);
    });

    console.log('UserSchema is defined.');

    return UserSchema;
};

module.exports = Schema;