const express = require('express');
const router = express.Router();
const userControllers = require('./controllers/user-controller');

router.get('/session', userControllers.sessionController);
router.post('/join', userControllers.joinController);
router.post('/login', userControllers.loginController);
   
module.exports = router;
