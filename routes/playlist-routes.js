const express = require('express');
const router = express.Router();
const playlistController = require('./controllers/playlist-controller');
    
router.post('/postplaylist', playlistController.postPlaylist);
router.post('/editplaylistitems', playlistController.editPlaylistItems);
router.post('/editplaylist', playlistController.editPlaylist);
router.post('/getplaylist', playlistController.getPlaylist);
	
module.exports = router;
