var express = require('express');
var router = express.Router();
var http = require('http').Server(express),
  url = require('url'),
  fs = require('fs');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";

function isUserAuthenticated(req, res, next) {

  if (req.session.user) {
    return next();
  }
  res.redirect("/prijava");
}



router.get('/', isUserAuthenticated, function(req, res, next) {
  var allMessages = null;
  MongoClient.connect(url, function(err, client) {
    var db = client.db('mydb');
    if (err) throw err;
    
    db.collection("Messages").find({}).toArray(function(err, result) {
      if (err) throw err;
      
      res.render('index', {
        user: req.session.user,
        allMessages: result
      });

      client.close();
    });
    
  });
  
});

// router.post('/newmsg', function(req, res, next) {
//   var now = new Date();
//   // Cas in datum v JSON format
//   var jsonDate = now.toJSON();
//   //Cas in datum iz JSON v JS
//   //var normalDate = new Date(jsonDate);
//   var msg = {
//     user_g_id: req.session.user.g_id,
//     name: req.session.user.name,
//     msg_content: req.body.sporocilo,
//     date_time: jsonDate
//   };

//   MongoClient.connect(url, function(err, client) {
//       var db = client.db('mydb');
//       if (err) throw err;
      
//       db.collection("Messages").insertOne(msg, function(err, res) {
//         if (err) throw err;
//         console.log("1 msg inserted");
//         client.close();
//       });
      
// });

//   res.redirect('/');
// });


module.exports = router;