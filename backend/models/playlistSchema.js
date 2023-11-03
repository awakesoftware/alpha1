/* DEPENDENCIES */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


/* SCHEMA */
const playlistSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 5
    },
    videos: [
        {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: 'Video'
        }
    ],
    about: {
        type: String
    },
    private: {
        type: Boolean,
        required: true
    },
    creator: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    created: {
        type: Date,
        default: Date.now
    }
});


/* EXPORT & MODEL */
module.exports = mongoose.model('Playlist', playlistSchema);