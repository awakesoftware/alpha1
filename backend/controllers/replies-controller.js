/* DEPENDENCIES */
const { validationResult } = require('express-validator');


/* CUSTOM IMPORTS */
const HttpError = require('../models/http-error');
const User = require('../models/userSchema');
const Video = require('../models/videoSchema');
const Comment = require('../models/commentSchema');
const Reply = require('../models/replySchema');


/* ROUTES */
const getRepliesByUserId = async ( req, res, next ) => {
    
}


const getRepliesByCommentId = async ( req, res, next ) => {
    const cid = req.params.cid;
    let replies;

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return next(new HttpError(`Error: ${ errors.array()[0].msg }`, 422));
    }

    try {
        replies = await Reply.find({ belongsTo: cid });
    } catch (error) {
        return next(new HttpError(`Error: ${error} - Cannot find video/comments.`, 422));
    }

    return res.status(201).json({
        replies: replies.reverse().map(reply => reply.toObject({getters: true}))
    })    
}


const postReply = async ( req, res, next ) => {
    const cid = req.params.cid;
    const { text, creator } = req.body;

    let comment;
    let user;

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return next(new HttpError(`Error: ${ errors.array()[0].msg }`, 422));
    }

    try {
        comment = await Comment.findById(cid);
    } catch (error) {
        return next(new HttpError(`Error: ${error} - Cannot find comment.`, 422));
    }

    try {
        user = await User.find({ _id: creator }, "email firstName lastName username image" )
    } catch (error) {
        return next(new HttpError(`Error: ${error} - Cannot find user.`, 422));
    }

    const fullName = user[0].firstName + " " + user[0].lastName;
    const image = user[0].image;

    const newReply = new Reply({
        text,
        creator,
        likes: 0,
        creatorName: fullName,
        creatorImage: image,
        belongsTo: comment
    })

    try {
        newReply.save();
        comment.replies.push(newReply);
        comment.save();

    } catch (error) {
        // DB could be down, DB validation fails
        return next(new HttpError('Internal error; failed to post reply, please try again. ERR_CODE:2.2', 500));
    }

    return res.status(201).json({
        comment: comment.toObject({ getters: true }),
        newReply
    })
}


/* EXPORTS */
exports.getRepliesByUserId = getRepliesByUserId;
exports.getRepliesByCommentId = getRepliesByCommentId;
exports.postReply = postReply;