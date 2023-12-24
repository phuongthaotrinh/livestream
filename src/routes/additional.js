const express = require('express');
const { TokenCheckMiddleware } = require('../utils/middleware.js');
const router = express.Router();
const additional_controller = require('../controllers/AdditionalController.js');
router.post('/add-bulk-slide',TokenCheckMiddleware,additional_controller.addSlide);
router.get('/get-all-slide',TokenCheckMiddleware,additional_controller.getAllSlide);
router.get('/get-all-news',TokenCheckMiddleware,additional_controller.getNews);
router.post('/add-or-update-news',TokenCheckMiddleware,additional_controller.addNewsOrUpdate);
module.exports = router;