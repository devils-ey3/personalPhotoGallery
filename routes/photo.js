var express = require('express');
var router = express.Router();
var PhotoDB = require('../models/photo');
var Comment = require('../models/comment');


// INDEX - show all photo
router.get('/', function (request, response) {
    PhotoDB.find({}, function (err, obj) {
        response.render('photo/home', {
            places: obj, authUser:request.user
        });
    });
});

// Create - add new photo
router.post('/',isLoggedIn, function (request, response) {

    if (request.body.description.trim()===''){
        request.body.description = 'Null';
    }
    PhotoDB.create({
        title: request.body.title,
        image: request.body.image,
        description: request.body.description,
        author:{
            id:request.user._id,
            username:request.user.username
        },
    }, function (err, obj) {
        if (err) {
            console.log(err);
        } 
    });
    response.redirect('/');
});

// New - show form for create new photo post
router.get('/add', isLoggedIn ,function (request, response) {
    response.render("photo/addPhoto");
});

// Show - show broad description of photo
router.get('/:id',function (request,response) {
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

// EDIT route
router.get('/:id/edit',checkAuthorizationOfPost,function(request,response){

    // Authentication user

   
        PhotoDB.findById(request.params.id,function(err,data){
            if (err){
                console.log(err);
            }
           else{
            response.render('photo/edit',{data:data});
           }
        });
});
    

// UPDATE route
router.put("/:id",checkAuthorizationOfPost,function(request,response){
    PhotoDB.findByIdAndUpdate(request.params.id,request.body.photo,function(err,status){
        if (err){
            console.log(err);
        }
        else{
            response.redirect('/photo/'+request.params.id);
        }
    });
});

// Delete route
router.delete('/:id',checkAuthorizationOfPost,function(request,response){
    PhotoDB.findByIdAndRemove(request.params.id,function(err,status){
        if (err){
            console.log(err);
        }
        else{
            response.redirect('/photo');
        }
    });
});

// authentication middlewire
function isLoggedIn(request,response,next){
    if (request.isAuthenticated()){
        return next();
    }
    response.redirect('/login');
};

// authorization middlewire
function checkAuthorizationOfPost(request,response,next){
        // Authentication user

        if (request.isAuthenticated()){
            PhotoDB.findById(request.params.id,function(err,data){
                if (err){
                    response.redirect("back"); // back you where the link is
                }
                else {
                    // authorization user
                    if (data.author.id.equals(request.user._id)){
                       next();
                    }
                    else{
                        response.redirect("back");
                    }
                }
            });
        }
        else{
            response.redirect("back");
        }
}


module.exports = router;