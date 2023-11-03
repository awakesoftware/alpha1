/* DEPENDENCIES */
const express = require('express');
const commentRouter = express.Router();


/* CUSTOM IMPORTS */
const commentsController = require('../controllers/comments-controller');


/* LOCAL VARIABLES */
const {
    getAllComments,
    getCommentByCommentId,
    getCommentsByUserId,
    getCommentsByVideoId,
    postComment,
    likeComment,
    editComment,
    deleteComment
} = commentsController;


/* ROUTES */
// get all comments
commentRouter.get('/', getAllComments);

// get comment by comment id
commentRouter.get('/comment/:cid', getCommentByCommentId);

// get comments by user id
commentRouter.get('/user/:uid', getCommentsByUserId);

// get comments by video id
commentRouter.get('/video/:vid', getCommentsByVideoId);

// post new comment
commentRouter.post('/:vid', postComment);

// like comment
commentRouter.put('/comment/like/:cid', likeComment);

// edit comment
commentRouter.put('/comment/edit/:cid', editComment);

// delete comment
commentRouter.delete('/', deleteComment);


/* EXPORTS */
module.exports = commentRouter;