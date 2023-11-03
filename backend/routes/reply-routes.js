/* DEPENDENCIES */
const express = require('express');
const replyRouter = express.Router();


/* CUSTOM IMPORTS */
const replyController = require('../controllers/replies-controller');


/* LOCAL VARIABLES */
const {
    getRepliesByUserId,
    getRepliesByCommentId,
    postReply,
} = replyController;


/* ROUTES */
// get replies by user id
replyRouter.get('/user/:uid', getRepliesByUserId);

// get replies by comment id
replyRouter.get('/comment/:cid', getRepliesByCommentId);

// post new reply
replyRouter.post('/:cid', postReply);


/* EXPORTS */
module.exports = replyRouter;