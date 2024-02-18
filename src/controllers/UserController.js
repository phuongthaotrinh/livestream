const setup = require('../Models/User');
const userGroup = require('../Models/UserGroup');
const role = require('../Models/Role');
const roleHasPermission = require('../Models/RoleHasPermission');
const permission = require('../Models/Permission');
const group = require('../Models/Group');
const path = require('path');
const moment = require('moment');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const shortid = require('shortid');
const multer = require('multer');
const userHasRole = require('../Models/UserHasRole');
const { Op, Sequelize } = require('sequelize');
const user = require('../Models/User');
const news = require('../Models/News');
const slide = require('../Models/Slide');
const platformRegister = require('../Models/PlatformRegister');
const livestreamPlatform = require('../Models/LivestreamPlatform');
const livestreamType = require('../Models/LivestreamType');
const roleHasPer = require('../Models/RoleHasPermission');
const visitedUser = require('../Models/VisitedUser');


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
        // this.addNewUser = this.addNewUser.bind(this);
        // this.getUserRoleAndPermissions = this.getUserRoleAndPermissions.bind(this);
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
            res.status(200).json({
                success:true,
                user:data || []
            })
        }
    }
    async updateUser(req,res){
        const {id} = req.params;
        const User = await setup();
        const {name,email,password,fullName} = req.body;
        if(!name || !email || !password || !fullName){
            return res.status(400).json({
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
            return res.status(201).json({
              success:true,
              message:"Record updated successfully!"
             })
          }else{
            return res.status(400).json({
                success:false,
                message:"something went wrong"
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
            console.log(user.block)
            if(user.block === true || user.block === 1){
                return res.status(400).json({
                    success:false,
                    message:"your account has been blocked. please contact admin to solve it"
                })
            }
            if (!user) {
                return res.status(400).json({
                    success:false,
                    message: 'You have not signed up yet. please signs up first thanks.',
                });
            }
        
            const match = await bcrypt.compare(password, user.password);
             console.log(match)
            if (!match) {
                return res.status(400).json({
                    success:false,
                    message: 'Invalid email or password',
                });
            }
               const token = jwt.sign(
                { user: { id: user.id, name: user.name,fullName:user.fullName, email: user.email } },
                secret,
                { expiresIn: '24h' }
                ); 
                return res.status(201).json({
                    success: true,
                    token: token,
                    message:"you have loged in successfully"
                });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success:false,
                message: 'An error occurred while logging in',
            });
        }
    }
    
    
    async getUserRoleAndPermissionsBelongToUser(req, res) {
        try {
          const { user_id } = req.params;
          const UserHasRole = await userHasRole();
          const RoleHasPermission = await roleHasPermission();
          const Role = await role();
          const Permission = await permission();
          const userRoleInfo = await UserHasRole.findAll({
            where: { user_id: user_id },
            include: [Role],
          });
      
          if (userRoleInfo && userRoleInfo.length > 0) {
            const { user_id, role } = userRoleInfo[0];
      
            if (role) {
              const permissionDatas = await RoleHasPermission.findAll({
                where: {
                  role_id: role.id, // Assuming `id` is the primary key of the Role model
                },
                include: {
                  model: Permission,
                  attributes: ['id', 'name'],
                },
              });
      
              const allPermission = permissionDatas.map((e) => e.Permission);
      
              return res.status(200).json({
                role: role,
                permission: allPermission,
              });
            } else {
              return res.status(200).json({
                role: null, // Return null when no role is found
                permission: [],
              });
            }
          } else {
            return res.status(400).json({
              success: false,
              message: "No user roles were found",
            });
          }
        } catch (error) {
          console.error(error);
          return res.status(500).json({
            success: false,
            message: "Internal server error",
          });
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
            return res.status(400).json({
            success:false,
            message:"Password should greater than 7 characters"
            })
        }
    const bcryptPass = password;
    const saltRounds = 10;
    try {
        if(email === 'admin@gmail.com'){
            return res.status(403).json({
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
                        return res.status(201).json({
                            token:token,
                            success:true,
                            message: 'you have signed up successfully',
                            data:dataValues
                        });
                    }
            }else{
                return res.status(400).json({
                    success:false,
                    message:"Something went wrong while processing"
                })
            }
        }else{
            return res.status(400).json({
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
            res.status(201).json({
                'message':"delete user successfully"
            })
        }).catch(err=>{
            return res.status(500).json({
                success:false,
                message:"Không thể xóa người dùng, hãy khóa để thay thế"
            })
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
            return res.status(201).json({
                status:false,
                message:"Email or Name still available "
            })
        }else{
           return res.status(400).json({
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
                return res.status(201).json({
                    success:true,
                    message:"The user has been blocked"
                })
            }else{
                return res.status(400).json({
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
                return res.status(201).json({
                    success:true,
                    message:"The user has been unblocked"
                })
            }else{
                return res.status(400).json({
                    success:false,
                    message:"Something went wrong while processing"
                })
            }
         }
    }
    //update profile
    async updateProfile(req,res){
        const { name,fullName, email, password,userId,phoneNumber,images,address} = req.body;
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
            password:newPassword,
            phoneNumber:phoneNumber,
            images:images,
            address:address
        },{
            where:{
                id:userId
            }
        })
        if(affectedRows > 0){
            res.status(201).json({
                success:true,
                message:"you have updated your account"
            })
        }else{
            res.status(400).json({
                success:false,
                message:"something went wrong while processing"
            })
        }
    }
    // add user to group
    addNewChild = async (req,res)=>{
       const {child_id,group_id,parent_id} = req.body;
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
                id:parent_id
            },
          },
        ],
      });
      let roleName = false;
      userHasRolesWithAssociations.forEach((userHasRole) => {
          if(userHasRole.role.name === 'manager' || userHasRole.role.name === 'admin'){
            roleName = true
          }
      });
      if(roleName === false){
        return res.status(400).json({
            success:false,
            message:"You don't have permission to add a new member"
        })
      }
    //   const checkuserGroup = await User.findOne({
    //     where: {
    //         [Op.or]: [
    //           { name: name },
    //           { email:email},
    //         ],
    //       }
    //   })
    //   if(checkuserGroup){
    //     return res.status(400).json({
    //         success:false,
    //         message:"This user has been registered once please choose another email and name"
    //     })
    //   }
    //    if(!name || !fullName || !email || !password){
    //     return res.status(400).json({
    //         success:false,
    //         message:"Some of input fields are being empty plase check again"
    //     })
    //    }
        //    const data = {
        //     name:name,
        //     fullName:fullName,
        //     email:email,
        //     password:password
        //    }
        //    const addNewUser = await this.addNewUser(data);
        const build = UserGroup.build({
            group_id:group_id,
            child_id:child_id,
            parent_id:parent_id
        })
        const savebuild = await build.save();
        if(savebuild){
            return res.status(201).json({
                success:true,
                message:"you have added a new member to your group"
            })
        }else{
            return res.status(400).json({
                success:false,
                message:"something went wrong"
            })
        }
    }
    addNewUser = async (data)=>{
        if(!data){
            return res.status(400).json({
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
             return res.status(403).json({
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
                        user_id:newUser.dataValues.id,
                        data:newUser
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
            return res.status(400).json({
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
         return res.status(400).json({
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
         return res.status(201).json({
             success:true,
             message:"User has been removed from the group"
         })
        }
       } catch (error) {
          console.log(error)
          return res.status(500).json({
             success:false,
             message:error
          })
       }
    }
    // get all member in group 
    async getAllMemberInGroup(req, res) {
        try {
            const { user_id,group_id } = req.params;
            const UserHasRole = await userHasRole();
            const UserGroup = await userGroup();
            const Role = await role();
            const User = await setup();
            const Group = await group();
    
            const checkUserRole = await UserHasRole.findOne({
                where: { user_id: user_id },
                include: {
                    model: Role,
                    attributes: ['id', 'name']
                }
            });
    
            if (checkUserRole && checkUserRole.role.name === 'manager' ||  checkUserRole.role.name === 'admin') {
                const group = await Group.findAll({
                    include: [
                      {
                        model: User,
                      }
                    ],
                    where:{
                        user_id:user_id
                    }
                  });
                  let childId = [];
                const userGroup = await UserGroup.findAll({
                    include: [
                        {
                          model: User,
                        }
                      ],
                    where:{
                        status:'on',
                        group_id:group_id,
                        parent_id:user_id
                    }
                });
                userGroup?.map((value)=>{
                    childId.push(value.child_id)
                })
                const ChildData = await User.findAll({
                    where:{
                        id: {
                            [Sequelize.Op.in]: childId,
                        },
                    }
                })
                return res.status(200).json({
                    success: true,
                    group: group ? group : [],
                    userGroup:userGroup ? userGroup : [],
                    childData:ChildData ? ChildData : []
                });
            } else {
                // Handle other roles if needed
                return res.status(403).json({
                    success: false,
                    message: "Access forbidden for this role."
                });
            }
        } catch (error) {
            console.error("Error in getAllMemberInGroup:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    }
    
   // get all group users are in
   async getBelongGroup(req,res){
      try {
         const {user_id} = req.params;
         const userHasGroup = await userGroup();
         const User = await setup()
          const Groups = await group()

         const data = await userHasGroup.findAll({
            where:{
                child_id:user_id
            },
             include:[
                 {
                     model: User
                 },
                 {
                     model: Groups
                 },
             ]
         });
         return res.status(200).json({
            success:true,
            data:data ? data:[]
         })
      } catch (error) {
          return res.status(500).json({
             success:false,
             message:"Something went wrong while processing"
          })
      }
   }
   // get user group id 
   async getUserGroupId(req,res){
      try {
         const {user_id} = req.params;
         const UserGroup = await userGroup();
         const data = await UserGroup.findAll({
            where:{
                child_id:user_id,
                status:'on'
            }
         })
         const groupId = [];
         data.map((v)=>{
            groupId.push(v.group_id)
         })
         return res.status(201).json({
            success:true,
            data:groupId ? groupId:[]
         })
      } catch (error) {
         console.log(error)
         return res.status(500).json({
            success:false,
            data:[]
         })
      }
   }
   // get statistic
   async getStatistic(req,res){
       try {
        const {startDate,endDate} = req.body;
         let TotalUser = 0;
         let totalNews = 0;
         let totalSlide = 0;
         let totalGroup = 0;
         let totalUserHasRegisterSubmission = 0;
         let totalLiveStreamType = 0;
         let totalPlatForm = 0;
         const News = await news();
         const User = await user();
         const Slide = await slide();
         const Group = await group();
         const PlatformRegister = await platformRegister();
         const LiveStreamPlatform = await livestreamPlatform();
         const LiveStreamType = await livestreamType();
         const from = new Date(startDate);
         const to = new Date(endDate);
         if(startDate && endDate){
            TotalUser = await User.count({
                where:{
                    block:false,
                    createdAt: {
                        [Op.between]: [from, to]
                    },
                }
            })
            totalNews = await News.count({
                where:{
                    status:true,
                    createdAt: {
                        [Op.between]: [from, to]
                    },
                }
            })
            totalSlide = await Slide.count({
                where:{
                    status:true,
                    createdAt: {
                        [Op.between]: [from, to]
                    },
                }
            })
            totalGroup = await Group.count({
               where:{
                  status:"on",
                  createdAt: {
                    [Op.between]: [from, to]
                },
               }
            })
            totalUserHasRegisterSubmission = await PlatformRegister.count({
                where:{
                    status:"active",
                    createdAt: {
                        [Op.between]: [from, to]
                    },
                }
            })
            totalLiveStreamType = await LiveStreamPlatform.count({
                where:{
                    status:"on",
                }
            })
            totalPlatForm  = await LiveStreamType.count()
         }else{
            TotalUser = await User.count({
                where:{
                    block:false
                }
            })
            totalNews = await News.count({
                where:{
                    status:true
                }
            })
            totalSlide = await Slide.count({
                where:{
                    status:true
                }
            })
            totalGroup = await Group.count({
               where:{
                  status:"on"
               }
            })
            totalUserHasRegisterSubmission = await PlatformRegister.count({
                where:{
                    status:"active"
                }
            })
            totalLiveStreamType = await LiveStreamPlatform.count({
                where:{
                    status:"on"
                }
            })
            totalPlatForm  = await LiveStreamType.count() 
         }
         return res.status(201).json({
            TotalUser:TotalUser,
            totalNews:totalNews,
            totalSlide:totalSlide,
            totalGroup:totalGroup,
            totalUserHasRegisterSubmission:totalUserHasRegisterSubmission,
            totalLiveStreamType:totalLiveStreamType,
            totalPlatForm:totalPlatForm
         })
       } catch  (error) {
          console.log(error)
          return res.status(500).json({
            TotalUser:0,
            totalNews:0,
            totalSlide:0,
            totalGroup:0,
            totalUserHasRegisterSubmission:0,
            totalLiveStreamType:0,
            totalPlatForm:0
         })
       }
   }

   async getUserDetail(req, res) {
    const {user_id}  = req.params;
       const Role = await role();
       const Permission = await permission();
    const userRole = await userHasRole();
    const Users = await setup();
    const Groups = await group();
    const UserGroup = await userGroup();

    const RoleHasPermission = await roleHasPer();


    const info = await Users.findOne({id:user_id});

    const groupManagerData = await Groups.findAll({
        where:{
            user_id:user_id
        }
    })

   const groupBelongData = await UserGroup.findAll({
       where:{
           child_id:user_id
       },
       include:
           {
               model:Users,
               attributes:['id', 'email', 'images','name'],

           }
   });

    let permissionData = [];
    let roleData = [];




    if(info) {
        roleData = await userRole.findAll({
            where:{
                user_id: user_id,
                status: "on"
            },
            include:[
                {
                    model:Role,
                    attributes:['id', 'name']
                }
            ]
        });





    }

    const data = {
        groupManager:groupManagerData,
        groupBelong:groupBelongData,
        info:info,
        permission:permissionData,
        // enablePermission:[],
        // platforms:[],
        // user_has_pl_id:0,
        role:roleData
    }


    return res.status(201).json({
        data:data
    })
   }
   // visited user 
   async addVisitedUser(req,res){
     try {
        const {user_id} = req.body;
        const VisitedUser = await visitedUser();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const checkBofore = await VisitedUser.findOne({
            where:{
                user_id:user_id,
                createdAt:{
                    [Op.gte]:today
                }
            },
        })
        if(!checkBofore){
            const save = await VisitedUser.create({
               user_id:user_id
            });
            if(save){
                return res.status(201).json({
                    success:true,
                })
            }else{
                return res.status(400).json({
                    success:false
                })
            }
        }
     } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false
        })
     }
   }
   async getStatisticVisitedUser(req,res){
       try {
        const VisitedUser = await visitedUser();
        const recordsByMonth = await VisitedUser.findAll({
            attributes: [
              [Sequelize.fn('MONTH',Sequelize.col('createdAt')), 'month'],
              [Sequelize.fn('YEAR',Sequelize.col('createdAt')), 'year'],
              [Sequelize.fn('count', Sequelize.col('id')), 'count'] 
            ],
            group: [
                Sequelize.fn('MONTH', Sequelize.col('createdAt')),
                Sequelize.fn('YEAR', Sequelize.col('createdAt'))
              ]
          });
          return res.status(200).json({
            success:true,
            data:recordsByMonth
          })
       } catch (error) {
          console.log(error)
          return res.status(500).json({
            success:true,
            data:[]
          })
       }
   }
   // get recent visited users 
   async getVisitedUser(req, res) {
    try {
      const VisitedUser = await visitedUser();
      const User = await user();
      
      // Get the start of today
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
  
      // Get the end of today
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);
  
      // Retrieve visited users for today
      const data = await VisitedUser.findAll({
        where: {
          createdAt: {
            [Op.between]: [todayStart, todayEnd] // Find records created between start and end of today
          }
        },
        include: [{
          model: User,
          attributes: ['id', 'name']
        }]
      });
  
      if (data.length > 0) {
        return res.status(200).json({
          success: true,
          data: data
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "No visited users found for today."
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Internal server error."
      });
    }
  }
  
  
}
module.exports = new UserController();