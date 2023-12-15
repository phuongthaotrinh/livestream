const role = require('../Models/Role');
const permission = require('../Models/Permission');
const user = require('../Models/User');
const roleHasPer = require('../Models/RoleHasPermission');
const userHasRole = require('../Models/UserHasRole');
const roleHasPermission = require('../Models/RoleHasPermission');
class RoleAndPermissionController{
    // get all role 
    getAllRole = async (req, res) => {
        try {
            const Role = await role();
            const allRole = await Role.findAll();
            
            if (!allRole || allRole.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "There are no roles yet",
                });
            }
    
            res.status(200).json({
                success: true,
                data: allRole || [],
            });
    
        } catch (error) {
            console.error("Error in getAllRole:", error);
            res.status(500).json({
                success: false,
                message: "Internal Server Error",
            });
        }
    }
    
    // get user along with role 
    roleHasPer = async(req,res)=>{
        const Permission = await permission();
        const Role = await role();
        const RoleHasPermission = await roleHasPer();
        const {role_id} = req.params;
        const checkRole = await Role.findOne({
            where:{
                id:role_id
            }
        });
        if(checkRole !== null){
            const permissions = await RoleHasPermission.findAll({
                where:{
                    role_id:role_id
                },
                include:{
                    model:Permission,
                    attributes: ['id', 'name'],
                }
            })
            return res.status(200).json({
                success:true,
                data:permissions || []
            })
        }else{
            return res.status(404).json({
                success:false,
                message:"role is not found"
            })
        }

    }
    userHasRole = async(req,res)=>{
       const {user_id} = req.params;
       const User = await user();
       const Role = await role();
       const UserHasRole = await userHasRole();
       const checkUser = await User.findOne({
          where:{
             id:user_id
          }
       });
       if(checkUser !== null){
          const roles = await UserHasRole.findAll({
              where:{user_id:user_id},
              include:{
                model:Role,
                attributes:['id','name']
              }
          });
            return res.status(200).json({
            success:true,
            data:roles || []
            })
       }else{
         return res.status(404).json({
            success:false,
            message:"user not found"
         })
       }
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
            return res.status(200).json({
                success:true,
                data:allPer || []
             })
        } catch (error) {
            return res.status(500).json({
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
                return res.status(400).json({
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
                return res.status(400).json({
                    success:false,
                    message:"The role has been added please input another role"
                })
            }
            const roleBuild = Role.build({
                name:roleName
            })
            const saveRole = await roleBuild.save();
            if(saveRole){
                return res.status(201).json({
                    success:true,
                    message:"You have added a new role successfully"
                })
            }else{
                return res.status(400).json({
                    success:false,
                    message:"something went wrong while processing"
                })
            }
        } catch (error) {
            res.status(500).json({
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
                return res.status(400).json({
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
            if(checkRole){
                return res.status(400).json({
                    success:false,
                    message:"The permission has been added please input another one"
                })
            }
            const permissionBuild = Permission.build({
                name:permissionName
            })
            const savePermission = await permissionBuild.save();
            if(savePermission){
                return res.status(201).json({
                    success:true,
                    message:"You have added a new permission successfully"
                })
            }else{
                return res.status(400).json({
                    success:false,
                    message:"something went wrong while processing"
                })
            }
        } catch (error) {
            res.status(500).json({
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
            return res.status(400).json({
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
             return res.status(400).json({
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
             return res.status(201).json({
                 success:true,
                 message:"Assign permission successfully"
             })
         }else{
             return res.status(400).json({
                 success:false,
                 message:"something wrong happened while processing"
             })
         }
       } catch (error) {
          return res.status(500).json({
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
            return res.status(400).json({
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
            return res.status(400).json({
                success:false,
                message:"user or role does not existed in database"
            })
        }
        if(checkUser.email === 'admin@gmail.com'){
            return res.status(400).json({
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
            return res.status(201).json({
                success:true,
                message:"role has assigned for this user successfully"
            })
        }else{
            return res.status(400).json({
                success:false,
                message:"Something went wrong"
            })
        }
       } catch (error) {
            return res.status(400).json({
                success:false,
                message:"Something went wrong during processing"
            })
       }
    }
    // remove role for user 
    unAssignRoleForUser = async(req,res)=>{
       try {
            const {role_id,user_id} = req.body;
            const Role = await role();
            const User = await user();
            if(!role_id || !user_id){
                return res.status(400).json({
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
                return res.status(400).json({
                    success:false,
                    message:"user or role does not existed in database"
                })
            }
            if(checkUser.email === 'admin@gmail.com'){
                return res.status(400).json({
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
                return res.status(201).json({
                    success:true,
                    message:"role has been remove for this user successfully"
                })
            }else{
                return res.status(400).json({
                    success:false,
                    message:"sonething went wrong"
                })
            }
       } catch (error) {
          return res.status(500).json({
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
                return res.status(400).json({
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
                return res.status(400).json({
                    success:false,
                    message:"user or role does not existed in database"
                })
            }
            if(checkUser.email === 'admin@gmail.com'){
                return res.status(400).json({
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
                return res.status(201).json({
                    success:true,
                    message:"role has re-assigned for this user successfully"
                })
            }else{
                return res.status(400).json({
                    success:false,
                    message:"sonething went wrong"
                })
            }
       } catch (error) {
          return res.status(500).json({
            success:true,
            message:error
          })
       }
    }
}
module.exports = new RoleAndPermissionController();