const express = require('express');
const { TokenCheckMiddleware } = require('../utils/middleware.js');
const router = express.Router();
const additional_controller = require('../controllers/AdditionalController.js');
router.post('/add-bulk-slide',TokenCheckMiddleware,additional_controller.addSlide);
router.get('/get-all-slide',TokenCheckMiddleware,additional_controller.getAllSlide);
module.exports = router;