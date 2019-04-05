var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var app = express();
var mongoose = require('mongoose');
var cors = require("cors");
var server = http.Server(app);
var socketIO = require('socket.io');
var io = socketIO(server);
var messageModel = require('./model/message.model');
var userController = require('./controller/user.controller');
var postController = require('./controller/post.controller');
var messageController = require('./controller/message.controller');
var commentController = require('./controller/comment.controller');
var fileUpload = require('express-fileupload');

mongoose.connect('mongodb://localhost:27017/Database', {useNewUrlParser: true})
.then(() => {console.log("connected")})
.catch(err => {console.log(err)});

app.use(fileUpload());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/user/signUp',userController.signUp);
app.post('/user/logIn' ,userController.logIn);
app.get('/user',userController.searchUser);
app.post('/user/follow',userController.addFriend);
app.post('/user/unFollow',userController.unFollow);
app.get('/user/:id',userController.getUserById);
app.get('/user/get-friend/:requestedUser',userController.getMyAllFriendsById);
app.post('/user/file-upload',userController.uploadFile);
app.post('/user/updatedata',userController.update);


app.post('/post',postController.addPost);
app.get('/post',postController.getPosts);
app.get('/post/:userId',postController.getUsersPost);
app.put('/post',postController.deletePost);
app.get('/post',postController.getPostById);
app.put('/post',postController.updatePost);
app.get('/post/get-friend-post/:requestedUser',postController.getMyFriendPost);
app.post('/post/like',postController.like);
app.post('/post/dislike', postController.dislike);

app.post('/comment',commentController.userComment);
app.get('/comment/getcomment/:id',commentController.getComment);

app.post('/message',messageController.getAllMessage);

app.post('/post/file-upload', postController.uploadFile);
const port = process.env.PORT || 3000;

io.on('connection', (socket) => {
    console.log('user connected');

    socket.on('new-message', (message) => {
      console.log(message);
      var msg = new messageModel(message);
      msg.save(function(){
      io.emit('new-message',message);
      	
      })
    });
});

server.listen(port, () => {
    console.log(`started on port: ${port}`);
});
