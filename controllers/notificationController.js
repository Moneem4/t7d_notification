
const notificationModel = require('../models/notificationSchema');
const FCM = require('fcm-node');
 //Notification controller
/*********************************************************************************************/ 
// find all notifications
exports.findAllNotification = async (req, res) => {
  try {
   
    const notifications = await notificationModel.find();
    if (!notifications || notifications.length==0) 
    {res.status(401).json("notifications doesn't exist");}
    else
    {res.status(200).send({ message: "success", data: notificationExist });}
  } catch (error) {
    res.status(500).json({
      message: "Internal server error .",
      error,
    });
 };

}
//find one notification
exports.findOneNotification = async (req, res) => {
    try {
      const { id } = req.params;
      const notificationExist = await notificationModel.findOne({ _id: id });
      if (!notificationExist) res.status(401).json("notification doesn't exist");
      res.status(200).send({ message: "success", data: notificationExist });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error .",
        error,
      });
    }
  };
  // find  notifications by UserId
exports.findNotificationsByProfileId = async (req, res) => {
  try {
    const { profileId } = req.params;
    const notifications = await notificationModel.find({ to: profileId });
    if (!notifications || notifications.length==0) {res.status(401).json("notification doesn't exist");}
    else {
      res.status(200).send({ message: "success", data: notifications });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal server error .",
      error,
    });
  }
 };
// findAllSeenNotification
exports.findAllSeenNotification = async (req, res) => {
  try {
    const { profileId } = req.params;
    const notifications = await notificationModel.find({ to: profileId,seen:true });
    if (!notifications || notifications.length==0) {res.status(401).json("notification doesn't exist");}
    else {
      res.status(200).send({ message: "success", data: notifications });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal server error .",
      error,
    });
  }
 };
//create notification 
exports.createNotification = async (req, res) => {
  let obj={body,to,from,link,icon,title,categoryType,notiftype}=req.body
  
  try {
    const notification = new notificationModel(obj);
    const notificationCreated=   await notification.save();
    res.status(200).send({ message: "success", data: notificationCreated });
  } catch (error) {
    res.status(500).json({
      message: "error",
      data: {
        errorMessage: "Some error occurred while creating notification",
      },
    });
  }
};
// Send  notification using node-cron 
exports.sendNotification = async (req, res) => {
  // retrieve all the attributes passed it in body 
   let obj= {title,icon,link,body,from,to,categoryType,notifType}=req.body;
   
   try {
   const  registrationToken = req.body.registrationToken
   //put your server key here
   const serverKey =process.env.SERVER_KEY; 
   let fcm= new FCM(serverKey) 
   var message = { 
     //this may vary according to the message type (single recipient, multicast, topic, et cetera)
     to: registrationToken, 
     notification: {
         title: req.body.title, 
         body: req.body.body,
         sound:'default',
         "click_action":"FCM_PLUGIN_ACTIVITY",
         "icon":"fcm_push_icon"
     },
 }
 
 fcm.send(message, async function(err, response){
  if (err) {
    return   res.status(400).send("Some error occurred while sending this notification")
  } else {
    const notification = new notificationModel(obj);
    await notification.save();
    return   res.status(200).send({ message:"Notification sent successfully", data: response })
  }
})
} catch(error) {
  res.status(500).json({
    message: "error",
    data: {
      errorMessage: "Some error occurred while creating this notification",
    },
  });
  
}
 };

//Update notification
exports.updateNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notification= req.body
    const n = await notificationModel.findById(id);
    if (!n)
      res.status(404).json({ message: "Failure", data: { errorMessage: "This notification does not exist!" } });
    else {
   
    const updatedNotification = await notificationModel.findByIdAndUpdate(id, notification, { new: true });
    return res.status(200).json({ message: "Success", data: updatedNotification });
  }
 } catch (error) {
    res.status(500).json({
      message: " Internal server error occurred .",
      error,
    });
    console.log(error);
  }
};

// Delete one notification by id
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notificationExist = await notificationModel.findOne({ _id: id });
    if (!notificationExist) res.status(401).json("notification doesn't exist");
    const response = await notificationExist.deleteOne({ _id: id });
    res.status(200).send({ message: "success", data: response });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error .",
      error,
    });
  }
};
