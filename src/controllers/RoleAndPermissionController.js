const role = require('../Models/Role');
const permission = require('../Models/Permission');
const user = require('../Models/User');
const roleHasPer = require('../Models/RoleHasPermission');
const userHasRole = require('../Models/UserHasRole');
const roleHasPermission = require('../Models/RoleHasPermission');
class RoleAndPermissionController{
    // get all role 
    getAllRole = async(req,res)=>{
        try {
            const Role = await role();
            const allRole = await Role.findAll();
            if(!allRole){
                return res.json({
                    success:false,
                    message:"There is no roles yet"
                })
            }
            if(allRole){
                res.json({
                    success:true,
                    data:allRole
                })
            }
        } catch (error) {
            return res.json({
                success:false,
                message:error
            })
        }
    }
    // get user along with role 
    roleHasPer = async(req,res)=>{

    }
    userHasRole = async(req,res)=>{

    }
    // get all permissions 
    getAllPermission = async(req,res)=>{
        try {
            const Permission = await permission();
            const allPer = await Permission.findAll();
            if(!allPer){
                return res.json({
                    success:false,
                    message:"There is no roles yet"
                })
            }
            if(allPer){
                res.json({
                    success:true,
                    data:allPer
                })
            }
        } catch (error) {
            return res.json({
                success:false,
                message:error
            })
        }
    }
    // add roles 
    addRole = async(req,res)=>{
        try {
            const {name} = req.body;
            if(!name){
                return res.json({
                    success:false,
                    message:"Please input a role name"
                })
            }
            const Role = await role();
            const roleName = name.toLowerCase();
            const checkRole = await Role.findOne({
                where:{
                    name:roleName
                }
            });
            if(checkRole !== null){
                return res.json({
                    success:false,
                    message:"The role has been added please input another role"
                })
            }
            const roleBuild = Role.build({
                name:roleName
            })
            const saveRole = await roleBuild.save();
            if(saveRole){
                return res.json({
                    success:true,
                    message:"You have added a new role successfully"
                })
            }else{
                return res.json({
                    success:false,
                    message:"something went wrong while processing"
                })
            }
        } catch (error) {
            res.json({
                success:false,
                message:error
            })
        }
    }
    // add permissions
    addPermission = async(req,res)=>{
        try {
            const {name} = req.body;
            if(!name){
                return res.json({
                    success:false,
                    message:"Please input a permission name"
                })
            }
            const Permission = await permission();
            const permissionName = name.toLowerCase();
            const checkRole = await Permission.findOne({
                where:{
                    name:permissionName
                }
            });
            if(checkRole !== null){
                return res.json({
                    success:false,
                    message:"The permission has been added please input another one"
                })
            }
            const permissionBuild = Permission.build({
                name:permissionName
            })
            const savePermission = await permissionBuild.save();
            if(savePermission){
                return res.json({
                    success:true,
                    message:"You have added a new permission successfully"
                })
            }else{
                return res.json({
                    success:false,
                    message:"something went wrong while processing"
                })
            }
        } catch (error) {
            res.json({
                success:false,
                message:error
            })
        }
    }
    // assign role for permissions 
    assignRoleForPermission = async(req,res)=>{
       try {
        const {role_id,permission_id} = req.body;
        if(!role_id || !permission_id){
            return res.json({
                success:false,
                message:"role or permission is empty.please check again"
            })
        }
        const RoleHasPermission = await roleHasPermission();
        const checkExistence = await RoleHasPermission.findOne({
          where:{
             role_id:role_id,
             permission_id:permission_id
          }
         })
         if(checkExistence){
             return res.json({
                 success:false,
                 message:"This permission has been assigned for this role please choose another one"
             })
         }
         const buildAssign = RoleHasPermission.build({
             role_id:role_id,
             permission_id:permission_id
         })
         const addAssign = await buildAssign.save();
         if(addAssign){
             return res.json({
                 success:true,
                 message:"Assign permission successfully"
             })
         }else{
             return res.json({
                 success:false,
                 message:"something wrong happened while processing"
             })
         }
       } catch (error) {
        console.log(error)
          return res.json({
            success:false,
            message:error
          })
       }
    }
    // assign role for user 
    assignUserForRole = async(req,res)=>{
       try {
        const {role_id,user_id} = req.body;
        const UserHasRole = await userHasRole();
        const Role = await role();
        const User = await user();
        if(!role_id || !user_id){
            return res.json({
                success:false,
                message:"role or user is being empty please check again"
            })
        }
        const checkRole = await Role.findOne({
            where:{
                id:role_id
            }
        });
        const checkUser = await User.findByPk(user_id);
        if(!checkUser || !checkRole){
            return res.json({
                success:false,
                message:"user or role does not existed in database"
            })
        }
        if(checkUser.email === 'admin@gmail.com'){
            return res.json({
                success:false,
                message:"you don't have a permission to change role for this user"
            })
        }
        const buildSave = UserHasRole.build({
            user_id:user_id,
            role_id:role_id
        })
        const saveBuildSave = await buildSave.save();
        if(saveBuildSave){
            return res.json({
                success:true,
                message:"role has assigned for this user successfully"
            })
        }else{
            return res.json({
                success:false,
                message:"Something went wrong"
            })
        }
       } catch (error) {
        console.log(error)
       }
    }
    // remove role for user 
    unAssignRoleForUser = async(req,res)=>{
       try {
            const {role_id,user_id} = req.body;
            const Role = await role();
            const User = await user();
            if(!role_id || !user_id){
                return res.json({
                    success:false,
                    message:"role or user is being empty please check again"
                })
            }
            const checkRole = await Role.findOne({
                where:{
                    id:role_id
                }
            });
            const checkUser = await User.findByPk(user_id);
            if(!checkUser || !checkRole){
                return res.json({
                    success:false,
                    message:"user or role does not existed in database"
                })
            }
            if(checkUser.email === 'admin@gmail.com'){
                return res.json({
                    success:false,
                    message:"you don't have a permission to change role for this user"
                })
            }
            const UserHasRole = await userHasRole();
            const [affectedRows] = await UserHasRole.update({
                status:"off"
            },{
                where:{
                    user_id:user_id,
                    role_id:role_id
                }
            })
            if(affectedRows > 0){
                return res.json({
                    success:true,
                    message:"role has been remove for this user successfully"
                })
            }else{
                return res.json({
                    success:false,
                    message:"sonething went wrong"
                })
            }
       } catch (error) {
          console.log(error)
          return res.json({
            success:true,
            message:error
          })
       }
    }
    reAssignRoleForUser = async(req,res)=>{
        try {
            const {role_id,user_id} = req.body;
            const Role = await role();
            const User = await user();
            if(!role_id || !user_id){
                return res.json({
                    success:false,
                    message:"role or user is being empty please check again"
                })
            }
            const checkRole = await Role.findOne({
                where:{
                    id:role_id
                }
            });
            const checkUser = await User.findByPk(user_id);
            if(!checkUser || !checkRole){
                return res.json({
                    success:false,
                    message:"user or role does not existed in database"
                })
            }
            if(checkUser.email === 'admin@gmail.com'){
                return res.json({
                    success:false,
                    message:"you don't have a permission to change role for this user"
                })
            }
            const UserHasRole = await userHasRole();
            const [affectedRows] = await UserHasRole.update({
                status:"on"
            },{
                where:{
                    user_id:user_id,
                    role_id:role_id
                }
            })
            if(affectedRows > 0){
                return res.json({
                    success:true,
                    message:"role has re-assigned for this user successfully"
                })
            }else{
                return res.json({
                    success:false,
                    message:"sonething went wrong"
                })
            }
       } catch (error) {
          console.log(error)
          return res.json({
            success:true,
            message:error
          })
       }
    }
}
module.exports = new RoleAndPermissionController();