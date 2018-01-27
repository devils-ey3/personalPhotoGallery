var express = require('express');
var app = express();
var body_parser = require('body-parser');
var passport = require('passport');
var localStrategy = require('passport-local');
var mongoose = require("mongoose");
var PhotoDB = require('./models/photo');
var seedDB = require('./seedDB');
var Comment = require('./models/comment');
var User = require('./models/users');

var photoRoute = require('./routes/photo'),
    commentRoute = require('./routes/comments'),
    indexRoute = require('./routes/index');

app.use(express.static(__dirname+'/public'));

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/phc", {
    useMongoClient: true
});
 
app.set("view engine", "ejs");
app.use(body_parser.urlencoded({
    extended: true
}));

app.use(require('express-session')({
    secret:"Damish",
    resave:false,
    saveUninitialized:false

}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate())); // User.autheicated come from users plugin
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//seedDB();

// Send authUser with every response which is rendered
app.use(function(request,response,next){
    response.locals.authUser = request.user;
    next();
})

function isLoggedIn(request,response,next){
    if (request.isAuthenticated()){
        return next();
    }
    response.redirect('/login');
};

app.use(indexRoute);
app.use("/photo",photoRoute);
app.use("/photo/:id/comments",commentRoute);

app.listen(3000, function () {
    require('dns').lookup(require('os').hostname(), function (err, add, fam) {
        console.log('http://' + add + ':3000');
    });
});

