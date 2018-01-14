var express = require('express');
var app = express();
var body_parser = require('body-parser');

var mongoose = require("mongoose");
var PhotoDB = require('./models/photo.js');
var seedDB = require('./seedDB');
var Comment = require('./models/comment');
app.use(express.static(__dirname+'/public'));

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/phc", {
    useMongoClient: true
});

app.set("view engine", "ejs");
app.use(body_parser.urlencoded({
    extended: true
}));

//seedDB();


// INDEX - show all photo
app.get('/', function (request, response) {
    PhotoDB.find({}, function (err, obj) {
        response.render('photo/home', {
            places: obj
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
app.get('/photo/add', function (request, response) {
    response.render("photo/addPhoto");
});

// Show - show broad description of photo
app.get('/photo/:id',function (request,response) {
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

app.get('/photo/:id/comments/new',function(request,response){
    PhotoDB.findById(request.params.id,function(err,photo){
        if (err){
            console.log(err);
        }
        else{
            response.render('comments/addComment',{photo:photo});
        }
    })
});

app.post('/photo/:id/comments',function(request,response){
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



app.listen(3000, function () {
    require('dns').lookup(require('os').hostname(), function (err, add, fam) {
        console.log('http://' + add + ':3000');
    });
});