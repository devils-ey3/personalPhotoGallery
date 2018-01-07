var mongoose = require('mongoose');

var photoSchema = new mongoose.Schema({
    title: String,
    image: String,
    description: String
});

module.exports =  mongoose.model("PhotoDB", photoSchema);