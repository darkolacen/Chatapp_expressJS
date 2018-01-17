var express = require('express');
var router = express.Router();
var http = require('http').Server(express),
  url = require('url'),
  fs = require('fs');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";
var ObjectId = require('mongodb').ObjectId;

function isUserAuthenticated(req, res, next) {

  if (req.session.user) {
    return next();
  }
  res.redirect("/prijava");
}



router.post('/', isUserAuthenticated, function(req, res, next) {
  var allMessages = null;
  var chatRoomID = req.body.chatRoomID;
  var chatRoomName = req.body.chatRoomName;
  MongoClient.connect(url, function(err, client) {
    var db = client.db('mydb');
    if (err) throw err;
    
    db.collection("Messages").find({"chatRoomID" : chatRoomID}).toArray(function(err, result) {
      if (err) throw err;
      
      res.render('chatRoom', {
        user: req.session.user,
        allMessages: result,
        chatRoomID: chatRoomID,
        chatRoomName: chatRoomName
      });

      client.close();
    });
    
  });
  
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




module.exports = router;