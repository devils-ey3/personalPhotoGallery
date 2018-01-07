var mongoose = require('mongoose');

var photoSchema = new mongoose.Schema({
    title: String,
    image: String,
    description: String,
    comments : [{
        type:mongoose.Schema.Types.ObjectId,
        ref:'comment'
    }]
});

module.exports =  mongoose.model("PhotoDB", photoSchema);