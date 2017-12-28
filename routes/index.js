var express = require('express');
var router = express.Router();
var http = require('http'),
  	url = require('url'),
  	fs = require('fs');
var JFile=require('jfile');

var MongoClient = require('mongodb').MongoClient

MongoClient.connect('mongodb://localhost', function (err, client) {
  if (err) throw err;

  var db = client.db('mydb');

  db.collection('mycol').findOne({}, function (findErr, result) {
    if (findErr) throw findErr;
    console.log(result.email);
    client.close();
  });
});

var messages_arr=new JFile("messages.txt");
var messages = messages_arr.lines;
var clients = [];
function isUserAuthenticated(req,res,next){
  if(req.session.user){
    return next();
  }
  res.redirect("/prijava");
}



/* GET home page. */
router.get('/', isUserAuthenticated, function(req, res, next) {
  console.log(req.session.user.name);
  res.render('index', {
    user: req.session.user,
    sporocila: messages
  });
});
// router.get('/poll/*', function(req, res, next) {
//   var count = url.parse(req.url).pathname.replace(/[^0-9]*/, '');
// 	console.log(count);
// 	if(messages.length > count) {
// 		res.end(JSON.stringify( {
// 			count: messages.length,
// 			append: messages.slice(count).join('\n')+'\n'
// 		}));
// 	} else {
// 		clients.push(res);
// 	}
// });
router.post('/newmsg', function(req, res, next) {
  var msg = messages.push(unescape(req.body.sporocilo));
  var file = fs.createWriteStream('messages.txt');
  file.on('error', function(err) {});
  messages.forEach(function(v) { file.write(v + '\n'); });
  file.end();
  // while(clients.length > 0) {
	// 	var client = clients.pop();
	// 	client.end(JSON.stringify( {
	// 		count: messages.length,
	// 		append: msg+'\n'
	// 	}));
	// }
  res.render('index', {
    user: req.session.user,
    sporocila: messages
  });
});


module.exports = router;
