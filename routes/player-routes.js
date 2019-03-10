const express = require('express');
const router = express.Router();
const playerController = require("./controllers/player-controller");

router.post('/loadplayer', playerController.loadPlayer);
router.post('/note', playerController.note);
router.post('/updatewatchtime', playerController.updateWatchTime);
 
module.exports = router;
