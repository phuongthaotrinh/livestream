const livestreamPlatform = require('../Models/LivestreamPlatform');
const livestreamType = require('../Models/LivestreamType');
const platformRegister = require('../Models/PlatformRegister');
const field = require('../Models/Field');
const formTemplate = require('../Models/FormTemplates');
const formField = require('../Models/FormField');
const formFieldData = require('../Models/FormFieldData');
const user = require('../Models/User');
const userhasplatform = require('../Models/UserHasPlatform');
const { Op } = require('sequelize');
class PlatformController {
    // retrive all platform and type 
    async getAll(req, res) {
        try {
            const LiveStreamPlatform = await livestreamPlatform();
            const LiveStreamType = await livestreamType();
            let liveStreamTypeData = null;
            let liveStreamplatFormData = null;
            const retrieveType = await LiveStreamType.findAll();
            const retrievePlatform = await LiveStreamPlatform.findAll();
            if (retrieveType) {
                liveStreamTypeData = retrieveType;
            }
            if (retrievePlatform) {
                liveStreamplatFormData = retrievePlatform;
            }
            return res.status(200).json({
                success: true,
                data: {
                    liveStreamTypeData,
                    liveStreamplatFormData
                }
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                success: false,
                message: "Something went wrong while processing"
            })
        }
    }
    // add live tream type
    async addLiveStreamType(req, res) {
        try {
            const { name } = req.body;
            if (!name) {
                return res.status(403).json({
                    success: false,
                    message: "name is not allow to be empty"
                })
            }
            const LiveStreamType = await livestreamType();
            const checkExisting = await LiveStreamType.findOne({
                where: {
                    name: name
                }
            })
            if (checkExisting !== null) {
                return res.status(400).json({
                    success: false,
                    message: "This type has been registered. please skip it"
                })
            }
            const build = LiveStreamType.build({
                name: name
            });
            const saveName = await build.save();
            if (saveName) {
                return res.status(201).json({
                    success: true,
                    message: "You have added a new type successfully"
                })
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Something went wrong"
                })
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                success: false,
                message: "Something went wrong while processing"
            })
        }
    }
    // add live stream platforms 
    async addLiveStreamPlatform(req, res) {
        try {
            const { name } = req.body;
            if (!name) {
                return res.json({
                    success: false,
                    message: "name is not allow to be empty"
                })
            }
            const LiveStreamPlatform = await livestreamPlatform();
            const checkExisting = await LiveStreamPlatform.findOne({
                where: {
                    name: name,
                }
            })
            if (checkExisting !== null) {
                return res.status(400).json({
                    success: false,
                    message: "This platform has been registered. please skip it"
                })
            } else {
                const buildPlatForm = await LiveStreamPlatform.create({
                    name: name
                });
                if (buildPlatForm) {
                    return res.status(201).json({
                        success: true,
                        message: "You have added a new platform successfully"
                    })
                } else {
                    return res.status(400).json({
                        success: false,
                        message: "Something went wrong"
                    })
                }
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                success: false,
                message: "Something went wrong while processing"
            })
        }
    }
    // create fields
    async addField(req, res) {
        try {
            const Field = await field();
            const FormTemplates = await formTemplate();
            const FormField = await formField();

            const { field_name, form_name, live_type_id } = req.body;
            const build = Field.build({
                field_name: field_name
            });

            const buildTempalte = FormTemplates.build({
                name: form_name,
                live_type_id: live_type_id
            });
            const saveTemplate = await buildTempalte.save();
            const save = await build.save();

            if (save && saveTemplate) {
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
    async createUserSubmissions(req, res) {
        try {
            const { user_id, form_id, field_data, field_id, form_field_id, platform_ids } = req.body;
            const PlatformRegister = await platformRegister();
            const Field = await field();
            const FormFieldData = await formFieldData();
            if (!user_id || !form_id || !field_data) {
                return res.status(400).json({
                    success: false,
                    message: "One of the input field is empty"
                })
            }
            const buildSubmission = PlatformRegister.build({
                user_id: user_id,
                form_id: form_id,
                form_field_id: form_field_id,
                platform_ids: platform_ids
            });
            const saveFormFieldData = await FormFieldData.create({
                field_data: field_data,
                user_id: user_id,
                field_id: field_id
            })

            const saveSubmission = await buildSubmission.save();

            if (saveSubmission && saveFormFieldData) {
                return res.status(201).json({
                    success: true,
                    message: "Your info is saved successfully."
                });
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }
    }
    // add more type into platform
    async addMoreType(req, res) {
        try {
            const { platform_id, live_type_id } = req.body;
            const TypeHasPlatForm = await typeHasPlatform();
            if (!platform_id || !live_type_id) {
                return res.status(400).json({
                    success: false,
                    message: "one these fields can not be empty"
                })
            }
            const checkExisting = await TypeHasPlatForm.findOne({
                where: {
                    platform_id: platform_id,
                    live_type_id: live_type_id
                }
            });
            if (checkExisting) {
                return res.status(400).json({
                    success: false,
                    message: "existed record !"
                })
            }
            const save = await TypeHasPlatForm.create({
                platform_id: platform_id,
                live_type_id: live_type_id
            });
            if (save) {
                return res.status(201).json({
                    success: true,
                    message: "save successfully"
                })
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Error occurs while processing"
                })
            }
        } catch (error) {
            console.log(error)
        }
    }
    // create form 
    async getForm(req, res) {
        try {
            const { user_id } = req.params;
            const Field = await field();
            const FormFields = await formField();
            const Forms = await formTemplate();
            const PlatformRegisters = await platformRegister();
            const LivestreamPlatform = await livestreamPlatform();
            const LivestreamType = await livestreamType();
            const userSubmissions = await PlatformRegisters.findOne({
                where: { user_id: user_id },
                include: [
                    {
                        model: Forms,
                        include: {
                            model: LivestreamType
                        }
                    },
                    {
                        model: FormFields,
                        include: {
                            model: Field,
                        }
                    },
                ],
            });
            let platformIds = userSubmissions.platform_ids;
            const platforms = await LivestreamPlatform.findAll({
                where: {
                    id: {
                        [Op.in]: platformIds
                    }
                }
            })
            return res.json(
                {
                    userSubmissions,
                    platforms
                });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Something went wrong",
            });
        }
    }

    // admin approve register platform form
    async approveRegisteredPlatform(req, res) {
        try {
            const { user_id, register_id, status } = req.body;
            const PlatformRegisters = await platformRegister();
            const [affectedRows] = await PlatformRegisters.update({
                additional_status: status
            }, {
                where: {
                    user_id: user_id,
                    id: form_id
                }
            })
            if (affectedRows > 0) {
                return res.status(201).json({
                    success: true,
                    message: "You have approved it"
                })
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Somthing went wrong"
                })
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Somthing went wrong while processing"
            })
        }
    }
    // get registered detail and result
    async getRegisteredDetailAndResult(req, res) {
        try {
            const { user_id } = req.params;
            const Field = await field();
            const FormFields = await formField();
            const Forms = await formTemplate();
            const PlatformRegisters = await platformRegister();
            const LivestreamPlatform = await livestreamPlatform();
            const LivestreamType = await livestreamType();
            const userSubmissions = await PlatformRegisters.findOne({
                where: { user_id: user_id },
                include: [
                    {
                        model: Forms,
                        include: {
                            model: LivestreamType
                        }
                    },
                    {
                        model: FormFields,
                        include: {
                            model: Field,
                        }
                    },
                ],
            });
            let platformIds = userSubmissions.platform_ids;
            const platforms = await LivestreamPlatform.findAll({
                where: {
                    id: {
                        [Op.in]: platformIds
                    }
                }
            })
            return res.json(
                {
                    userSubmissions,
                    platforms
                });
        } catch (error) {

        }
    }
    // get forms bhy live type id
    async getFormByLiveTypeId(req, res) {
        try {
            const { live_type_id } = req.params;
            const Field = await field();
            const FormFields = await formField();
            const Forms = await formTemplate();
            let collectformId = [];
            const FormsIds = await Forms.findAll({
                where: {
                    live_type_id: live_type_id
                }
            })
            if (!FormsIds) {
                return res.status(400).json({
                    success: false,
                    message: "Form belong to livestream type is not found"
                })
            }
            FormsIds.map((v) => {
                collectformId.push(v.id)
            })
            let collectFormFieldIds = [];
            const formnFieldIds = await FormFields.findAll({
                where: {
                    form_id: {
                        [Op.in]: collectformId
                    }
                }
            })
            if (!formnFieldIds) {
                return res.status(400).json({
                    success: false,
                    message: "FormFields belong to livestream type is not found"
                })
            }
            formnFieldIds.map((v) => {
                collectFormFieldIds.push(v.field_id)
            });
            const fieldData = await Field.findAll({
                where: {
                    id: {
                        [Op.in]: collectFormFieldIds
                    }
                }
            })
            return res.status(200).json({
                success: true,
                data: fieldData ? fieldData : [],
                form_field_id: collectFormFieldIds
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                success: false,
                message: "Something went wrong while processing"
            })
        }
    }
    // get forms data 
    async getFormData(req, res) {
        try {
            const { user_id } = req.params;
            const FormFieldData = await formFieldData();
            const datas = await FormFieldData.findAll({
                where: {
                    user_id: user_id
                }
            })
            return res.status(200).json({
                success: true,
                data: datas ? datas : []
            })
        } catch (error) {
            console.log(error)
        }
    }
    async getAllForms(req, res) {
        try {
            const Forms = await formTemplate();
            const dataForm = await Forms.findAll();
            return res.status(200).json({
                success: true,
                data: dataForm
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error
            })
        }
    }
    // async register platform
    async registerPlatform(req, res) {
        try {
            const { user_id, platform_ids, status, id } = req.body;
            const UserHasPlatform = await userhasplatform();
            if (id) {
                if (!status || !id) {
                    return res.status(400).json({
                        success: false,
                        message: "status or id is being empty please check your input again"
                    })
                }
                const [affectedRows] = await UserHasPlatform.update({
                    status: status
                }, {
                    where: {
                        id: id
                    }
                });
                
                const saveForm = await UserHasPlatform.create({
                    user_id: user_id,
                    platform_ids: platform_ids
                })
                if (saveForm) {
                    return res.status(201).json({
                        success: true,
                        message: "Your platforms registration information is saved successfully"
                    })
                }

                if (affectedRows > 0) {
                    return res.status(201).json({
                        success: true,
                        message: "update register info  for platforms successfully"
                    })
                }
            
            } else {
                if (!platform_ids || !user_id) {
                    return res.status(400).json({
                        success: false,
                        message: "platform_id or user_id is being empty please check your input again"
                    })
                }
                const saveForm = await UserHasPlatform.create({
                    user_id: user_id,
                    platform_ids: platform_ids
                })
                if (saveForm) {
                    return res.status(201).json({
                        success: true,
                        message: "Your platforms registration information is saved successfully"
                    })
                }
            }
        } catch (error) {
            console.log(error)
            return res.status(201).json({
                success: false,
                message: "something went wrong while processing"
            })
        }
    }
    // get platform has been registered by users 
    async getRegisteredPlatform(req, res) {
        const { user_id } = req.params;
        const UserHasPlatform = await userhasplatform();
        let collectUserhasplatfomrIds = null;
        const userhasplatformdata = await UserHasPlatform.findOne({
            where: {
                user_id: user_id,
                status: "on"
            }
        })
        if (userhasplatformdata) {
            collectUserhasplatfomrIds = userhasplatformdata.dataValues.platform_ids;
            const LiveStreamPlatform = await livestreamPlatform();
            const data = await LiveStreamPlatform.findAll({
                where: {
                    id: {
                        [Op.in]: collectUserhasplatfomrIds
                    }
                }
            })
            return res.status(200).json({
                success: true,
                data: data ? data : [],
                user_has_platform_id: userhasplatformdata.dataValues.id
            })
        } else {
            return res.status(200).json({
                success: true,
                data: [],
                user_has_platform_id: null
            })
        }
    }
    async getAllFormsRegister(req, res) {
        try {
            const PlatformRegiter = await platformRegister();
            const Users = await user();

            const forms = await PlatformRegiter.findAll({
                include: [
                    {
                        model: Users,
                    },
                ]
            });

            return res.status(200).json({
                success: true,
                data: forms
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error
            })
        }
    }
}
module.exports = new PlatformController();