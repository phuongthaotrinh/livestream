const Pusher = require("pusher");
const notification = require("../Models/Notification");
const { Op } = require("sequelize");
const user_has_notification = require("../Models/UserHasNotification");
const user = require("../Models/User");
const groups = require("../Models/Group");
class NotificationAndUpStatus{
     async addNewNotification(req,res){
        try {
            const{title,message,user_id,group_id,status} = req.body;
            const Notification = await notification();
            const checkBefore = await Notification.findOne({
                where:{
                    title:title,
                    message:message,
                    user_id:user_id,
                    group_id:group_id,
                    status:status
                }
            })
            if(checkBefore){
                const [affectedRows] = await Notification.update({
                    title:title,
                    message:message,
                    user_id:user_id,
                    group_id:group_id,
                    status:status
                })
                if(affectedRows > 0){
                    return res.status(201).json({
                        success:true,
                        message:"updated successfully"
                    })
                }
            }
            const save = await Notification.create({
                title:title,
                message:message,
                user_id:user_id,
                group_id:group_id,
                status:status
            });
            if(save){
                return res.status(201).json({
                    success:true,
                    message:"created successfully"
                })
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                success:false,
                message:"something went wrong"
            })
        }
     }
     // get all notification
     async getAllNotification(req,res){
          try {
            const {user_id} = req.params;
            const Users = await user();
            const Groups = await groups()
            const Notification = await notification();
            const data = await Notification.findAll({
        
                include: [
                    {
                        model: Users,
                    },
                    {
                        model: Groups,
                    },
                ],
            });
            const users_data = await Users.findAll();
            const group_data = await  Groups.findAll()
            return res.status(200).json({
                success:true,
                data:data ? data:[],
                users:users_data,
                groups:group_data
                
            })
          } catch (error) {
            console.log(error)
            return res.status(500).json({
                success:false,
                data:[]
            })
          }
     }
     // send notification to group member 
    async sendNotification(req,res){
        try {
            const {userIds,groupId,status,notificationId} = req.body;
            const Notifications = await notification()
            const UserHasNotification = await user_has_notification();
            const results = await Promise.all(userIds.map(async (userId) => {
                const checkBefore = await UserHasNotification.findOne({ 
                    where:{
                        userId:userId,
                        groupId:groupId,
                        notificationId:notificationId,
                        status:status
                    }
                 });
                 if(!checkBefore){
                   await UserHasNotification.create({
                         userId:userId,
                         groupId:groupId,
                         notificationId:notificationId,
                         status:status
                    })
                 }else{
                    await UserHasNotification.update({
                        userId:userId,
                        groupId:groupId,
                        notificationId:notificationId,
                        status:status
                   })
                 }
            }));

            if(results){
                    const updateStt = await Notifications.update({
                        status: "send"
                    },{
                        where :{
                            id: notificationId
                        }
                    });

                    if(updateStt > 0) {
                        return res.status(201).json({
                            success:true,
                            message:"sent successfully"
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
    // get user notification 
    async getNotification(req,res){
        try {
            const {user_id} = req.params;
            const Notification = await notification();
            let fetchAllNotification = [];
            const UserHasNotification = await user_has_notification();
            const fetchUserNotification = await UserHasNotification.findAll({
                where:{
                    userId:user_id,
                }
            })
            const collectNotificationId = [];
            fetchUserNotification.map((v)=>{
                collectNotificationId.push(v.notificationId)
            })
            if(collectNotificationId.length < 1){
                fetchAllNotification = []
            }
             fetchAllNotification = await Notification.findAll({
                where:{
                    id:collectNotificationId,
                    status:"on"
                }
            })
            const pusher = new Pusher({
                appId: "1746567",
                key: "8096f904b598c4cb5b50",
                secret: "d31c1dc3e1e1f399db43",
                cluster: "ap1",
                useTLS: true
              });
              
              pusher.trigger("push-notification-channel", "push-notification-event", {
                message:fetchAllNotification ? fetchAllNotification:[]
              });
            return res.status(200).json({
                success:true,
            })
        } catch (error) {
             console.log(error)
        }
    }

    async getUserNotif(req, res) {
        const { user_id } = req.params;
        const UserHasNotif = await user_has_notification();
        const Notification = await notification()
        const Users = await user();
        const Groups = await groups();

        const data = await UserHasNotif.findAll({
            include: [
                {
                    model: Notification,
                },
                {
                    model: Users,
                    attributes: ['id', 'email', 'images', 'name']
                },
                {
                    model: Groups,
                    attributes: ['id', 'name'],
                    include: {
                        model: Users,
                        attributes: ['id', 'email', 'images', 'name'],
                    },
                },
            ],
            where: {
                userId: user_id,
            },
        });

        return res.status(201).json({
            data: data,
        });
    }

    async triggerStatusNotif (req, res) {
       try {
           const UserHasNotif = await user_has_notification()
          const {id} = req.params;
          const exist = await UserHasNotif.findOne({id: id});
          if(!exist) return res.status(400).json({message: "Not found Object"});
          await UserHasNotif.update({ status: "read" }, {
              where: {
                  id: id,
              },
          })
           return res.status(201).json({message: "Update status success"})
       }  catch (e) {
            throw  e
       }
    }

}
module.exports = new NotificationAndUpStatus();