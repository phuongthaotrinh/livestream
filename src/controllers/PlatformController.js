const livestreamPlatform = require('../Models/LivestreamPlatform');
const livestreamType = require('../Models/LivestreamType');
const platformRegister = require('../Models/PlatformRegister');
class PlatformController{
    // retrive all platform and type 
    async getAll(req,res){
        try {
            const LiveStreamPlatform = await livestreamPlatform();
            const LiveStreamType = await livestreamType();
            let liveStreamTypeData = null;
            let liveStreamplatFormData = null;
            const retrieveType = await LiveStreamType.findAll();
            const retrievePlatform = await LiveStreamPlatform.findAll();
            if(retrieveType){
                liveStreamTypeData = retrieveType;
            }
            if(retrievePlatform){
                liveStreamplatFormData = retrievePlatform;
            }
            return res.json({
                success:true,
                data:{
                    liveStreamTypeData,
                    liveStreamplatFormData
                }
            })
        } catch (error) {
            console.log(error)
            return res.json({
                success:false,
                message:"Something went wrong while processing"
            })
        }
    }
    // add live tream type
    async addLiveStreamType(req,res){
       try {
        const {name}= req.body;
        if(!name){
            return res.json({
                success:false,
                message:"name is not allow to be empty"
            })
        }
        const LiveStreamType = await livestreamType();
        const checkExisting = await LiveStreamType.findOne({
         where:{
             name:name
         }
        })
        if(checkExisting !== null){
          return res.json({
             success:false,
             message:"This type has been registered. please skip it"
          })
        }
        const build  = LiveStreamType.build({
         name:name
        });
        const saveName = await build.save();
         if(saveName){
             return res.json({
                 success:true,
                 message:"You have added a new type successfully"
             })
         }else{
             return res.json({
                 success:false,
                 message:"Something went wrong"
             })
         }
       } catch (error) {
           console.log(error)
           return res.json({
            success:false,
            message:"Something went wrong while processing"
        })
       }
    }
    async addLiveStreamPlatform(req,res){
        try {
            const {name}= req.body;
            if(!name){
                return res.json({
                    success:false,
                    message:"name is not allow to be empty"
                })
            }
            const LiveStreamPlatform = await livestreamPlatform();
            const checkExisting = await LiveStreamPlatform.findOne({
                where:{
                    name:name,
                }
            })
            if(checkExisting !==null){
              return res.json({
                 success:false,
                 message:"This platform has been registered. please skip it"
                })
            }else{
                const buildPlatForm  = await LiveStreamPlatform.create({
                    name:name
                   });
                    if(buildPlatForm){
                        return res.json({
                            success:true,
                            message:"You have added a new platform successfully"
                        })
                    }else{
                        return res.json({
                            success:false,
                            message:"Something went wrong"
                        })
                    }
            }
           } catch (error) {
               console.log(error)
               return res.json({
                success:false,
                message:"Something went wrong while processing"
            })
        }
    }
}
module.exports = new PlatformController();