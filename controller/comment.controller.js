var postModel = require('../model/post.model');
var commentModel = require('../model/comment.model')
var commentController = {};

commentController.userComment = function(req,res){

	var postId = req.body.postId;
	console.log("postid[[]][][]",postId);
	var userId = req.body.userId;
	console.log("userid[[]][][]",userId);
	var comment = req.body.comment;
	console.log("commentid()()()",comment);
	var comment = new commentModel(req.body);
	console.log("comment-=-=-",comment);
	comment.save(function(err,savedPost){

		console.log("savepost--=-=-=",savedPost);
		if(err){res.status(500).send("server err")}
			else{
				postModel.findOne({_id:postId})
				.exec((err,user)=>{
					console.log("user=============>",user);
					if(err) {res.status(500).send("server err")}
						else{
							user.comment.push(savedPost._id);
							user.save();
							res.status(200).send(savedPost);
						}
					})
			}
		})
}

commentController.getComment = function(req,res){

	console.log("request()()()()",req);
	var userId = req.params.id;
	console.log("user ID ===============+>" , userId);
	console.log("user-=-=-0--",userId);
	var postId = req.params.postId;
	console.log("post**********",postId);
	var comment = req.body._id;
	console.log("comment[][][]",comment);
	postModel
	.findOne({ _id: postId })
	.populate('comment')
	.exec((err, result)=>{
		if (err) { res.status(500).send(err); }

		result.comment.push(userId);
		result.save();
		res.status(200).send(result);
	})
}

module.exports = commentController;