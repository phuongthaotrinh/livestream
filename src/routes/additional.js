const express = require('express');
const { TokenCheckMiddleware } = require('../utils/middleware.js');
const router = express.Router();
const additional_controller = require('../controllers/AdditionalController.js');
router.post('/add-bulk-slide',TokenCheckMiddleware,additional_controller.addSlide);
router.get('/get-all-slide',TokenCheckMiddleware,additional_controller.getAllSlide);
router.get('/get-all-news',additional_controller.getNews);
router.post('/add-or-update-news',TokenCheckMiddleware,additional_controller.addNewsOrUpdate);
router.post('/add-or-uodate-group',TokenCheckMiddleware,additional_controller.addNewGroup);
router.get('/get-group',TokenCheckMiddleware,additional_controller.getAllOrByIdGroup);
router.post('/import-excel',TokenCheckMiddleware,additional_controller.importExcel);
module.exports = router;