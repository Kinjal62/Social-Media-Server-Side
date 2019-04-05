var messageModel = require('../model/message.model');

var messageController = {};


messageController.getAllMessage = function(req,res){

	
	var srcId = req.body.srcId;
	var dstId = req.body.dstId;
	messageModel.find({
		$or:[
			{$and :[{srcId:srcId},{dstId:dstId}]},
			{$and :[{srcId:dstId},{dstId:srcId}]}
		]}, function(err,result){
		res.send(err || result);
		console.log(result);
	})
}

module.exports = messageController;