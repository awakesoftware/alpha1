/* DEPENDENCIES */
const express = require('express');
const videoRouter = express.Router();


/* CUSTOM IMPORTS */
const videosController = require('../controllers/videos-controller');
const {
    postVideoValidator
} = require('../validators/videoAuth');
const checkAuth = require('../middleware/check-auth');


/* LOCAL VARIABLES */
const {
    getAllVideos,
    getAllTrending,
    getAllPublicVideosByUserId,
    getAllVideosByUserId,
    getVideosBySearch,
    getAllLikedVideosByUserId,
    getAllWatchLaterVideosByUserId,
    getAllHistoryByUserId,
    getAllSubsVideos,
    getVideoByVideoId,
    getAllRecommendedVideosByCategory,
    postVideo,
    postThumbnailFile,
    postVideoFile,
    addWatchLater,
    editVideoById,
    editVideoPrivacy,
    addView,
    deleteVideoById,
    hideVideoById,
    likeVideo,
    addToHistory,
    clearHistory
} = videosController;


/* TOKEN MIDDLEWARE */
videoRouter.use(checkAuth);


/* ROUTES */
// get all videos
videoRouter.get('/', getAllVideos);

// get all recommended videos by video id & category
videoRouter.get('/category/:vid/:category', getAllRecommendedVideosByCategory);

// get all trending
videoRouter.get('/trending', getAllTrending);

// get all public videos by user id
videoRouter.get('/user/public/:uid', getAllPublicVideosByUserId)

// get all videos by user id
videoRouter.get('/user/:uid', getAllVideosByUserId);

// get videos by search
videoRouter.get('/search', getVideosBySearch);

// get all liked videos by user id
videoRouter.get('/liked/user/:uid', getAllLikedVideosByUserId);

// get all watch later videos by user id
videoRouter.get('/later/user/:uid', getAllWatchLaterVideosByUserId);

// get all history videos by user id
videoRouter.get('/history/user/:uid', getAllHistoryByUserId);

// get all subscribers videos by user id
videoRouter.get('/subscribers/user/:uid', getAllSubsVideos);

// get video by video id
videoRouter.get('/:vid', getVideoByVideoId);

// post video
videoRouter.post('/',
    postVideoValidator,
    postVideo
);

// post thumbnail file
videoRouter.post('/thumbnailFile', postThumbnailFile);

// post video file
videoRouter.post('/videoFile', postVideoFile);

// watch video later
videoRouter.post('/watchlater/:vid', addWatchLater);

// add video to history
videoRouter.post('/history/:vid', addToHistory);

// clear history
videoRouter.delete('/history', clearHistory);

// like video
videoRouter.put('/like/:vid', likeVideo);

// add 1 to views
videoRouter.put('/views/:vid', addView);

// edit video privacy by video id
videoRouter.put('/privacy/:vid', editVideoPrivacy);

// edit video by video id
videoRouter.put('/:vid',
    
    editVideoById
);

// hide video by video id
videoRouter.delete('/hide/:vid', hideVideoById);

// delete video by video id
videoRouter.delete('/:vid', deleteVideoById);



/* EXPORTS */
module.exports = videoRouter;