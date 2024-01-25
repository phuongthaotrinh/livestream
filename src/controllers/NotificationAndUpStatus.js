const Pusher = require("pusher");
const notification = require("../Models/Notification");
const { Op } = require("sequelize");
const user_has_notification = require("../Models/UserHasNotification");
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
            const Notification = await notification();
            const data = await Notification.findAll({
                where:{
                    user_id:user_id,
                    status:"on"
                }
            })
            return res.status(200).json({
                success:true,
                data:data ? data:[]
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
                         status:notificationId
                    })
                 }else{
                    await UserHasNotification.update({
                        userId:userId,
                        groupId:groupId,
                        notificationId:notificationId,
                        status:notificationId
                   })
                 }
            }));
            if(results){
                return res.status(201).json({
                    success:true,
                    message:"sent successfully"
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
}
module.exports = new NotificationAndUpStatus();