/* DEPENDENCIES */
const mongoose = require('mongoose');
const multer = require('multer');
const { validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');


/* CUSTOM IMPORTS */
const HttpError = require('../models/http-error');
const Video = require('../models/videoSchema');
const User = require('../models/userSchema');


/* VARIABLES */
// Video
const MIME_TYPE_MAP = {
    'video/mp4': 'mp4'
}

// Thumbnail
const IMG_MIME_TYPE_MAP = {
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
    'image/png': 'png'
}

// Video
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/videos/')
    },
    filename: (req, file, cb) => {
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, uuidv4() + '.' + ext);
    },
    fileFilter: (req, file, cb) => {
        const isValid = !!MIME_TYPE_MAP[file.mimetype];
        let error = isValid ? null : new Error('Invalid mime type.');
        cb(error, isValid);
    }
})

// Thumbnail
var imgStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/thumbnails/');
    },
    filename: (req, file, cb) => {
        const ext = IMG_MIME_TYPE_MAP[file.mimetype];
        cb(null, uuidv4() + '.' + ext);
    },
    fileFilter: (req, file, cb) => {
        const isValid = !!IMG_MIME_TYPE_MAP[file.mimetype];
        let error = isValid ? null : new Error('Invalid mime type');
        cb(error, isValid);
    }
})

// Video
var upload = multer({ storage: storage }).single('file');

// Thumbnail
var imgUpload = multer({ storage: imgStorage }).single('file');


/* ROUTES */
const getAllVideos = async (req, res, next) => {
    let videos;
    // let creators;

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return next(new HttpError(`Error: ${ errors.array()[0].msg }`, 422));
    }

    try {
        videos = await Video.find({ displaying: true, private: false }).populate('creator');
    } catch (error) {
        return next(new HttpError('Internal error; videos cannot be retrieved. ERR_CODE:1.1', 500));
    }

    // request is valid, but no videos in DB
    if(!videos || videos.length === 0) {
        // return next(new HttpError('No videos found.', 404));
    }

    return res.status(200).json({ videos: videos.map( video => video.toObject({ getters: true }) ) });
}


const getAllTrending = async ( req, res, next ) => {
    let videos;

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return next(new HttpError(`Error: ${ errors.array()[0].msg }`, 422));
    }

    try {
        videos = await Video.find({ displaying: true, private: false, views: { $gte: 50 } });
    } catch (error) {
        return next(new HttpError('Internal error; videos cannot be retrieved. ERR_CODE:2.1', 500));
    }

    // request is valid, but no videos in DB
    if(!videos || videos.length === 0) {
        // return next(new HttpError('No videos found.', 404));
    }

    return res.status(200).json({ videos: videos.map( video => video.toObject({ getters: true }) ) });
}


const getAllPublicVideosByUserId = async ( req, res, next ) => {
    const uid = req.params.uid;

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return next(new HttpError(`Error: ${ errors.array()[0].msg }`, 422));
    }

    let userVideos;
    
    try {
        userVideos = await User.findById(uid).populate('videos');
    } catch (error) {
        // error in userId
        return next(new HttpError('Internal error; fetching videos failed. ERR_CODE:1.2', 500));
    }
    
    if(!userVideos.videos || userVideos.videos.length === 0) {
        // return next(new HttpError('No videos found for this user.', 404));
    }

    let publicVideos = [];
    let privateVideos = [];

    userVideos.videos.map(video => video.private === true ? privateVideos.push(video) : publicVideos.push(video));

    return res.status(200).json({ videos: publicVideos.map( video => video.toObject({ getters: true }) ) });
}


const getAllVideosByUserId = async ( req, res, next ) => {
    const uid = req.params.uid;

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return next(new HttpError(`Error: ${ errors.array()[0].msg }`, 422));
    }

    let userVideos;
    
    try {
        userVideos = await User.findById(uid).populate('videos');
    } catch (error) {
        // error in userId
        return next(new HttpError('Internal error; fetching videos failed. ERR_CODE:1.2', 500));
    }
    
    if(!userVideos.videos || userVideos.videos.length === 0) {
        // return next(new HttpError('No videos found for this user.', 404));
    }

    return res.status(200).json({ videos: userVideos.videos.map( video => video.toObject({ getters: true }) ) });
}


const getAllLikedVideosByUserId = async ( req, res, next ) => {
    const uid = req.params.uid;

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return next(new HttpError(`Error: ${ errors.array()[0].msg }`, 422));
    }

    let userVideos;
    
    try {
        userVideos = await User.findById(uid).populate('liked');
    } catch (error) {
        // error in userId
        return next(new HttpError('Internal error; fetching videos failed. ERR_CODE:1.2', 500));
    }
    
    if(!userVideos.liked || userVideos.liked.length === 0) {
        // return next(new HttpError('No videos found for this user.', 404));
    }

    return res.status(200).json({ videos: userVideos.liked.map( video => video.toObject({ getters: true }) ) });
}


const getAllWatchLaterVideosByUserId = async ( req, res, next ) => {
    const uid = req.params.uid;

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return next(new HttpError(`Error: ${ errors.array()[0].msg }`, 422));
    }

    let userVideos;
    
    try {
        userVideos = await User.findById(uid).populate('later');
    } catch (error) {
        // error in userId
        return next(new HttpError('Internal error; fetching videos failed. ERR_CODE:1.2', 500));
    }
    
    if(!userVideos.later || userVideos.later.length === 0) {
        // return next(new HttpError('No videos found for this user.', 404));
    }

    return res.status(200).json({ videos: userVideos.later.map( video => video.toObject({ getters: true }) ) });
}


const getAllHistoryByUserId = async ( req, res, next ) => {
    const uid = req.params.uid;

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return next(new HttpError(`Error: ${ errors.array()[0].msg }`, 422));
    }

    let userVideos;
    
    try {
        userVideos = await User.findById(uid).populate('history');
    } catch (error) {
        // error in userId
        return next(new HttpError('Internal error; fetching videos failed. ERR_CODE:1.2', 500));
    }
    
    if(!userVideos.history || userVideos.history.length === 0) {
        // return next(new HttpError('No videos found for this user.', 404));
    }

    return res.status(200).json({ videos: userVideos.history.map( video => video.toObject({ getters: true }) ) });
}


const getAllSubsVideos = async ( req, res, next ) => {
    const uid = req.params.uid;
    let subbedTo;
    let allVideos = [];
    let finalVideos = [];
    let videos;

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return next(new HttpError(`Error: ${ errors.array()[0].msg }`, 422));
    }

    try {
        subbedTo = await User.findById(uid, "subscribedTo");
    } catch (error) {
        return next(new HttpError('Internal error; user cannot be retrieved. ERR_CODE:1.3', 500));
    }

    try {
        for(let i = 0; i < subbedTo.subscribedTo.length; i++) {
            // videos = await User.findById(subbedTo.subscribedTo[i], 'videos')
            videos = await User.findById(subbedTo.subscribedTo[i]).populate('videos')

            allVideos.push(videos.videos);
            finalVideos = [].concat.apply([], allVideos);

        }

    } catch (error) {
        
    }

    return res.status(200).json({ finalVideos: finalVideos });
}


const getVideoByVideoId = async ( req, res, next ) => {
    const vid = req.params.vid;
    let video;

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return next(new HttpError(`Error: ${ errors.array()[0].msg }`, 422));
    }

    try {
        video = await Video.findById(vid).populate('creator');
    } catch (error) {
        return next(new HttpError('Internal error; video cannot be retrieved. ERR_CODE:1.3', 500));
    }

    if(!video || video.length === 0 || video.displaying === false) {
        return next(new HttpError('Could not find a video.', 404));
    }

    return res.status(200).json({ video: video.toObject({ getters: true }) });
}

const getVideosBySearch = async ( req, res, next ) => {
    const { title } = req.query;
    const pattern = new RegExp(title);

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return next(new HttpError(`Error: ${ errors.array()[0].msg }`, 422));
    }

    try{
        await Video.find({ title: { $regex: pattern, $options: 'i' }, displaying: true, private: false }, (err, name) => {
            if (err) {
                res.status(500);
                return next(err.error);
            }
            return res.status(200).send(name);
        }).populate('creator')
    } catch (error) {}
};


const getAllRecommendedVideosByCategory = async ( req, res, next ) => {
    const vid = req.params.vid;
    const category = req.params.category;
    let video;
    let recommendedVideos;

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return next(new HttpError(`Error text: ${ errors.array()[0].msg }`, 422));
    }

    try {
        video = await Video.findById({ _id: vid });
    } catch (error) {
        return next(new HttpError('Could not find a video.', 404));
    }

    try {
        recommendedVideos = await Video.find({ category: category, private: false, displaying: true }, "title thumbnailPath views posted").populate('creator');
    } catch (error) {
        return next(new HttpError('Could not find any video.', 404));
    }

    try {
        let foundIndex;
        recommendedVideos.map((v, i) => {
            if(v._id.toString() === vid.toString()) {
                foundIndex = recommendedVideos.indexOf(v);
                recommendedVideos.splice(foundIndex, 1);
            }
        });
    } catch (error) {
        return next(new HttpError('Could not find any video.', 404));
    }

    return res.status(200).json({
        videos: recommendedVideos.reverse().map(video =>
            video.toObject({ getters: true })
        )
    });
}


const postVideo = async ( req, res, next ) => {
    const { title, description, category, private, filePath, thumbnailPath, /* creatorName, creatorImage */ } = req.body;

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return next(new HttpError(`Error text: ${ errors.array()[0].msg }`, 422));
    }

    const video = new Video({
        title,
        description,
        category,
        private,
        comments: [ ],
        thumbnailPath,
        filePath,
        likes: 0,
        displaying: true,
        // creatorName,
        // creatorImage,
        creator: req.userData.userId
    });

    if(description.length <= 4) {
        return next(new HttpError('Description must be 5 or more characters.', 422));
    }

    let user;

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
        // If one of following independently fails, undo all operations; both must succeed to save new video
            // user exists - store/create document w/ new video
            // add videoId to corresponding user document
        const session = await mongoose.startSession();
        session.startTransaction();
        // create new video and unique id
        await video.save({ session: session });

        // ensure videoId is added to User; establishes a connection
            // mongodb uses the created video id and adds it to user
        user.videos.push(video);

        await user.save({ session: session });

        await session.commitTransaction();
        
    } catch (error) {
        // DB could be down, DB validation fails
        return next(new HttpError('Internal error; failed to post video, please try again. ERR_CODE:2.2', 500));
    }
    
    return res.status(201).json({ message: `Successfully added new video: ${video.title}.`, video: video.toObject({ getters: true }) })
}


const postThumbnailFile = async ( req, res, next ) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return next(new HttpError(`Error thumbnail: ${ errors.array()[0].msg }`, 422));
    }

    await imgUpload(req, res, err => {
        if(err) {
            return next(new HttpError('Internal error; failed to post thumbnail, please try again. ERR_CODE:2.3', 500));
        }

        return res.json({ success: true, thumbnailPath: res.req.file.path, fileName: res.req.file.fileName });
    })
}


const postVideoFile = async ( req, res, next ) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return next(new HttpError(`Error video file: ${ errors.array()[0].msg }`, 422));
    }

    await upload(req, res, err => {
        if(err) {
            return next(new HttpError('Internal error; failed to post video, please try again. ERR_CODE:2.4', 500));
        }

        return res.json({ success: true, filePath: res.req.file.path, fileName: res.req.file.fileName });
    })
}


const editVideoById = async ( req, res, next ) => {
    const { title, description } = req.body;
    const vid = req.params.vid;

    let video;

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return next(new HttpError(`Error: ${ errors.array()[0].msg }`, 422));
    }

    try {
        video = await Video.findById(vid);
    } catch (error) {
        return next(new HttpError('Internal error; video cannot be retrieved. ERR_CODE:3.1', 500));
    }

    if(!video || video.length === 0) {
        return next(new HttpError('Could not find a video.', 404));
    }

    if(video.displaying === false) {
        return next(new HttpError('Could not find a video.', 404));
    }
    
    if(video.creator.toString() !== req.userData.userId) {
        return next(new HttpError('You are not authorized to edit this video.', 401));
    }

    try {
        video.title = title;
        video.description = description;
        video.displaying = true;
    } catch (error) {
        return next(new HttpError('Edits were not made. Please try again.', 401));
    }
    
    try {
        await video.save();
    } catch (error) {
        return next(new HttpError('Internal error; video was not updated. ERR_CODE:3.2', 500));
    }
        
    return res.status(200).json({ message: `Changes successfully made to video: ${video.title}`, video: video.toObject({ getters: true }) });
}


const editVideoPrivacy = async ( req, res, next ) => {
    const vid = req.params.vid;

    let video;

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return next(new HttpError(`Error: ${ errors.array()[0].msg }`, 422));
    }

    try {
        video = await Video.findById(vid).populate('creator');
    } catch (error) {
        return next(new HttpError('Internal error; video was not deleted. ERR_CODE:5.1', 500));
    }

    if(!video) {
        return next(new HttpError('Could not find a video.', 404));
    } else if(video.displaying === false) {
        return next(new HttpError('Could not find a video.', 404));
    }

    if( video.creator.id !== req.userData.userId ) {
        return next(new HttpError('You are not authorized to edit this video.', 401));
    }

    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        if(video.private === false || video.private === 'false'){
            video.private = true
        } else if(video.private === true || video.private === 'true') {
            video.private = false
        } else {
            return next(new HttpError('You are not authorized to edit this video.', 401));
        }

        await video.save({ session: session });
        await session.commitTransaction();
    } catch (error) {
        return next(new HttpError('Internal error; video was not editted. ERR_CODE:5.2', 500));
    }


    try {
        await video.save();
    } catch (error) {
        return next(new HttpError('Internal error; video was not updated. ERR_CODE:5.3', 500));
    }

    return res.status(200).json({ message: "Successfully editted video." });
}


const addView = async ( req, res, next ) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return next(new HttpError(`Error: ${ errors.array()[0].msg }`, 422));
    }

    try {
        await Video.findOneAndUpdate(
            { _id: req.params.vid },
            { $inc: { views: 1 }},
            { new: true },
            async ( err, updatedVideo ) => {
                if(err){
                    return next(new HttpError('Internal error; video was not updated. ERR_CODE:5.3', 500));
                }
    
                return res.status(201).send( updatedVideo );
            }
        )
        
    } catch (error) {
        return next(new HttpError('Internal error; video cannot be retrieved. ERR_CODE:1.3', 500));
    }
}


const deleteVideoById = async ( req, res, next ) => {
    const vid = req.params.vid;

    let video;

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return next(new HttpError(`Error: ${ errors.array()[0].msg }`, 422));
    }

    // look for videoId and user that owns the video at the same time

    try {
        video = await Video.findById(vid).populate('creator');
    } catch (error) {
        return next(new HttpError('Internal error; video was not deleted. ERR_CODE:4.1', 500));
    }
    
    if(!video) {
        return next(new HttpError('Could not find a video.', 404));
    }

    if(video.displaying === false) {
        return next(new HttpError('Could not find a video.', 404));
    }
    
    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await video.remove({ session: session });
        // remove video from user
        video.creator.videos.pull(video);
        await video.creator.save({ session: session });
        await session.commitTransaction();
    } catch (error) {
        return next(new HttpError('Internal error; video was not deleted. ERR_CODE:4.2', 500));
    }

    return res.status(200).json({ message: 'Successfully deleted video.' });
}


const hideVideoById = async ( req, res, next ) => {
    const vid = req.params.vid;

    let video;

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return next(new HttpError(`Error: ${ errors.array()[0].msg }`, 422));
    }

    try {
        video = await Video.findById(vid).populate('creator');
    } catch (error) {
        return next(new HttpError('Internal error; video was not deleted. ERR_CODE:5.1', 500));
    }

    if(!video) {
        return next(new HttpError('Could not find a video.', 404));
    } else if(video.displaying === false) {
        return next(new HttpError('Could not find a video.', 404));
    }

    if( video.creator.id !== req.userData.userId ) {
        return next(new HttpError('You are not authorized to delete this video.', 401));
    }

    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        video.displaying = false;
        // remove video from user
        video.creator.videos.pull(video);
        await video.creator.save({ session: session });
        await session.commitTransaction();
    } catch (error) {
        return next(new HttpError('Internal error; video was not deleted. ERR_CODE:5.2', 500));
    }


    try {
        await video.save();
    } catch (error) {
        return next(new HttpError('Internal error; video was not updated. ERR_CODE:5.3', 500));
    }

    return res.status(200).json({ message: "Successfully deleted video." });
}


const likeVideo = async ( req, res, next ) => {
    // const vid = req.params.vid;
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
        user.liked.find( v => {
            if(v.toJSON() === req.params.vid) {
                return next(new HttpError('You cannot like a video more than once.', 404));
            }
        } )
        
    } catch (error) {
        return next(new HttpError('You cannot like a video more than once.', 404));
    }

    Video.findOneAndUpdate(
        { _id: req.params.vid },
        { $inc: { likes: 1 }},
        { new: true },
        async ( err, updatedVideo ) => {
            if(err){
                return next(new HttpError('Internal error; video was not updated. ERR_CODE:5.3', 500));
            }
            
            try {
                // If one of following independently fails, undo all operations; both must succeed to save new video
                // user exists - store/create document w/ new video
                // add videoId to corresponding user document
                const session = await mongoose.startSession();
                session.startTransaction();

                // ensure videoId is added to User; establishes a connection
                    // mongodb uses the created video id and adds it to user
                if(user.liked.includes(v => v === req.params.vid)){
                    return next(new HttpError('You already liked this video. ERR_CODE:5.3', 500));
                }
                user.liked.push(updatedVideo);

                await user.save({ session: session });

                await session.commitTransaction();
                
            } catch (error) {
                // DB could be down, DB validation fails
                return next(new HttpError('Internal error; failed to post video, please try again. ERR_CODE:2.2', 500));
            }

            return res.status(201).send( updatedVideo );
        }
    )

}


const addWatchLater = async ( req, res, next ) => {
//     // const vid = req.params.vid;
    let user;

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return next(new HttpError(`Error: ${ errors.array()[0].msg }`, 422));
    }

//     // check whether userId is provided, or exists or not; only create video if the userId exists
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
        user.later.find( v => {
            if(v.toJSON() === req.params.vid) {
                return next(new HttpError('You cannot add the same video to watch later more than once.', 404));
            }
        } )
        
    } catch (error) {
        return next(new HttpError('You cannot add the same video to watch later more than once.', 404));
    }

    

    try {
        // If one of following independently fails, undo all operations; both must succeed to save new video
        // user exists - store/create document w/ new video
        // add videoId to corresponding user document
        const session = await mongoose.startSession();
        session.startTransaction();

        // ensure videoId is added to User; establishes a connection
            // mongodb uses the created video id and adds it to user
        if(user.later.includes(v => v === req.params.vid)){
            return next(new HttpError('You already liked this video. ERR_CODE:5.3', 500));
        }
        user.later.push(req.params.vid);

        await user.save({ session: session });

        await session.commitTransaction();
        
    } catch (error) {
        // DB could be down, DB validation fails
        return next(new HttpError('Internal error; failed to post video, please try again. ERR_CODE:2.2', 500));
    }

    return res.status(201).send( req.params.vid );

}


const addToHistory = async ( req, res, next ) => {
    let user;

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return next(new HttpError(`Error: ${ errors.array()[0].msg }`, 422));
    }

    //     // check whether userId is provided, or exists or not; only create video if the userId exists
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
        user.history.find( v => {
            if(v.toJSON() === req.params.vid) {
                return next(new HttpError('You cannot add the same video to watch history more than once.', 404));
            }
        } )
        
    } catch (error) {
        return next(new HttpError('You cannot add the same video to watch history more than once.', 404));
    }

    try {
        // If one of following independently fails, undo all operations; both must succeed to save new video
        // user exists - store/create document w/ new video
        // add videoId to corresponding user document
        const session = await mongoose.startSession();
        session.startTransaction();

        // ensure videoId is added to User; establishes a connection
            // mongodb uses the created video id and adds it to user
        if(user.history.includes(v => v === req.params.vid)){
            return next(new HttpError('You already liked this video. ERR_CODE:5.3', 500));
        }
        user.history.push(req.params.vid);

        await user.save({ session: session });

        await session.commitTransaction();
        
    } catch (error) {
        // DB could be down, DB validation fails
        // return next(new HttpError('Video is already in history. ERR_CODE:2.2', 500));
    }

    return res.status(201).send( req.params.vid );
}


const clearHistory = async ( req, res, next ) => {
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

    user.updateOne({ $set: { history: [] }}, function(err, affected){
        // console.log('affected: ', affected);
    });

    return res.status(200).json({ message: "Successfully cleared history." });

}



/* EXPORTS */
exports.getAllVideos = getAllVideos;
exports.getAllTrending = getAllTrending;
exports.getAllPublicVideosByUserId = getAllPublicVideosByUserId;
exports.getAllVideosByUserId = getAllVideosByUserId;
exports.getAllLikedVideosByUserId = getAllLikedVideosByUserId;
exports.getAllWatchLaterVideosByUserId = getAllWatchLaterVideosByUserId;
exports.getAllHistoryByUserId = getAllHistoryByUserId;
exports.getAllSubsVideos = getAllSubsVideos;
exports.getVideoByVideoId = getVideoByVideoId;
exports.getVideosBySearch = getVideosBySearch;
exports.getAllRecommendedVideosByCategory = getAllRecommendedVideosByCategory;
exports.postVideo = postVideo;
exports.postThumbnailFile = postThumbnailFile;
exports.postVideoFile = postVideoFile;
exports.editVideoById = editVideoById;
exports.editVideoPrivacy = editVideoPrivacy;
exports.addView = addView;
exports.deleteVideoById = deleteVideoById;
exports.hideVideoById = hideVideoById;
exports.likeVideo = likeVideo;
exports.addWatchLater = addWatchLater;
exports.addToHistory = addToHistory;
exports.clearHistory = clearHistory;