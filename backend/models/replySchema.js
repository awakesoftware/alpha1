/* DEPENDENCIES */
const mongoose = require('mongoose');
const Schema = mongoose.Schema; 


/* SCHEMA */
const replySchema = new Schema({
    text: {
        type: String,
        required: true,
        trim: true,
        maxlength: 250
    },
    creatorName: {
        type: String,
        required: true,
        trim: true
    },
    likes: {
        type: Number,
        required: true,
        default: 0
    },
    creatorImage: {
        type: String,
        required: true
    },
    belongsTo: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Comment'
    },
    posted: {
        type: Date,
        required: true,
        default: Date.now
    },
    creator: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})


/* EXPORT & MODEL */
module.exports = mongoose.model('Reply', replySchema);