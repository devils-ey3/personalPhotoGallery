var PhotoDB = require('./models/photo');
var Comment = require('./models/comment');

var data = [{
    title: 'Kira',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSejSzbkd8-sFjgTGo8MD_3XPZDZ0-fIxr1oN3tJwX4OoQRkld7',
    description: "Mar 3, 2017 - In brief: This tutorial shows you how to download and install f.lux in Ubuntu to use the Night Shift feature in Linux. What's Night Shift? Night Shift is one of the most talked about feature in iOS 9.3. It is a display-based setting that cuts down on blue light exposure at night and provides a warm yellow light that's ..."
},
{
    title: 'Misa',
    image: 'https://i.pinimg.com/736x/45/1a/7b/451a7b02c7e9278d8b0b4afd35038539--l-death-note-misa.jpg',
    description: "Mar 3, 2017 - In brief: This tutorial shows you how to download and install f.lux in Ubuntu to use the Night Shift feature in Linux. What's Night Shift? Night Shift is one of the most talked about feature in iOS 9.3. It is a display-based setting that cuts down on blue light exposure at night and provides a warm yellow light that's ..."
},
{
    title: 'Riuk',
    image: 'https://pm1.narvii.com/5999/40423ac9a7cc498856d4d5aa80e976bdb16d81ab_hq.jpg',
    description: "Mar 3, 2017 - In brief: This tutorial shows you how to download and install f.lux in Ubuntu to use the Night Shift feature in Linux. What's Night Shift? Night Shift is one of the most talked about feature in iOS 9.3. It is a display-based setting that cuts down on blue light exposure at night and provides a warm yellow light that's ..."
},]

var photoComment = 
    {
        text:"Kira is a nyc guy",
        author:"Abid"
    };

function cleanUp(params) {
    
    
    Comment.remove({},function(err,result){
        if (err){
            console.log(err);
        }
        else {
            console.log('comment remove');
        }
    });
    PhotoDB.remove({},function(err,result){

        if (err){
            console.log(err);
        }
        else {
            console.log('Removed photo');
            data.forEach(function(seed){
                PhotoDB.create(seed,function(err,output){
                    if (err){
                        console.log(err);
                    }
                    else{
                        Comment.create(photoComment,function(err,comment){
                            if (err){
                                console.log(err);
                            }
                            else{
                                output.comments.push(comment);
                                output.save();
                                console.log('photo added');
                            }
                            
                        })
                    }
                });
            });
        
        }
    });


    
}

module.exports = cleanUp;


