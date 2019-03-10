const express = require('express');
const router = express.Router();
const articleControllers = require('./controllers/article-controller');
 
router.post('/add', articleControllers.addController);
router.post('/get', articleControllers.getController);
router.post('/edit', articleControllers.editController);

module.exports = router;
