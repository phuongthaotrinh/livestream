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
module.exports = router;