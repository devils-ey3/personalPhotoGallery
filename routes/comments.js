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
                    comment.author.id = request.user._id;
                    comment.author.username = request.user.username;
                    comment.save();
                    photoInfo.comments.push(comment);
                    photoInfo.save();
                    console.log(comment);
                    response.redirect('/photo/'+request.params.id);
                }
            });
        }
    });

});

// edit comment
// /photo/:id/comments/:commentID/edit
router.get('/:commentID/edit',function(request,response){
    Comment.findById(request.params.commentID,function(err,comment){
        if (err){
            console.log(err);
        }
        else{
            response.render('comments/editComment',{postid:request.params.id,comment:comment});
        }
    });
});

// update comment
router.put('/:commentID',function(request,response){
    // console.log(request.body.comment.text);
    // console.log(request.params.commentID);
    // Comment.findById(request.params.commentID,function(err,result){
    //     console.log(result);
    // });


    // request.body.comment this should be an object
    Comment.findByIdAndUpdate(request.params.commentID,request.body.comment,function(err,comment){
        if (err){
            console.log('back');
        }
        else{
            response.redirect('/photo/'+request.params.id);
        }
    });
});


// delete comment

router.delete('/:commentID',function(request,response){
    // console.log(request.body.comment.text);
    // console.log(request.params.commentID);
    // Comment.findById(request.params.commentID,function(err,result){
    //     console.log(result);
    // });


    // request.body.comment this should be an object
    Comment.findByIdAndRemove(request.params.commentID,function(err,comment){
        if (err){
            console.log('back');
        }
        else{
            response.redirect('/photo/'+request.params.id);
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