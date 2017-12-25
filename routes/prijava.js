var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('prijava', {
    naslov: "Naslov"
  });
});

router.post('/forma', function(req, res, next) {
  res.render('prijava', {
    naslov: "Naslov",
    ime: req.body.ime,
    stevilo: 4
  });
});

module.exports = router;
