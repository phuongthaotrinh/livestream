const livestreamPlatform = require('../Models/LivestreamPlatform');
const livestreamType = require('../Models/LivestreamType');
const platformRegister = require('../Models/PlatformRegister');
const field = require('../Models/Field');
const formTemplate = require('../Models/FormTemplates');
const formField = require('../Models/FormField');
const typeHasPlatform = require('../Models/TypeHasPlatForm');
const user = require('../Models/User');
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
            return res.status(200).json({
                success:true,
                data:{
                    liveStreamTypeData,
                    liveStreamplatFormData
                }
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
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
            return res.status(403).json({
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
          return res.status(400).json({
             success:false,
             message:"This type has been registered. please skip it"
          })
        }
        const build  = LiveStreamType.build({
         name:name
        });
        const saveName = await build.save();
         if(saveName){
             return res.status(201).json({
                 success:true,
                 message:"You have added a new type successfully"
             })
         }else{
             return res.status(400).json({
                 success:false,
                 message:"Something went wrong"
             })
         }
       } catch (error) {
           console.log(error)
           return res.status(500).json({
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
              return res.status(400).json({
                 success:false,
                 message:"This platform has been registered. please skip it"
                })
            }else{
                const buildPlatForm  = await LiveStreamPlatform.create({
                    name:name
                   });
                    if(buildPlatForm){
                        return res.status(201).json({
                            success:true,
                            message:"You have added a new platform successfully"
                        })
                    }else{
                        return res.status(400).json({
                            success:false,
                            message:"Something went wrong"
                        })
                    }
            }
           } catch (error) {
               console.log(error)
               return res.status(500).json({
                success:false,
                message:"Something went wrong while processing"
            })
        }
    }
    // create fields
    async addField(req, res) {
        try {
            const Field = await field();
            const FormTemplates = await formTemplate();
            const FormField = await formField();
            const TypeHasPlatForm = await typeHasPlatform();
    
            const { field_data, platform_id, form_name, live_type_id } = req.body;
            const build =  Field.build({
                field_data: field_data
            });
    
            const buildTempalte =  FormTemplates.build({
                name: form_name,
                platform_id: platform_id
            });
    
            const buildTypeHasPlatform =  TypeHasPlatForm.build({
                platform_id: platform_id,
                live_type_id: live_type_id
            });
    
            const saveTypeHasPlatform = await buildTypeHasPlatform.save();
            const saveTemplate = await buildTempalte.save();
            const save = await build.save();
    
            if (save && saveTemplate && saveTypeHasPlatform) {
                const field_id = save.dataValues.id;
                const template_id = saveTemplate.dataValues.id;
    
                if (field_id && template_id) {
                    const buildFormField = FormField.build({
                        form_id: template_id,
                        field_id: field_id
                    });
    
                    const saveFormField = await buildFormField.save();
    
                    if (saveFormField) {
                        return res.status(201).json({
                            success: true,
                            message: "You have added a new field successfully"
                        });
                    }
                }
            }
    
            return res.status(400).json({
                success: false,
                message: "Something went wrong while processing"
            });
        } catch (error) {
            console.error("Error in addField:", error);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }
    }
    // create user submissions
    async createUserSubmissions(req,res) {
        try {
          const {user_id,form_id,field_value,field_id} = req.body;
          const PlatformRegister = await platformRegister();
          const Field = await field();
          if(!user_id || !form_id || !field_value){
            return res.status(400).json({
                success:false,
                message:"One of the input field is empty"
            })
          }
             
          const buildSubmission = PlatformRegister.build({
            user_id: user_id,
            form_id: form_id
          });
          const [affectedRows] = await Field.update({
            field_value:field_value
          },{
            where:{
                id:field_id
            }
          })

          const saveSubmission = await buildSubmission.save();
      
          if (saveSubmission && affectedRows > 0) {
            return res.status(201).json({
              success: true,
              message: "Your info is saved successfully."
            });
          }
        } catch (error) {
          return res.status(500).json({
            success: false,
            message: "Internal Server Error"
          });
        }
      }
}
module.exports = new PlatformController();