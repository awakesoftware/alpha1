/* DEPENDENCIES */
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');


/* CUSTOM IMPORTS */
const HttpError = require('../models/http-error');
const Playlist = require('../models/playlistSchema');
const User = require('../models/userSchema');
const Video = require('../models/videoSchema');


/* ROUTES */
// get all playlists
const getAllPlaylists = async ( req, res, next ) => {
    let playlists;

    try {
        playlists = await Playlist.find();
    } catch (error) {
        return next(new HttpError('Internal error; playlists cannot be retrieved. ERR_CODE:1.1', 500));
    }

    // request is valid, but no playlists in DB
    // if(!playlists || playlists.length === 0) {
    //     return next(new HttpError('No playlists found.', 404));
    // }

    return res.status(200).json({ playlists: playlists });
}


// get all playlists by user id
const getAllPlaylistsByUserId = async ( req, res, next ) => {
    const uid = req.params.uid;

    let userPlaylists;
    
    try {
        userPlaylists = await User.findById(uid).populate('playlists');
    } catch (error) {
        // error in userId
        return next(new HttpError('Internal error; fetching playlists failed. ERR_CODE:1.2', 500));
    }
    
    // if(!userPlaylists.playlists || userPlaylists.playlists.length === 0) {
    //     return next(new HttpError('No playlists found for this user.', 404));
    // }

    return res.status(200).json({ playlists: userPlaylists.playlists });
}


// get single playlist by playlist id
const getPlaylistById = async ( req, res, next ) => {
    const pid = req.params.pid;
    let playlist;

    try {
        playlist = await Playlist.findById(pid).populate('videos');
    } catch (error) {
        return next(new HttpError('Internal error; playlist cannot be retrieved. ERR_CODE:1.3', 500));
    }

    // if(!playlist || playlist.length === 0) {
    //     return next(new HttpError('Could not find a playlist.', 404));
    // }

    return res.status(200).json({ playlist: playlist });
}


// create new playlist
const createPlaylist = async ( req, res, next ) => {
    const uid = req.params.uid;


    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs, please check data specifications.', 422));
    }
    
    const { name, creator, about, private } = req.body;
    const playlist = new Playlist({
        name,
        about,
        creator,
        private,
        videos: []
    });

    let user;

    // check whether userId is provided, or exists or not; only create video if the userId exists
    try {
        user = await User.findById(uid);
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
        await playlist.save({ session: session });

        // ensure videoId is added to User; establishes a connection
            // mongodb uses the created video id and adds it to user
        user.playlists.push(playlist);

        await user.save({ session: session });

        await session.commitTransaction();
        
    } catch (error) {
        // DB could be down, DB validation fails
        return next(new HttpError('Internal error; failed to create playlist, please try again. ERR_CODE:2.2', 500));
    }
    
    return res.status(201).json({ playlist: playlist })
}


const addToPlaylist = async ( req, res, next ) => {
    // const errors = validationResult(req);
    // if(!errors.isEmpty()) {
    //     return next(new HttpError('Invalid inputs, please check data specifications.', 422));
    // }

    const vid = req.params.vid

    const { pid } = req.body;

    let playlist;
    let video;

    // check whether userId is provided, or exists or not; only create video if the userId exists
    try {
        playlist = await Playlist.findById(pid);
    } catch (error) {
        return next(new HttpError('Internal error; failed to find playlist, please try again. ERR_CODE:2.1', 500));
    }

    try {
        video = await Video.findById(vid);
    } catch (error) {
        return next(new HttpError('Internal error; failed find video, please try again. ERR_CODE:2.1', 500));
    }

    // let foundVideo;
    
    // try {
    //     // foundVideo = await playlist.videos.findIndex(v => v._id.toJSON() === vid)
    //     foundVideo = await playlist.videos.includes(v => v._id.toJSON() === vid)

    //     console.log(foundVideo);

    //     if(foundVideo === false) {
    //         playlist.videos.splice(foundVideo, 1);
    //         return next(new HttpError('Video is already in this playlist. 1.1', 500));
    //     }
    // } catch (error) {
    //     return next(new HttpError('Video is already in this playlist. 5.5', 500));
    // }

    try {
        if(playlist.videos.find(video) == true) {
            return next(new HttpError('Video already added. ERR_CODE:999.1', 500));
        } else {
            // If one of following independently fails, undo all operations; both must succeed to save new video
                // user exists - store/create document w/ new video
                // add videoId to corresponding user document
            const session = await mongoose.startSession();
            session.startTransaction();
        
            // create new video and unique id
            await video.save({ session: session });
        
            // ensure videoId is added to User; establishes a connection
                // mongodb uses the created video id and adds it to user
            playlist.videos.push(video.toJSON());
        
            await playlist.save({ session: session });
        
            await session.commitTransaction();
        }
    } catch (error) {
        // DB could be down, DB validation fails
        return next(new HttpError('Video is already in this playlist. 1.2', 500));
    }
    
    return res.status(201).json({ playlist: playlist });
}


const editPlaylistById = async ( req, res, next ) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs, please check data specifications.', 422));
    }

    const pid = req.params.pid;
    const { name, about } = req.body;

    let playlist;
    
    try {
        playlist = await Playlist.findById(pid);
    } catch (error) {
        return next(new HttpError('Error finding playlist, please try again.', 422));
    }

    if(!playlist) {
        return next(new HttpError('Could not find playlist.', 404));
    }
    
    // if(playlist.creator.toString() !== req.userData.userId) {
    //     return next(new HttpError('You are not authorized to edit this playlist.', 401));
    // }

    playlist.name = name;
    playlist.about = about;
    
    try {
        await playlist.save();
    } catch (error) {
        return next(new HttpError('Internal error; playlist was not updated. ERR_CODE:3.2', 500));
    }
        
    return res.status(200).json({ message: `Changes successfully made to video: ${playlist.name}`, playlist: playlist.toObject({ getters: true }) });

}


const editPlaylistPrivacy = async ( req, res, next ) => {
    const pid = req.params.pid;

    let playlist;

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return next(new HttpError(`Error: ${ errors.array()[0].msg }`, 422));
    }

    try {
        playlist = await Playlist.findById(pid);
    } catch (error) {
        return next(new HttpError('Internal error; Playlist not found. ERR_CODE:5.1', 500));
    }

    if(!playlist) {
        return next(new HttpError('Internal error; Playlist not found. ERR_CODE:5.1', 500));
    }

    // if( video.creator.id !== req.userData.userId ) {
    //     return next(new HttpError('You are not authorized to edit this video.', 401));
    // }

    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        if(playlist.private === false || playlist.private === 'false'){
            playlist.private = true
        } else if(playlist.private === true || playlist.private === 'true') {
            playlist.private = false
        } else {
            return next(new HttpError('You are not authorized to edit this playlist.', 401));
        }

        await playlist.save({ session: session });
        await session.commitTransaction();
    } catch (error) {
        return next(new HttpError('Internal error; playlist was not editted. ERR_CODE:5.2', 500));
    }

    try {
        await playlist.save();
    } catch (error) {
        return next(new HttpError('Internal error; playlist was not updated. ERR_CODE:5.3', 500));
    }

    return res.status(200).json({ message: "Successfully editted playlist." });
}


const removeFromPlaylist = async ( req, res, next ) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs, please check data specifications.', 422));
    }

    const vid = req.params.vid
    const pid = req.params.pid;
    
    let video;
    let playlist;

    try {
        video = await Video.findById(vid);
        playlist = await Playlist.findById(pid);
    } catch (error) {
        return next(new HttpError('Internal error, please try again.', 422));
    }

    try {
        await playlist.videos.pull(video);
        await playlist.save()
    } catch (error) {
        return next(new HttpError('Error removing video, please try again.', 422));
    }
    
    return res.status(201).json({ msg: `Removed - TITLE "${video.title}" from - PLAYLIST "${playlist.name}"` });
}


const deletePlaylist = async ( req, res, next ) => {
    const pid = req.params.pid;

    let playlist;

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return next(new HttpError(`Error: ${ errors.array()[0].msg }`, 422));
    }

    // look for videoId and user that owns the video at the same time

    try {
        playlist = await Playlist.findById(pid).populate('creator');
    } catch (error) {
        return next(new HttpError('Internal error; playlist was not deleted. ERR_CODE:4.1', 500));
    }
    
    if(!playlist) {
        return next(new HttpError('Could not find playlist.', 404));
    }
    
    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await playlist.remove({ session: session });
        // remove playlist from user
        playlist.creator.playlists.pull(playlist);
        await playlist.creator.save({ session: session });
        await session.commitTransaction();
    } catch (error) {
        return next(new HttpError('Internal error; playlist was not deleted. ERR_CODE:4.2', 500));
    }

    return res.status(200).json({ message: 'Successfully deleted playlist.' });
}


/* EXPORTS */
exports.getAllPlaylists = getAllPlaylists;
exports.getAllPlaylistsByUserId = getAllPlaylistsByUserId;
exports.getPlaylistById = getPlaylistById;
exports.createPlaylist = createPlaylist;
exports.addToPlaylist = addToPlaylist;
exports.editPlaylistById = editPlaylistById;
exports.editPlaylistPrivacy = editPlaylistPrivacy;
exports.removeFromPlaylist = removeFromPlaylist;
exports.deletePlaylist = deletePlaylist;