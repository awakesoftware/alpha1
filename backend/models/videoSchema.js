/* DEPENDENCIES */
const mongoose = require('mongoose');
const Schema = mongoose.Schema; 


/* SCHEMA */
const videoSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 75
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 250
    },
    category: {
        type: String,
        required: true,
        enum: [
            'default',
            'action',
            'animation',
            'bts',
            'fantasy',
            'historical',
            'thriller'
        ],
        default: 'default'
    },
    private: {
        type: Boolean,
        required: true
    },
    thumbnailPath: {
        type: String,
        required: true
    },
    filePath: {
        type: String,
        required: true
    },
    comments: [
        {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: 'Comment'
        }
    ],
    views: {
        type: Number,
        required: true,
        default: 0
    },
    likes: {
        type: Number,
        required: true,
        default: 0
    },
    displaying: {
        type: Boolean,
        required: true,
        default: true
    },
    posted: {
        type: Date,
        required: true,
        default: Date.now
    },
    // creatorName: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },
    // creatorImage: {
    //     type: String,
    //     required: true
    // },
    creator: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})


/* EXPORT & MODEL */
module.exports = mongoose.model('Video', videoSchema);