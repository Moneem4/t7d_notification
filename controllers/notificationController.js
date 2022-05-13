
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
    const notifications = await notificationModel.find({ "to.profile_id": profileId,"to.seen":true });
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
  let obj={body,consignees,from,link,icon,title,categoryType,notifType}=req.body
  
  try {
    const notification = new notificationModel(obj);
    consignees.forEach(profile => {
      notification.to.push({ profileId: profile });
    })
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
   let obj= {title,icon,link,body,from,consignees,categoryType,notifType}=req.body;
   console.log("registrationTokens :  ",req.body.registrationTokens)
   try {
   const  registrationTokens = req.body.registrationTokens
   //put your server key here
   const serverKey =process.env.SERVER_KEY; 
   let fcm= new FCM(serverKey) 
   const notificationCreated = new notificationModel(obj);
     var message = { 
     //this may vary according to the message type (single recipient, multicast, topic, et cetera)
     registration_ids: registrationTokens, 
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
    console.log("Something has gone wrong!")
    res.status(res.statusCode).send({ message: "error sending notification"});
  } 
  else {
    consignees.forEach(profile => {
      notificationCreated.to.push({ profile_id: profile });
        })
    console.log("Successfully sent with response: ", response)
    if(notificationCreated.to && notificationCreated.to.length > 0)
   {
  const notificationSaved= await notificationCreated.save();   
  res.status(res.statusCode).send({ message: "success",data:notificationSaved});
}  
    
 }
})    
} catch(error) {
  res.status(500).json({
    message: "error",
    data: {
      errorMessage: "Some error occurred ",
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
