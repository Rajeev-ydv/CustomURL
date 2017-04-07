var express = require('express');
var router = express.Router();
var api = require('../api/shortv1');
var UserModel = require('../models/USERModel.js');

var cookieParser = require('cookie-parser');
var session = require('express-session');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

router.use(session({secret : '221B Bakers Street',
                    resave: false,
                    saveUninitialized: false}));
router.use(cookieParser());
router.use(passport.initialize());
router.use(passport.session());

passport.use(new LocalStrategy( function(user, password, done) {
    UserModel.findOne({username : user, password : password}, function(err, userfound) {
        if(userfound) {
            return done(null, userfound, {message : 'Loggin You In'});
        }else {
            return done(null, false, {message : 'No such user/password in database'});  
        }
    });
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(id, done) {
  UserModel.findById(id, function(err, user) {
        done(err, user);
    })
 }) ;


//GET REQUESTS

router.get('/login', function(req, res) {
    res.render('login');
});

router.get('/register', function (req, res) {
    res.render('register');
});


router.get('/logout', function(req, res) {
    req.logout();
    res.render('index');
});

router.get('/profile', function (req, res)  {
  if(req.isAuthenticated())
    res.render("profile", {user : req.user});
  else
    res.send("You need to be logged in to see this page");

});

//POST REQUESTS

router.post('/login', passport.authenticate('local'), function(req, res) {
    console.log(req.isAuthenticated());
    res.redirect('/');
});

router.post('/register', function(req, res) {
    var user = req.body;
    UserModel.findOne({username: user.username}, function (err, found) {
        if(found) {
            res.render("register", {message:'User with username '+ found.username+' already exists in database'});
        } else {
            var newUser = new UserModel(user);
            newUser.save();
            res.json(user);
        }
    }); 
    console.log('NEW USER IS ===> ', user);
});

module.exports = router;



