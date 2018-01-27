var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/users');
var PhotoDB = require('../models/photo');

// Root route

router.get('/', function (request, response) {
    PhotoDB.find({}, function (err, obj) {
        response.render('index', {
            places: obj
        });
    });
    
});

// ===================================
//          Authentication routes
// ===================================

// ==========================
//  Registration route
router.get('/register',function(request,response){
    response.render('authentication/register');
});

router.post('/register',function(request,response){
    User.register(new User({username:request.body.username}),request.body.password,function(err,user){
        if (err){
            console.log(err);
            return response.render('authentication/register');
        }
        passport.authenticate('local')(request,response,function(){
            response.redirect('/');
        });
    });
});

// Login route


router.get('/login',function(request,response){
    response.render('authentication/login');
});

// app.post(route,middlewire,callback)
router.post('/login',passport.authenticate("local",{
    successRedirect:"/photo",
    failureRedirect:"/login"
}),function(request,response){
    
});

// =====================
// Logout route

router.get('/logout',function(request,response){
    request.logout();
    response.redirect('/');
});

function isLoggedIn(request,response,next){
    if (request.isAuthenticated()){
        return next();
    }
    response.redirect('/login');
};


module.exports = router;