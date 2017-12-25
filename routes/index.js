var express = require('express');
var router = express.Router();
var http = require('http'),
	url = require('url'),
	fs = require('fs');

var messages = ["hello"];
var clients = [];



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    messages: messages
  });
});
router.get('/poll/*', function(req, res, next) {
  var count = url.parse(req.url).pathname.replace(/[^0-9]*/, '');
	console.log(count);
	if(messages.length > count) {
		res.end(JSON.stringify( {
			count: messages.length,
			append: messages.slice(count).join('\n')+'\n'
		}));
	} else {
		clients.push(res);
	}
});
router.post('/newmsg', function(req, res, next) {
  var msg = messages.push(unescape(req.body.sporocilo));
  while(clients.length > 0) {
		var client = clients.pop();
		client.end(JSON.stringify( {
			count: messages.length,
			append: msg+'\n'
		}));
	}
  res.render('index', {
    messages: messages
  });
});


module.exports = router;
