/* DEPENDENCIES */
const { validationResult } = require('express-validator');


/* CUSTOM IMPORTS */
const HttpError = require('../models/http-error');
const User = require('../models/userSchema');
const Video = require('../models/videoSchema');
const Notification = require('../models/notificationSchema');


/* ROUTES */
const getAllNotifications = async ( req, res, next ) => {

}


const getNotificationById = async ( req, res, next ) => {
    const nid = req.params.nid;

    let notification;

    try {
        notification = await Notification.findById(nid);
    } catch (error) {
        return next(new HttpError('Cannot find notification. N-1.1', 500));
    }

    return res.status(201).json({ notification: notification.toObject({ getters: true }) });
}


const getNotificationsByUserId = async ( req, res, next ) => {
    let uid = req.params.uid;

    let userNotifications;

    try {
        userNotifications = await User.findById(uid).populate('notifications');
    } catch (error) {
        return next(new HttpError('Cannot find user. N-2.1', 500));
    }

    return res.status(201).json({ notifications: userNotifications.notifications });
}


const postCommentNotification = async ( req, res, next ) => {
    let vid = req.params.vid;
    let sid = req.params.sid;
    let rid = req.params.rid;

    let video;
    let sender;
    let receiver;

    try {
        video = await Video.findById(vid);
    } catch (error) {
        return next(new HttpError('Cannot find video. N-3.1', 500));
    }

    try {
        sender = await User.findById(sid);
    } catch (error) {
        return next(new HttpError('Cannot find user. N-3.2', 500));
    }

    try {
        receiver = await User.findById(rid);
    } catch (error) {
        return next(new HttpError('Cannot find user. N-3.3', 500));
    }

    // if( (sid === rid) || (receiver === sender) ) {
    //     return next(new HttpError('You cannot send a notification to yourself. N-3.3', 500));
    // }

    const notification = new Notification({
        text: `${sender.username} commented on your video: ${video.title}`,
        video: vid,
        sendingUser: sender,
        receivingUser: receiver
    })

    try {
        notification.save();
        receiver.notifications.push(notification.toObject());
        receiver.save();

    } catch (error) {
        // DB could be down, DB validation fails
        return next(new HttpError('Internal error; failed to post comment, please try again. ERR_CODE:2.2', 500));
    }
    
    return res.status(201).json({
        notification: notification.toObject({ getters: true })
    });
}


const postLikeNotification = async ( req, res, next ) => {
    let vid = req.params.vid;
    let sid = req.params.sid;
    let rid = req.params.rid;

    let video;
    let sender;
    let receiver;

    try {
        video = await Video.findById(vid);
    } catch (error) {
        return next(new HttpError('Cannot find video. N-3.1', 500));
    }

    try {
        sender = await User.findById(sid);
    } catch (error) {
        return next(new HttpError('Cannot find user. N-3.2', 500));
    }

    try {
        receiver = await User.findById(rid);
    } catch (error) {
        return next(new HttpError('Cannot find user. N-3.3', 500));
    }

    const notification = new Notification({
        text: `${sender.username} liked your video: ${video.title}`,
        video: vid,
        sendingUser: sender,
        receivingUser: receiver
    })
    
    try {
        notification.save();
        receiver.notifications.push(notification.toObject());
        receiver.save();

    } catch (error) {
        // DB could be down, DB validation fails
        return next(new HttpError('Internal error; failed to post comment, please try again. ERR_CODE:2.2', 500));
    }
    
    return res.status(201).json({
        notification: notification.toObject({ getters: true })
    });
}


const postSubscribeNotification = async ( req, res, next ) => {
    let vid = req.params.vid;
    let sid = req.params.sid;
    let rid = req.params.rid;

    let video;
    let sender;
    let receiver;

    try {
        video = await Video.findById(vid);
    } catch (error) {
        return next(new HttpError('Cannot find video. N-3.1', 500));
    }

    try {
        sender = await User.findById(sid);
    } catch (error) {
        return next(new HttpError('Cannot find user. N-3.2', 500));
    }

    try {
        receiver = await User.findById(rid);
    } catch (error) {
        return next(new HttpError('Cannot find user. N-3.3', 500));
    }

    const notification = new Notification({
        text: `${sender.username} liked your video: ${video.title}`,
        video: vid,
        sendingUser: sender,
        receivingUser: receiver
    })
    
    try {
        notification.save();
        receiver.notifications.push(notification.toObject());
        receiver.save();

    } catch (error) {
        // DB could be down, DB validation fails
        return next(new HttpError('Internal error; failed to post comment, please try again. ERR_CODE:2.2', 500));
    }
    
    return res.status(201).json({
        notification: notification.toObject({ getters: true })
    });
}


const deleteNotification = async ( req, res, next ) => {

}


const clearNotifications = async ( req, res, next ) => {
    const uid = req.params.uid;
    let user;

    try {
        user = await User.findById(uid);
    } catch (error) {
        return next(new HttpError('Internal error; failed to find user, please try again. ERR_CODE:2.2', 500));
    }

    try {
        user.updateOne({ $set: { notifications: [] }}, function(err, affected){
            // console.log('affected: ', affected);
        });
    } catch (error) {
        return next(new HttpError('Internal error; failed to clear notifications, please try again. ERR_CODE:2.2', 500));
    }

    return res.status(201).json({
        msg: 'Notifications cleared.'
    });
}


/* EXPORTS */
exports.getAllNotifications = getAllNotifications;
exports.getNotificationById = getNotificationById;
exports.getNotificationsByUserId = getNotificationsByUserId;
exports.postCommentNotification = postCommentNotification;
exports.postLikeNotification = postLikeNotification;
exports.postSubscribeNotification = postSubscribeNotification;
exports.deleteNotification = deleteNotification;
exports.clearNotifications = clearNotifications;