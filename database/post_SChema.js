var schema = {};

schema.createPostSChema = function(mongoose){

    var postSchema = mongoose.Schema({
        title:{type:String,trim:true,'default':''}
        ,contents:{type:String,trim:true,'default':''}
        ,writer:{type:mongoose.Schema.ObjectId,ref:'users'}
        ,tags:{type:[],'default':''}
        ,created_at:{type:Date,index:{unique:false},'default':Date.now}
        ,updated_at:{type:Date,index:{unique:false},'default':Date.now}
        ,comments:[{
            contents:{type:String,trim:true,'default':''}
            ,writer:{type:mongoose.Schema.ObjectId,ref:'users'}
            ,created_at:{type:Date,'default':Date.now}            
        }]
    });
}