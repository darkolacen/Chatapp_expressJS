var express = require('express');
var router = express.Router();
var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
var passport = require('passport');
var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";

passport.use(new GoogleStrategy({
    clientID:     '904984450856-bhv9bnsihcd2u31br89dq5132olsah0i.apps.googleusercontent.com',
    clientSecret: 'KhupUOZ2uzDc3mbu3_nJJT6M',
    callbackURL: "http://localhost:3000/prijava/google/callback",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    //TODO: more v bazo al pa nekam dodat usera. Ce ze obstaja pa nic
    MongoClient.connect(url, function(err, client) {
      var db = client.db('mydb');
      if (err) throw err;
      db.collection("Users").findOne({
              'g_id': profile.id
          }, function(err, user) {
              if (err) {
                  return done(err);
              }
              if (!user) {
                  var user = {
                    g_id: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value
                  };
                  db.collection("Users").insertOne(user, function(err, res) {
                    if (err) throw err;
                    console.log("1 document inserted");
                    client.close();
                  });
                  return done(err, user);
              } else {
                  return done(err, user);
              }
        });
      });
    // console.log(profile.displayName);
    // var user = {
    //   g_id: profile.id,
    //   name: profile.displayName,
    //   email: profile.emails[0].value
    // };
    // return done(null, user);

  }
));

router.get('/google', passport.authenticate('google', { scope:
  ['openid email profile']
}));

router.get( '/google/callback', passport.authenticate('google', {
    failureRedirect: '/login'
  }),
  function(req, res) {
    // Authenticated successfully

    req.session.user = req.user;
    res.redirect('/');
  });

  function isUserAuthenticated(req,res,next){
    if(req.session.user){
      res.redirect("/");
    }
    return next();
  }
  router.get('/', isUserAuthenticated, function(req, res, next) {
    res.render('prijava');
  });





module.exports = router;
