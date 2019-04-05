var postModel = require('../model/post.model');
var userModel = require('../model/user.model');
var async = require('async');
var postController = {};

postController.addPost = function(req,res){
	console.log("post______++++++",req.body);
	var userId = req.body.userId;
	console.log("USERID=-=-=-=-",userId);
	var post = new postModel(req.body);
	console.log("addPost",post);
	post.save(function(err,savedUser){
		console.log(savedUser);
		res.send(savedUser);

	})
}	

postController.deletePost = function(req,res){
	var postid =req.params.id;
	postModel.remove({_id: postid},function(err,deletepost){
		console.log(err,deletepost);
		res.send(deletepost)
	})
}

postController.updatePost = function(req,res){

	var postid = req.body._id;
	postModel
	.findOneAndUpdate({_id: postid},req.body,{upsert:true},function(err,updatedpost){
		console.log(updatedpost);
		res.send(updatedpost);
	})
}

postController.getPostById=function(req,res){

	postModel.find({_id: req.params.id},function(err,foundpost)
	{
		res.send(err || foundpost);
	})
}

postController.getPosts = function(req,res){
	postModel.find({},function(err,posts){
		res.send({posts:posts});
	})
}

postController.getUsersPost = function(req,res){
	var userId = req.params.userId;
	console.log("userId",userId);
	postModel
	.find({ userId:userId })
	.populate('posts')
	.exec((err, result)=>{
		if (err) { res.status(500).send(err); }
		res.status(200).send(result);
	})
}

postController.getMyFriendPost = function(req,res){
	var currentUser = req.params.requestedUser;
	console.log("id",req.params.requestedUser);
	userModel
	.findOne({_id:currentUser})
	.exec((err,result)=>{
		if (err){
			console.log("ERROR#$#@$@@#@$##$$#$#", err);
			return res.status(500).send(err);
		}
		postModel.find({'userId':{$in:result.friend}})
		.populate('comment')
		.populate({path: 'comment', populate: 'userId' })
		.populate({path: 'comment', populate: 'comment' })
		.exec((err,post)=>{
			if(err){res.status(500).send(err);}
			console.log("posts",post);
			res.status(200).send(post);
		})

	})
}

postController.uploadFile = function(req, res){
	console.log("upload files ================++>" ,req.body);
	var sampleFile = req.files.uploadFile;
	console.log("Single FILE UPLOAD TEST : req.files = ",sampleFile);

	sampleFile.mv('./uploads/'+sampleFile.name, function(err,result) {
		if (err){
			console.log("ERROR#$#@$@@#@$##$$#$#", err);
			return res.status(500).send(err);
		}
		else{

			var userId = req.body.userId;
			console.log("===========>>>>>userid");
			var FileName = req.body.fileName;
			console.log("filename=============>",FileName);
			var fileNamearr = FileName.split("\\");
			console.log("filearray==============<<<<>>",fileNamearr);
			var FileName = fileNamearr[2];
			console.log("filename===================><><>",FileName);
			var postdata = {

				content: req.body.content,
				dateTime: req.body.dateTime,
				publish: req.body.publish,
				fileName: '/uploads/'+FileName,
				userId: req.body.userId

			};

			var postdt = new postModel(postdata);
			console.log("addPost",postdt);
			postdt.save(function(err,savedUser){
				console.log(savedUser);
				res.send(savedUser);

			})
		}

		
	});
}

postController.like = function(req,res){

	var postId = req.body.postId;
	console.log("postid[[[]][][]",postId);
	var userId = req.body.userId;
	console.log("userid[[]][][]",userId);
	
	postModel.findOne({_id:postId}).exec((err,result)=>{

		console.log("result=-=-=-=-=-=-",result);
		if(err){
			res.status(500).send("errr");
		}else{

			console.log("result==-=-=-",res);
			result.like.push(userId);
			result.save();
			res.status(200).send("result");
		}
	})
}

postController.dislike = function(req,res){

	var postId = req.body.postId;
	console.log("postid-=-=-=-",postId);
	var user = req.body.userId;
	console.log("userid[][]][][][][]",user);

	postModel.findOne({_id:postId},function(err,result){
		console.log("postid*****",postId);
		console.log("result__________{}{}{}{",result);
		var index = result.like.indexOf(user);
		console.log(index);
		if(index == -1){
			console.log("userId not found");
			res.status(401).send("Bad Request");
		}
		else{
			result.like.splice(index,1);
			result.save();
			res.send(result);
		}
	})
}



module.exports = postController;