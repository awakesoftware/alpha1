/* DEPENDENCIES */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');


/* SCHEMA */
const userSchema = new Schema({
    image: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 20
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 20
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 6,
        maxlength: 18,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        minlength: 10,
        maxlength: 10,
    },
    // address: {
    //     home: {
    //         street: {
    //             type: String,
    //             required: true
    //         },
    //         city: {
    //             type: String,
    //             required: true
    //         },
    //         state: {
    //             type: String,
    //             required: true,
    //             maxlength: 2
    //         },
    //         zip: {
    //             type: Number,
    //             required: true,
    //             minlength: 5
    //         }
    //     }
    // },
    videos: [
        {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: 'Video'
        }
    ],
    notifications: [
        {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: 'Notification'
        }
    ],
    subscribedTo: [
        {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: 'User'
        }
    ],
    mySubscribers: [
        {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: 'User'
        }
    ],
    about: {
        type: String,
        required: true,
        default: "Welcome to my page!"
    },
    later: [
        {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: 'Video'
        }
    ],
    playlists: [
        {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: 'Playlist'
        }
    ],
    liked: [
        {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: 'Video'
        }
    ],
    likedComments: [
        {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: 'Comment'
        }
    ],
    history: [
        {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: 'Video'
        }
    ],
    memberSince: {
        type: Date,
        default: Date.now
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});


/* EMAIL QUERIES */
userSchema.plugin(uniqueValidator);


/* EXPORT & MODEL */
module.exports = mongoose.model('User', userSchema);