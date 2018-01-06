var mongoose = require('mongoose');

var photoSchema = new mongoose.Schema({
    title: String,
    image: String,
    description: String
});

var PhotoDB = mongoose.model("PhotoDB", photoSchema);

module.exports = PhotoDB;