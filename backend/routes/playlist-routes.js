/* DEPENDENCIES */
const express = require('express');
const playlistRouter = express.Router();
const { check } = require('express-validator');


/* CUSTOM IMPORTS */
const playlistController = require('../controllers/playlist-controller');


/* LOCAL VARIABLES */
const {
    getAllPlaylists,
    getAllPlaylistsByUserId,
    getPlaylistById,
    createPlaylist,
    editPlaylistById,
    editPlaylistPrivacy,
    addToPlaylist,
    removeFromPlaylist,
    deletePlaylist
} = playlistController;


/* ROUTES */
// get all playlists
playlistRouter.get('/', getAllPlaylists);

// get all playlists by user id
playlistRouter.get('/user/:uid', getAllPlaylistsByUserId);

// get single playlist by playlist id
playlistRouter.get('/:pid', getPlaylistById);

// add video to playlist
playlistRouter.post('/playlist/:vid', addToPlaylist);

// create new playlist
playlistRouter.post('/:uid', createPlaylist);

// edit playlist privacy
playlistRouter.put('/privacy/:pid', editPlaylistPrivacy);

// edit playlist info
playlistRouter.put('/:pid', editPlaylistById);

// remove from playlist
playlistRouter.delete('/playlist/:pid/:vid', removeFromPlaylist);

// delete playlist
playlistRouter.delete('/:pid', deletePlaylist);


/* EXPORTS */
module.exports = playlistRouter;