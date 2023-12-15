const setup = require('../Models/User');
const userGroup = require('../Models/UserGroup');
const role = require('../Models/Role');
const roleHasPermission = require('../Models/RoleHasPermission');
const permission = require('../Models/Permission');
const path = require('path');
const moment = require('moment');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const shortid = require('shortid');
const multer = require('multer');
const userHasRole = require('../Models/UserHasRole');
const { Op } = require('sequelize');
const secret =process.env.SECRET;
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const destinationPath = path.join(__dirname, '..', 'public', 'uploads');
      cb(null, destinationPath);
    },
    filename: (req, file, cb) => {
      const fileName = `${file.originalname}`;
      cb(null, fileName);
    }
  });
  
const upload = multer({ storage }).single('image');
class UserController{
    constructor() {
        this.addNewUser = this.addNewUser.bind(this);
        this.getUserRoleAndPermissions = this.getUserRoleAndPermissions.bind(this);
    }
    async index(req,res){
        const User = await setup();
        const users = await User.findAll();
       return res.json({
            "data":users ? users : [],
            success:true
        });
    }
    async findOne(req,res){
        const {id} = req.params;
        const User = await setup();
        const data = await User.findOne({ where: { id: id }});
        if(data){
            res.json({
                success:true,
                user:data
            })
        }else{
            res.json({
                success:false,
                user:[]
            })
        }
    }
    async updateUser(req,res){
        const {id} = req.params;
        const User = await setup();
        const {name,email,password,fullName} = req.body;
        if(!name || !email || !password || !fullName){
            return res.json({
                success:false,
                message:"one of your input is empty"
            })
        }
         const Edit = await User.update({
            name:name,
            fullName:fullName,
            email:email,
            password:password,
          },{
              where: {
              id: id
              }
          });
          if(Edit){
            res.json({
              success:true,
              message:"Record updated successfully!"
             })
          }
      }
      // login method
      login = async(req, res)=>{
        const { email, password } = req.body;
        const User = await setup();
        try {
            const user = await User.findOne({
            where: {
                email: email
            },
            });
            if(user.block === true || user.block === 1){
                return res.json({
                    success:false,
                    message:"your account has been blocked. please contact admin to solve it"
                })
            }
            if (!user) {
                return res.json({
                    success:false,
                    message: 'You have not signed up yet. please signs up first thanks.',
                });
            }
        
            const match = await bcrypt.compare(password, user.password);
        
            if (!match) {
                return res.json({
                    success:false,
                    message: 'Invalid email or password',
                });
            }
            const roleAndPermission = await this.getUserRoleAndPermissions(user.id);
            if(roleAndPermission){
                const token = jwt.sign(
                    { user: { id: user.id, name: user.name,fullName:user.fullName, email: user.email,roleAndPermission } },
                    secret,
                    { expiresIn: '24h' }
                    ); 
                return res.json({
                    success: true,
                    token: token,
                    message:"you have loged in successfully"
                });
            }
        } catch (error) {
            console.error(error);
            return res.json({
                success:false,
                message: 'An error occurred while logging in',
            });
        }
    }

    // get user role and permissions 
     getUserRoleAndPermissions = async(userId)=>{
        try {
          const UserHasRole = await userHasRole();
          const RoleHasPermission = await roleHasPermission();
          const Role = await role();
          const Permission = await permission();
          const userRoleInfo = await UserHasRole.findOne({
            where: { user_id: userId},
            include: [Role],
          });
      
          if (userRoleInfo) {
            const {user_id, role } = userRoleInfo;
            if(role){
                const permissionDatas = await RoleHasPermission.findAll({
                    where:{
                        role_id:role.dataValues.id
                    },
                    include:{
                        model:Permission,
                        attributes: ['id', 'name'],
                    }
                })
                if(permissionDatas){
                    let allPermission = null;
                    permissionDatas.forEach((e)=>{
                         allPermission = e.dataValues.permission;    
                    })
                    return {role:role,permission:allPermission}
                }
            }
          } else {
            return {}
          }
        } catch (error) {
          return {}
        }
      }

     signup = async (req,res)=>{
        const { name,fullName, email, password} = req.body;
        if(!name || !fullName || !email || !password){
            return res.json({
                success:false,
                message:"Some of input fields are being empty plase check again"
            })
           }
           if(password.length < 7){
             return res.json({
                success:false,
                message:"Password should greater than 7 characters"
             })
           }
        const bcryptPass = password;
        const saltRounds = 10;
        try {
         if(email === 'admin@gmail.com'){
             return res.json({
                success:false,
                message:"you don't allow to create account with this email. please consider another one"
             })
         }
          const afterhashPass = await bcrypt.hash(bcryptPass, saltRounds);
          const User = await setup();
          const user = await User.findOne({
            where: {
                email:email,
                name:name
            },
            });
            if(!user){
                const build = User.build({
                    name: name,
                    fullName: fullName,
                    email: email,
                    password: afterhashPass
                });
            
                const newUser = await build.save();
                    if(newUser){
                        const dataValues = newUser.dataValues;
                        const token = jwt.sign(
                            { user: { id: dataValues.id, name: dataValues.name,fullName:dataValues.fullName, email: dataValues.email,role:"user",permissions:"" } },
                            secret,
                            { expiresIn: '24h' }
                        );
                        if(token){
                            return res.json({
                                token:token,
                                success:true,
                                message: 'you have signed up successfully' 
                            });
                        }
                }else{
                    return res.json({
                        success:false,
                        message:"Something went wrong while processing"
                    })
                }
            }else{
                return res.json({
                    success:false,
                    message:"The email has been taken please use another one.thanks"
                })
            }
        } catch (error) {
          console.log('Error while sign up', error);
          return res.status(500).json({
            success:false,
            message: 'Internal server error' });
        }
    }
    async deleteUser(req,res){
        const User = await setup();
        const {id} = req.params;
        User.destroy({
            where: {
              id:id
            }
        }).then(()=>{
            res.json({
                'message':"delete user successfully"
            })
        }).catch(err=>{
            console.log(err)
        })
    }
    async checkEmailAndName(req,res){
        const User = await setup();
        const {email,name} = req.params;
        const user = await User.findOne({
            where: {
                [Op.or]: [
                  { name: name },
                  { email:email},
                ],
              }
        });
        if(!user){
            return res.json({
                status:false,
                message:"Email or Name still available "
            })
        }else{
           return res.json({
                status:true,
                message:"Email or Name has been taken . please choose another one"
            })
        }
    }
    async blockUser(req,res){
         const {id} = req.params;
         const User = await setup();
         const checkUser = await User.findOne({
            where:{
                id:id
            }
         });
         if(checkUser){
            const blockUser = await User.update({
                block:true
            },{
                where:{
                    id:id
                }
            })
            if(blockUser > 0){
                return res.json({
                    success:true,
                    message:"The user has been blocked"
                })
            }else{
                return res.json({
                    success:false,
                    message:"Something went wrong while processing"
                })
            }
         }
    }
    // unblock
    async unBlockUser(req,res){
        const {id} = req.params;
        const User = await setup();
        const checkUser = await User.findOne({
            where:{
                id:id
            }
         });
         if(checkUser){
            const blockUser = await User.update({
                block:false
            },{
                where:{
                    id:id
                }
            })
            if(blockUser > 0){
                return res.json({
                    success:true,
                    message:"The user has been unblocked"
                })
            }else{
                return res.json({
                    success:false,
                    message:"Something went wrong while processing"
                })
            }
         }
    }
    //update profile
    async updateProfile(req,res){
        const { name,fullName, email, password,userId} = req.body;
        const User =await setup();
        const saltRounds = 10;
        let newPassword = "";
        const userData = await User.findOne({
            where:{
                id:userId
            }
        })
        if(userData.password !== password){
            newPassword =  await bcrypt.hash(password, saltRounds);
        }else{
            newPassword = password
        }
        const [affectedRows] = await User.update({
            name:name,
            fullName:fullName,
            email:email,
            password:newPassword
        },{
            where:{
                id:userId
            }
        })
        if(affectedRows > 0){
            res.json({
                success:true,
                message:"you have updated your account"
            })
        }else{
            res.json({
                success:false,
                message:"something went wrong while processing"
            })
        }
    }
    // add user to group
    addNewChild = async (req,res)=>{
       const {name,fullName,email,password,user_id} = req.body;
       const UserGroup = await userGroup();
       const User = await setup();
       const Role = await role();
       const UserHasRole = await userHasRole();
       const userHasRolesWithAssociations = await UserHasRole.findAll({
        include: [
          {
            model: Role,
          },
          {
            model: User,
            where: {
                id:user_id
            },
          },
        ],
      });
      let roleName = "";
      userHasRolesWithAssociations.forEach((userHasRole) => {
        roleName = userHasRole.role.name; // Accessing Role through dot notation
      });
      if(roleName !== "manager" || !roleName){
        return res.json({
            success:false,
            message:"This user can not create a new user"
        })
      }
      const checkuserGroup = await User.findOne({
        where: {
            [Op.or]: [
              { name: name },
              { email:email},
            ],
          }
      })
      if(checkuserGroup){
        return res.json({
            success:false,
            message:"This user has been registered once please choose another email and name"
        })
      }
       if(!name || !fullName || !email || !password){
        return res.json({
            success:false,
            message:"Some of input fields are being empty plase check again"
        })
       }
       const data = {
        name:name,
        fullName:fullName,
        email:email,
        password:password
       }
       const addNewUser = await this.addNewUser(data);
       console.log("addNewUser",addNewUser)
       if(addNewUser && addNewUser.success === true){
            if(!addNewUser.user_id){
                return res.json({
                    success:false,
                    message:"something went wrong plase try again"
                })
            }
            const build = UserGroup.build({
                parent_id:user_id,
                child_id:addNewUser.user_id
            })
            const savebuild = await build.save();
            if(savebuild){
                return res.json({
                    success:true,
                    message:"you have added a new member to your group"
                })
            }else{
                return res.json({
                    success:false,
                    message:"something went wrong"
                })
            }
       }else{
        return res.json({
            success:false,
            message:"Something went wrong during process"
        })
       }
    }
    addNewUser = async (data)=>{
        if(!data){
            return res.json({
                success:false,
                message:"body is being empty please check again"
            })
        }
        const name  = data.name;
        const fullName = data.fullName;
        const email = data.email;
        const bcryptPass = data.password;
        const saltRounds = 10;
        try {
         if(email === 'admin@gmail.com'){
             return res.json({
                success:false,
                message:"you don't allow to create account with this email. please consider another one"
             })
         }
          const afterhashPass = await bcrypt.hash(bcryptPass, saltRounds);
          const User = await setup();
                const build = User.build({
                    name: name,
                    fullName: fullName,
                    email: email,
                    password: afterhashPass
                });
                const newUser = await build.save();
                if(newUser){
                        return {
                        success:true,
                        user_id:newUser.dataValues.id
                        };
                }else{
                    return {
                        success:false,
                        user_id:0
                    };
                }
        } catch (error) {
          console.log('Error while sign up', error);
          return {
            success:false
          };
        }
    }
    // remove user from group 
    removeMember = async (req,res)=>{
       try {
        const {child_id,parent_id} = req.body;
        if(!child_id || !parent_id){
            return res.json({
                success:false,
                message:"one of input fields are empty please check inputs"
            })
        }
        const UserGroup = await userGroup();
        const check = await UserGroup.findOne({
         where:{
             parent_id:parent_id,
             child_id:child_id
         }
        });
        if(!check){
         return res.json({
             success:false,
             message:"Child or Parent does not exist or missing params. please check again"
         })
        }
        const [affectedRows] = await UserGroup.update({
          status:"off"
        },{
         where:{
             parent_id:parent_id,
             child_id:child_id
         }
        })
        if(affectedRows > 0){
         return res.json({
             success:true,
             message:"User has been removed from the group"
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
} 
module.exports = new UserController();