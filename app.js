var app = require('express')();
var body_parser = require('body-parser');
var mongoose = require("mongoose");
var PhotoDB = require('./models/photo.js');
mongoose.connect("mongodb://localhost/phc", {
    useMongoClient: true
});

app.set("view engine", "ejs");
app.use(body_parser.urlencoded({
    extended: true
}));




// INDEX - show all photo
app.get('/', function (request, response) {
    PhotoDB.find({}, function (err, obj) {
        response.render('home', {
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
    response.render("addPhoto");
});

// Show - show broad description of photo
app.get('/photo/:id',function (request,response) {
    PhotoDB.findById(request.params.id,function(err,obj){
        response.render('show',{data:obj});
        // title
        // image
        // description
    });

});

app.listen(3000, function () {
    require('dns').lookup(require('os').hostname(), function (err, add, fam) {
        console.log('http://' + add + ':3000');
    });
});