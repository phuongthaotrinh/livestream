const { send } = require('express/lib/response');
const setup = require('../Models/User');
const path = require('path');
const moment = require('moment');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const shortid = require('shortid');
const multer = require('multer');
const secret =process.env.SECRET_KEY;
// shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
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
        let date = new Date();
        const isoDate = moment(date).toISOString();
        const {name,email,password,createdAt,updatedAt} = req.body;
         const Edit = User.update({
            name:name,
            email:email,
            password:password,
            createdAt:createdAt,
            updatedAt:isoDate
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
      async login(req, res) {
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
                    success:true,
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
            console.log(secret)
            const token = jwt.sign(
            { user: { id: user.id, name: user.name,fullName:user.fullName, email: user.email } },
            secret,
            { expiresIn: '24h' }
            ); 
            return res.json({
            success: true,
            token: token,
            message:"you have loged in successfully"
            });
        } catch (error) {
            console.error(error);
            return res.json({
            success:false,
            message: 'An error occurred while logging in',
            });
        }
    }
     signup = async (req,res)=>{
        const { name,fullName, email, password,offerCode} = req.body;
        const schema = Joi.object({
          name: Joi.string().required(),
          fullName: Joi.string().required(),
          email: Joi.string().email().required(),
          password: Joi.string().required(),
          createdAt: Joi.date().iso().required(),
          updatedAt: Joi.date().iso().optional().allow(null),
        });
      
        // Validate and sanitize the request body
        const isoDate = moment().toISOString();
        const Code = await code();
        req.body.createdAt = isoDate;
        const bcryptPass = password;
        const saltRounds = 10;
        try {
          const afterhashPass = await bcrypt.hash(bcryptPass, saltRounds);
          const { error, value } = schema.validate(req.body, { stripUnknown: true });
      
          if (error) {
            console.log('Error while validating request body', error);
            return res.status(400).json({ error: error.details[0].message });
          }
      
          // Create a new user using the validated and sanitized request body
          const User = await setup();
          const user = await User.findOne({
            where: {
                email: email
            },
            });
            if(!user){
            const build = User.build({
                name: name,
                fullName: fullName,
                email: email,
                password: afterhashPass,
                createdAt: isoDate,
                updatedAt: null,
              });
          
              const newUser = await build.save();
              if(newUser){
                    if(saveFlower){
                        const token = jwt.sign(
                            { user: { id: dataValues.id, name: dataValues.name,fullName:dataValues.fullName, email: dataValues.email } },
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
                            token:null,
                            success:false,
                            message: 'something wrong happened during process' 
                        });
                    }
              }
            }
        } catch (error) {
          console.log('Error while sign up', error);
          return res.status(500).json({ error: 'Internal server error' });
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
    async checkEmail(req,res){
        const User = await setup();
        const {email} = req.params;
        const user = await User.findOne({
            where: {
                email: email
            },
        });
        if(!user){
            return res.json({
                status:false
            })
        }else{
           return res.json({
                status:true
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
                    message:"the user has been blocked"
                })
            }else{
                return res.json({
                    success:false,
                    message:"something went wrong while processing"
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
                    message:"the user has been blocked"
                })
            }else{
                return res.json({
                    success:false,
                    message:"something went wrong while processing"
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
} 
module.exports = new UserController();