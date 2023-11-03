/* DEPENDENCIES */
const mongoose = require('mongoose');
const Schema = mongoose.Schema; 


/* SCHEMA */
const commentSchema = new Schema({
    text: {
        type: String,
        required: true,
        trim: true,
        maxlength: 250
    },
    replies: [
        {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: 'Reply'
        }
    ],
    likes: {
        type: Number,
        required: true,
        default: 0
    },
    creatorName: {
        type: String,
        required: true,
        trim: true
    },
    creatorImage: {
        type: String,
        required: true
    },
    belongsTo: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Video'
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
module.exports = mongoose.model('Comment', commentSchema);