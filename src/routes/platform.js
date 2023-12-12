const express = require('express');
const { TokenCheckMiddleware } = require('../utils/middleware.js');
const router = express.Router();
const platform_controller = require('../controllers/PlatformController.js');
router.get('/get-all',TokenCheckMiddleware,platform_controller.getAll);
router.post('/add-live-stream-type',TokenCheckMiddleware,platform_controller.addLiveStreamType);
router.post('/add-live-stream-platform',TokenCheckMiddleware,platform_controller.addLiveStreamPlatform);
module.exports = router;