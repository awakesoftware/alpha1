/* DEPENDENCIES */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


/* SCHEMA */
const notificationSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    video: {
        type: String,
        required: true
    },
    posted: {
        type: Date,
        required: true,
        default: Date.now
    },
    sendingUser: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    receivingUser: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})


/* EXPORT & MODEL */
module.exports = mongoose.model('Notification', notificationSchema);