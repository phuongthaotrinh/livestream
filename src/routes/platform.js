const express = require('express');
const { TokenCheckMiddleware } = require('../utils/middleware.js');
const router = express.Router();
const platform_controller = require('../controllers/PlatformController.js');
router.get('/get-all',TokenCheckMiddleware,platform_controller.getAll);
router.post('/add-live-stream-type',TokenCheckMiddleware,platform_controller.addLiveStreamType);
router.post('/add-live-stream-platform',TokenCheckMiddleware,platform_controller.addLiveStreamPlatform);
router.post('/add-field',TokenCheckMiddleware,platform_controller.addField);
router.post('/create-new-submiss',TokenCheckMiddleware,platform_controller.createUserSubmissions);
router.post('/add-more-type-into-platform',TokenCheckMiddleware,platform_controller.addMoreType);
router.get('/get-form/:user_id',TokenCheckMiddleware,platform_controller.getForm);
router.post('/approve-registered-platform',TokenCheckMiddleware,platform_controller.approveRegisteredPlatform);
router.get('/get-detail-registered-platform/:user_id',TokenCheckMiddleware,platform_controller.getRegisteredDetailAndResult);
router.get('/get-form-field-by-live-type-id/:live_type_id',TokenCheckMiddleware,platform_controller.getFormByLiveTypeId);
router.get('/get-all-forms',TokenCheckMiddleware,platform_controller.getAllForms);
router.get('/get-all-forms-register',TokenCheckMiddleware,platform_controller.getAllFormsRegister);

module.exports = router;