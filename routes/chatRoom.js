var express = require('express');
var router = express.Router();
var http = require('http').Server(express),
  url = require('url'),
  fs = require('fs');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";
var ObjectId = require('mongodb').ObjectId;
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' })




function isUserAuthenticated(req, res, next) {

  if (req.session.user) {
    return next();
  }
  res.redirect("/prijava");
}



router.post('/', isUserAuthenticated, function(req, res, next) {
  var chatRoomID = req.body.chatRoomID;
  var chatRoomName = req.body.chatRoomName;
  var allUsers = null;
  var allFiles = null;
  MongoClient.connect(url, function(err, client) {
    var db = client.db('mydb');
    if (err) throw err;

    db.collection("ChatRooms").findOne({_id: ObjectId(chatRoomID)}, (err, result) => {
      allUsers = result.users;
      client.close();
    });

    db.collection("Files").find({"chatRoomID" : chatRoomID}).toArray(function(err, result) {
      if (err) throw err;
      allFiles = result;

      client.close();
    });
      
    
    db.collection("Messages").find({"chatRoomID" : chatRoomID}).toArray(function(err, result) {
      if (err) throw err;
      
      res.render('chatRoom', {
        user: req.session.user,
        allMessages: result,
        chatRoomID: chatRoomID,
        chatRoomName: chatRoomName,
        allUsers: allUsers,
        allFiles: allFiles
      });

      client.close();
    });
    
  });
  
});

router.get('/download/fileName/:fileName/originalName/:originalName',isUserAuthenticated,(req, res) => {
  var file = req.params;

  res.download('./uploads/' + file.fileName, file.originalName); 
});



router.post('/addUser', isUserAuthenticated, function(req, res, next) {
  var addEmail = req.body.email;
  var chatRoomID = req.body.chatRoomID;
  MongoClient.connect(url, function(err, client) {
    var db = client.db('mydb');
    if (err) throw err;
    
    db.collection("ChatRooms").updateOne({_id: ObjectId(chatRoomID)}, { $push: { users: addEmail } }, function(err, res) {
        if (err) throw err;
        console.log("1 email updated");
        client.close();
    });

  });
  res.redirect('/');
  
});

router.post('/upload', upload.single('dat'), (req, res) => {

  var fileToUpload = {
    chatRoomID: req.body.chatRoomID,
    originalName: req.file.originalname,
    fileName: req.file.filename
  }


  MongoClient.connect(url, function(err, client) {
    var db = client.db('mydb');
    if (err) throw err;
    
    db.collection("Files").insertOne(fileToUpload, function(err, res) {
      if (err) throw err;
      console.log("1 File inserted");
      client.close();
    });

  });

  console.log(req.file);
  res.redirect('/');
});






module.exports = router;