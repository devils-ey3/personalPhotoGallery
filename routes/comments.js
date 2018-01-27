var express = require('express');
var router = express.Router({mergeParams:true}); // mergeParam = true because we need to access :id which is defined in app.js
var PhotoDB = require('../models/photo');
var Comment = require('../models/comment');


// ============= COMMENT SECTION =============

// create new comment

router.get('/new',isLoggedIn,function(request,response){
    PhotoDB.findById(request.params.id,function(err,photo){
        if (err){
            console.log(err);
        }
        else{
            response.render('comments/addComment',{photo:photo});
        }
    })
});

router.post('/',isLoggedIn,function(request,response){
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


function isLoggedIn(request,response,next){
    if (request.isAuthenticated()){
        return next();
    }
    response.redirect('/login');
};

module.exports = router;