const express = require('express');
const { TokenCheckMiddleware } = require('../utils/middleware.js');
const router = express.Router();
const user_controller = require('../controllers/UserController.js');
// get all user 
router.get('/get-all',TokenCheckMiddleware,user_controller.index);
router.get('/user-by-id/:id',TokenCheckMiddleware,user_controller.findOne);
// update user 
router.put('/update/:id',TokenCheckMiddleware,user_controller.updateUser);
router.post('/login',user_controller.login);
router.post('/register',user_controller.signup);
// check email and name not require auth
router.get('/checkEmail/:email/:name',user_controller.checkEmailAndName);
// delete completely user
router.delete('/user-delete/:id',TokenCheckMiddleware,user_controller.deleteUser);
// block user
router.get("/block-user/:id",TokenCheckMiddleware,user_controller.blockUser);
// un block user 
router.get("/unblock-user/:id",TokenCheckMiddleware,user_controller.unBlockUser);
// update profile 
router.put("/update-profile",TokenCheckMiddleware,user_controller.updateProfile);
// add new member into group 
router.post("/add-new-child",TokenCheckMiddleware,user_controller.addNewChild);
//  remove members from group
router.post("/remove-member",TokenCheckMiddleware,user_controller.removeMember);
// get all member in group 
router.get('/get-all-member-in-group/:user_id/:group_id',TokenCheckMiddleware,user_controller.getAllMemberInGroup);
//get-all-group-belong-to-current-user
router.get('/get-all-group-belong-to-current-user/:user_id',TokenCheckMiddleware,user_controller.getBelongGroup);
router.get('/get-all-rol-per-belong-to-user/:user_id',TokenCheckMiddleware,user_controller.getUserRoleAndPermissionsBelongToUser);
router.get('/get-user-group-id/:user_id',TokenCheckMiddleware,user_controller.getUserGroupId);
router.get('/get-detail-user/:user_id',TokenCheckMiddleware,user_controller.getUserDetail);

// statistic
router.post('/get-system-statistic',TokenCheckMiddleware,user_controller.getStatistic);
//add visited user
router.post('/add-visited-user',TokenCheckMiddleware,user_controller.addVisitedUser);
router.get('/get-statistic-visited-user',TokenCheckMiddleware,user_controller.getStatisticVisitedUser);
router.get('/get-current-visited-user',TokenCheckMiddleware,user_controller.getVisitedUser);
module.exports = router;