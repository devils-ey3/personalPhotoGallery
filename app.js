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

// Send authUser with every response which is rendered
app.use(function(request,response,next){
    response.locals.authUser = request.user;
    next();
})

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


// INDEX - show all photo
app.get('/', function (request, response) {
    response.render('index');
});

app.get('/photo', function (request, response) {
    PhotoDB.find({}, function (err, obj) {
        response.render('photo/home', {
            places: obj, authUser:request.user
        });
    });
});

// Create - add new photo
app.post('/photo', function (request, response) {

    if (request.body.description.trim()===''){
        request.body.description = 'Null';
    }

    PhotoDB.create({
        title: request.body.title,
        image: request.body.image,
        description: request.body.description
    }, function (err, obj) {
        if (err) {
            console.log(err);
        } 
    });
    response.redirect('/');
});

// New - show form for create new photo post
app.get('/photo/add', isLoggedIn ,function (request, response) {
    response.render("photo/addPhoto");
});

// Show - show broad description of photo
app.get('/photo/:id',isLoggedIn,function (request,response) {
    PhotoDB.findById(request.params.id).populate('comments').exec(function(err,obj){
        if (err){
            console.log(err);
        }
        else{
            response.render('photo/show',{data:obj});
        }
        // title
        // image
        // description
        // AUTHOR
        // COMMENTS
    });

});

// ============= COMMENT SECTION =============

// create new comment

app.get('/photo/:id/comments/new',isLoggedIn,function(request,response){
    PhotoDB.findById(request.params.id,function(err,photo){
        if (err){
            console.log(err);
        }
        else{
            response.render('comments/addComment',{photo:photo});
        }
    })
});

app.post('/photo/:id/comments',isLoggedIn,function(request,response){
    PhotoDB.findById(request.params.id,function(err,photoInfo){
        if (err){
            console.log(err);
        }
        else{
            Comment.create(request.body.comment,function(err,comment){
                if (err){
                    console.log(err);
                }
                else{
                    photoInfo.comments.push(comment);
                    photoInfo.save();
                    response.redirect('/photo/'+request.params.id);
                }
            });
        }
    });

});

// ===================================
//          Authentication routes
// ===================================

// ==========================
//  Registration route
app.get('/register',function(request,response){
    response.render('authentication/register');
});

app.post('/register',function(request,response){
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


app.get('/login',function(request,response){
    response.render('authentication/login');
});
// app.post(route,middlewire,callback)
app.post('/login',passport.authenticate("local",{
    successRedirect:"/photo",
    failureRedirect:"/login"
}),function(request,response){
    
});

// =====================
// Logout route

app.get('/logout',function(request,response){
    request.logout();
    response.redirect('/');
})

function isLoggedIn(request,response,next){
    if (request.isAuthenticated()){
        return next();
    }
    response.redirect('/login');
};

app.listen(3000, function () {
    require('dns').lookup(require('os').hostname(), function (err, add, fam) {
        console.log('http://' + add + ':3000');
    });
});

