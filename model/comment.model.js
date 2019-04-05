var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({

	postId:String,
	userId:{type:Schema.Types.ObjectId,ref:"users"},
	comment:String

});

commentSchema.pre('find',function(next){

	this.populate('userId');
	next();

}
)

module.exports = mongoose.model('comments',commentSchema);

