/* DEPENDENCIES */
const express = require('express');
const notificationRouter = express.Router();


/* CUSTOM IMPORTS */
const notificationsController = require('../controllers/notifications-controller');


/* LOCAL VARIABLES */
const {
    getAllNotifications,
    getNotificationById,
    getNotificationsByUserId,
    postCommentNotification,
    postLikeNotification,
    postSubscribeNotification,
    deleteNotification,
    clearNotifications
} = notificationsController;


/* ROUTES */
// get all notifications
notificationRouter.get('/', getAllNotifications);

// get notification by id
notificationRouter.get('/:nid', getNotificationById);

// get notifications by user id
notificationRouter.get('/user/:uid', getNotificationsByUserId);

// post new comment notification
notificationRouter.post('/comment/:vid/:sid/:rid', postCommentNotification);

// post new like notification
notificationRouter.post('/like/:vid/:sid/:rid', postLikeNotification);

// post new subscriber notification
notificationRouter.post('/subscribe/:sid/:rid', postSubscribeNotification);

// delete notification
notificationRouter.delete('/', deleteNotification);

// clear all notifications by userId
notificationRouter.delete('/:uid', clearNotifications);


/* EXPORTS */
module.exports = notificationRouter;