const path = require('path');
const multer = require('multer');
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
  
const upload = multer({ storage }).array('images',5);
const news = require('../Models/News');
const slide = require('../Models/Slide');
const group = require('../Models/Group');
const { error } = require('console');
class AdditionalController{
    // add bulk slides 
    async addSlide(req, res) {
        try {
            upload(req, res, async function (err) {
                if (err instanceof multer.MulterError) {
                    return res.status(400).json({
                        success: false,
                        message: err.message
                    });
                } else if (err) {
                    return res.status(500).json({ error: err.message });
                }
    
                let fileNames = [];
    
                if (req.files) {
                    fileNames = req.files.map((file) => ({ fileName: file.filename }));
                }
    
                if (fileNames.length === 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'No files uploaded'
                    });
                }
    
                const Slide = await slide();
    
                await Promise.all(
                    fileNames.map(async (v) => {
                        await Slide.create({
                            image_link: v.fileName
                        });
                    })
                );
    
                return res.status(201).json({
                    success: true,
                    message: 'All files are inserted'
                });
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    
    // retrieve all slides 
     async getAllSlide(req,res){
        try {
            const Slide = await slide();
            const data = await Slide.findAll({
                order: [['createdAt', 'DESC']],
            });
            return res.status(200).json({
                success:true,
                data:data || []
            })
        } catch (error) {
            return res.status(500).json({
                success:false,
                message:"something went wrong",
                data:[]
            })
        }
     }
     // add news
    async addNewsOrUpdate(req,res){
       try {
        upload(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({
                    success: false,
                    message: err.message
                });
            } else if (err) {
                return res.status(500).json({ error: err.message });
            }
            const {title,content,image_link,preview,id} = req.body;
            let fileNames = [];

            if (req.file && !image_link) {
                fileNames = req.files.map((file) => ({ fileName: file.filename }));
            }else{
                if(image_link && id){
                    fileNames = image_link;
                }
            }
           const News = await news();
           if(!id){
                const saveNews = await News.create({
                    title:title,
                    content:content,
                    preview:preview,
                    image_link:fileNames
                });
                if(saveNews){
                    return res.status(201).json({
                        success: true,
                        message: 'News has added successfully'
                    });
                }else{
                    return res.status(201).json({
                        success: false,
                        message: 'something went wrong'
                    });
                }
           }else{
                const [affectedRows] = await News.update({
                    title:title,
                    content:content,
                    image_link:fileNames
                },{
                    where:{
                        id:id
                    }
                });
                if(affectedRows > 1){
                    return res.status(201).json({
                        success: true,
                        message: 'News has updated'
                    });
                }else{
                    return res.status(201).json({
                        success: false,
                        message: 'something went wrong'
                    });
                }
           }
        });
       } catch (error) {
           console.log(error)
            return res.status(500).json({
            success: false,
            message: 'something went wrong'
        });
       }
    }
    // get news
    async getNews(req,res){
        try {
            const {id} = req.body;
            let data = null;
            const News = await news();
            if(!id){
                data = await News.findAll({
                    order: [['createdAt', 'DESC']],
                });
            }else{
                data = await News.findOne({
                    where:{
                        id:id
                    }
                })
            }
           return res.status(200).json({
            success:true,
            data:data
           })
        } catch (error) {
            console.log(error)
            return res.status(200).json({
                success:false,
                data:[]
            })
        }
    }
    // add or update group info
    async addNewGroup(req,res){
        try {
            const {id,name,user_id,status} = req.body;
            const Group = await group();
            const checkBefore = await Group.findOne({
                where:{
                    name:name,
                    user_id:user_id
                }
            });
            let save = null;
            if(id && status){
                const [affectedRows] = await Group.update({
                    status:status
                },{
                    where:{
                        id:id
                    }
                });
                if(affectedRows > 0){
                    return res.status(201).json({
                        success:true,
                        message:"Update group successfully"
                    })
                }
            }
            if(checkBefore !== null){
                const [affectedRows] = await Group.update({
                    name:name,
                    user_id:user_id
                },{
                    where:{
                        id:checkBefore.id
                    }
                });
                if(affectedRows > 0){
                    return res.status(201).json({
                       success:true,
                       message:"Action successfully done"
                    })
                }
            }else{
                save = await Group.create({
                    name:name,
                    user_id:user_id
                })
                if(save){
                    return res.status(201).json({
                        success:true,
                        message:"Group created successfully"
                    })
                }
            }
        } catch (error) {
             console.log(error)
             return res.status(500).json({
                success:false,
                message:"something went wrong"
             })
        }
    }
    // get all group or by id 
    async getAllOrByIdGroup(req,res){
        try {
            const {id}= req.params;
            const Group = await group();
            let data = []
            if(id){
               data = await Group.findOne({
                    where:{
                        id:id
                    }
               });
            }else{
                data = await Group.findAll();
            }
            return res.status(200).json({
                success:true,
                data:data
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                success:false,
                data:[]
            })
        }
    }
}
module.exports = new AdditionalController();