const express = require('express');
const { TokenCheckMiddleware } = require('../utils/middleware.js');
const router = express.Router();
const role_per_controller = require('../controllers/RoleAndPermissionController.js');
// get all role 
router.get('/get-all-role',TokenCheckMiddleware,role_per_controller.getAllRole);
router.delete('/delete-permission/:permission_id',TokenCheckMiddleware,role_per_controller.deletePermission);
// add roles 
router.post('/add-role',TokenCheckMiddleware,role_per_controller.addRole);
// add permissions 
router.post('/add-per',TokenCheckMiddleware,role_per_controller.addPermission);
// get all permissions 
router.get('/get-all-permission',TokenCheckMiddleware,role_per_controller.getAllPermission)
// assign role for permission
router.post('/assign-role-for-per',TokenCheckMiddleware,role_per_controller.assignRoleForPermission);
// assign role for user 
router.post('/assign-role-for-user',TokenCheckMiddleware,role_per_controller.assignUserForRole);
// remove role for user 
router.put('/remove-role-for-user',TokenCheckMiddleware,role_per_controller.unAssignRoleForUser);
// re assign role for user 
router.put('/reassign-role-for-user',TokenCheckMiddleware,role_per_controller.reAssignRoleForUser)
// get permission belong to role
router.get('/get-per-belong-to-role/:role_id',TokenCheckMiddleware,role_per_controller.roleHasPer);
// get role belong to user 
router.get('/get-role-belong-to-user/:user_id',TokenCheckMiddleware,role_per_controller.userHasRole)
module.exports = router;