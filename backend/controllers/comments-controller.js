/* DEPENDENCIES */
const { validationResult } = require('express-validator');


/* CUSTOM IMPORTS */
const HttpError = require('../models/http-error');
const User = require('../models/userSchema');
const Video = require('../models/videoSchema');
const Comment = require('../models/commentSchema');


/* ROUTES */
const getAllComments = async ( req, res, next ) => {
    // let comments;

    // const errors = validationResult(req);
    // if(!errors.isEmpty()) {
    //     return next(new HttpError(`Error: ${ errors.array()[0].msg }`, 422));
    // }

    // try {
    //     comments = await Comment.find({});
    // } catch (error) {
    //     return next(new HttpError('Internal error; users cannot be retrieved. ERR_CODE:5.1', 500));
    // }

    // if(!comments || comments.length === 0) {
    //     return next(new HttpError('No users found.', 404));
    // }
    
    return res.status(200).json({ comments: comments.map( comment => comment.toObject({ getters: true }) ) });
}


const getCommentByCommentId = async ( req, res, next ) => {
    const cid = req.params.cid;
    let comment;

    try {
        comment = await Comment.findById(cid);
    } catch (error) {
        return next(new HttpError(`Error: ${error} - Cannot find comment.`, 422));
    }

    return res.status(200).json({ comment: comment });
}


const getCommentsByUserId = async ( req, res, next ) => {
    // const uid = req.params.uid;

    // const errors = validationResult(req);
    // if(!errors.isEmpty()) {
    //     return next(new HttpError(`Error: ${ errors.array()[0].msg }`, 422));
    // }

    // let userComments;
    
    // try {
    //     userComments = await User.findById(uid).populate('comments');
    // } catch (error) {
    //     // error in userId
    //     return next(new HttpError('Internal error; fetching videos failed. ERR_CODE:1.2', 500));
    // }
    
    // if(!userComments.videos || userComments.videos.length === 0) {
    //     // return next(new HttpError('No videos found for this user.', 404));
    // }

    // return res.status(200).json({ videos: userComments.videos.map( video => video.toObject({ getters: true }) ) });
}


const getCommentsByVideoId = async ( req, res, next ) => {
    const vid = req.params.vid;
    let comments;

    const errors = validationResult(req); 
    if(!errors.isEmpty()) {
        return next(new HttpError(`Error: ${ errors.array()[0].msg }`, 422));
    }

    try {
        comments = await Comment.find({ belongsTo: vid });
    } catch (error) {
        return next(new HttpError(`Error: ${error} - Cannot find video/comments.`, 422));
    }

    return res.status(200).json({
        comments: comments.reverse().map(comment => comment.toObject({getters: true}))
    })
}


const postComment = async ( req, res, next ) => {
    const vid = req.params.vid;

    const { text, creator } = req.body;

    let video;
    let user;

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return next(new HttpError(`Error: ${ errors.array()[0].msg }`, 422));
    }

    try {
        video = await Video.findById(vid);
    } catch (error) {
        return next(new HttpError(`Error: ${error} - Cannot find video/comments.`, 422));
    }

    try {
        user = await User.find({ _id: creator }, "email firstName lastName username image" )
    } catch (error) {
        return next(new HttpError(`Error: ${error} - Cannot find user.`, 422));
    }

    const fullName = user[0].firstName + " " + user[0].lastName;
    const image = user[0].image;

    const newComment = new Comment({
        text,
        creator,
        likes: 0,
        creatorName: fullName,
        creatorImage: image,
        belongsTo: video
    })

    try {
        await newComment.save();
        await video.comments.push(newComment);
        await video.save();

    } catch (error) {
        // DB could be down, DB validation fails
        return next(new HttpError('Internal error; failed to post comment, please try again. ERR_CODE:2.2', 500));
    }

    return res.status(201).json({
        video: video.toObject({ getters: true }),
        newComment
    })

}


const likeComment = async ( req, res, next ) => {
    let user;

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return next(new HttpError(`Error: ${ errors.array()[0].msg }`, 422));
    }

    // check whether userId is provided, or exists or not; only create video if the userId exists
    try {
        user = await User.findById(req.userData.userId);
    } catch (error) {
        return next(new HttpError('Internal error; failed to post video, please try again. ERR_CODE:2.1', 500));
    }
    
    // if user is not in DB
    if(!user) {
        return next(new HttpError('User not found.', 404));
    }
    
    
    try {
        user.likedComments.find( c => {
            if(c.toJSON() === req.params.cid) {
                return next(new HttpError('You cannot like a comment more than once.', 404));
            }
        } )
        
    } catch (error) {
        return next(new HttpError('You cannot like a video more than once.', 404));
    }

    Comment.findOneAndUpdate(
        { _id: req.params.cid },
        { $inc: { likes: 1 }},
        { new: true },
        async ( err, updatedComment ) => {
            if(err){
                return next(new HttpError('Internal error; comment was not updated. ERR_CODE:5.3', 500));
            }
            
            try {
                // If one of following independently fails, undo all operations; both must succeed to save new video
                // user exists - store/create document w/ new video
                // add videoId to corresponding user document
                const session = await mongoose.startSession();
                session.startTransaction();

                // ensure videoId is added to User; establishes a connection
                    // mongodb uses the created video id and adds it to user
                if(user.likedComments.includes(c => c === req.params.cid)){
                    return next(new HttpError('You already liked this comment. ERR_CODE:5.3', 500));
                }
                user.likedComments.push(updatedComment);

                await user.save({ session: session });

                await session.commitTransaction();
                
            } catch (error) {
                // DB could be down, DB validation fails
                return next(new HttpError('Internal error; failed to post video, please try again. ERR_CODE:2.2', 500));
            }

            return res.status(201).json({ updatedComment: updatedComment });
        }
    )
}


const editComment = async ( req, res, next ) => {

}


const deleteComment = async ( req, res, next ) => {

}


/* EXPORTS */
exports.getAllComments = getAllComments;
exports.getCommentByCommentId = getCommentByCommentId;
exports.getCommentsByUserId = getCommentsByUserId;
exports.getCommentsByVideoId = getCommentsByVideoId;
exports.postComment = postComment;
exports.likeComment = likeComment;
exports.editComment = editComment;
exports.deleteComment = deleteComment;