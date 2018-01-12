var utils = require('../utils/utils');

var SchemaObj = {};

SchemaObj.createSchema = function(mongoose){

    var PostSchema = mongoose.Schema({
        courseType:{type:String,trim:true}
        ,title:{type:String,trim:true,'default':''}
        ,contents:{type:String,trim:true,'default':''}
        ,writer:{type:mongoose.Schema.Types.ObjectId,ref:'users'}
        ,tags:{type:[],'default':''}
        ,created_at:{type:Date,index:{unique:false},'default':Date.now}
        ,updated_at:{type:Date,index:{unique:false},'default':Date.now}
        ,comments:[{
            contents:{type:String,trim:true,'default':''}
            ,writer:{type:mongoose.Schema.Types.ObjectId,ref:'users'}
            ,created_at:{type:Date,'default':Date.now}            
        }]
    });

    PostSchema.path('title').required(true,'You must enter the title!');
    PostSchema.path('contents').required(true,'You must enter the contents!');

    PostSchema.methods = {
        savePost:function(callback){
            var self = this;

            this.validate(function(err){
                if(err){
                    return callback(err);
                }
                self.save(callback);
            });
        },
        addComent:function(user,comment,callback){
            this.comment.push({
                contents:comment.contents,
                writer:user._id,
                created_at:Date.now
            });
            this.save(callback);
        },
        removeComment:function(id,callback){
            var index = utils.indexOf(this.comments, {id:id});

            if(index){
                this.comments.splice(index, 1);
            }
            else{
                return callback('There is not the comment object which has the ID [' + id + '].');
            }
            this.save(callback);
        }
    };

    PostSchema.statics = {
        //Find the post using id.
        load:function(id,callback){
            this.findOne({_id:id})
                .populate('writer', 'name provider email')
                .populate('comments.writer')
                .exec(callback);
        },
        list:function(options, callback){
            var criteria = options.criteria ||{};

            this.find(criteria)
                .populate('writer', 'name provider email')
                .sort({'created_at':-1})
                .limit(Number(options.perPage))
                .skip(options.perPage * options.page)
                .exec(callback);
        }
    };
    console.log('PostSchema defined.');
    return PostSchema;
};

module.exports = SchemaObj;