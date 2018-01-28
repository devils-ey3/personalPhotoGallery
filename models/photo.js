var mongoose = require('mongoose');

var photoSchema = new mongoose.Schema({
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String
    },
    title: String,
    image: String,
    description: String,
    comments : [{
        type:mongoose.Schema.Types.ObjectId,
        ref:'comment'
    }]
});

module.exports =  mongoose.model("PhotoDB", photoSchema);

