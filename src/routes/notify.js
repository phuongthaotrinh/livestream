const express = require('express');
const { TokenCheckMiddleware } = require('../utils/middleware.js');
const router = express.Router();
const notification_controller = require('../controllers/NotificationAndUpStatus.js');
router.post('/add-new-notification',TokenCheckMiddleware,notification_controller.addNewNotification)
router.get("/get-all-notification/:user_id",TokenCheckMiddleware,notification_controller.getAllNotification)
router.post("/send-notification",TokenCheckMiddleware,notification_controller.sendNotification);
router.post("/get-user-notification",TokenCheckMiddleware,notification_controller.getNotification);
router.get("/get-trigger-notification/:user_id",TokenCheckMiddleware,notification_controller.getNotification);
module.exports = router;