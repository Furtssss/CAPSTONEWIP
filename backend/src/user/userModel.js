var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({

    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    seriesNum: {
        type: Number,
        required: true
    },
    trackNum: {
        type: Number,
        required: false
    }

});

module.exports = mongoose.model('user', userSchema);