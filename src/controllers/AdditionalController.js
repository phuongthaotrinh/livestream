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
            const data = await Slide.findAll();
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
    async addNews(req,res){
           
    }
    // get news
    async getNews(){
 
    }
    // get newest news 
    async getNewestNews(){

    }
}
module.exports = new AdditionalController();