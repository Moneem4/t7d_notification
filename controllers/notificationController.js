
const notificationModel = require('../models/notificationSchema');
const FCM = require('fcm-node');
 //Notification controller
/*********************************************************************************************/ 
// find all notifications
exports.findAllNotification = async (req, res) => {
  try {
   
    const notifications = await notificationModel.find();
    if (!notifications || notifications.length===0) 
    {res.status(res.statusCode).json("notifications doesn't exist");}
    else
    {res.status(res.statusCode).send({ message: "success", data: notifications });}
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
      if (!notificationExist) res.status(res.statusCode).json("notification doesn't exist");
      res.status(res.statusCode).send({ message: "success", data: notificationExist });
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
    const notifications = await notificationModel.find({ "to.profile_id": profileId });
    if (!notifications || notifications.length===0) {res.status(res.statusCode).json("notification doesn't exist");}
    else {
      res.status(res.statusCode).send({ message: "get notifications successfully", data: notifications });
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
    if (!notifications || notifications.length===0) {res.status(res.statusCode).json("notification doesn't exist");}
    else {
      res.status(res.statusCode).send({ message: "find All Seen Notification successfully", data: notifications });
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
    res.status(res.statusCode).send({ message: "success", data: notificationCreated });
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
  res.status(res.statusCode).send({ message: "success",data:{response,notificationSaved}});
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
      res.status(res.statusCode).json({ message: "Failure", data: { errorMessage: "This notification does not exist!" } });
    else {
   
    const updatedNotification = await notificationModel.findByIdAndUpdate(id, notification, { new: true });
    return res.status(res.statusCode).json({ message: "Success", data: updatedNotification });
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
    if (!notificationExist) res.status(res.statusCode).json("no notification with this id was found");
    const response = await notificationExist.deleteOne({ _id: id });
    res.status(res.statusCode).send({ message: "success", data: response });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error .",
      error,
    });
  }
};
// mute notification by user
exports.muteNotification = async (req, res) => {
  const { profile_id } = req.params;
  let { from_id } = req.body;
try {
  const notificationsFound= await notificationModel.find({ "to.profile_id": profile_id,"from":from_id });
  if (!notificationsFound || notificationsFound.length ===0) 
  {
  res.status(res.statusCode).json("no notification founded for this profile");
  }

 else { const mutedNotifications = await notificationModel.updateMany({ 
    $and: [
    { "to.profile_id": profile_id },
    { from:from_id},
    {"to.muted": false}
]},
{$set:{ "to.$.muted": true  },
});



 if(mutedNotifications.modifiedCount>0) { res.status(res.statusCode).send({ message: "this profile has muted this notification " });} 
 else  res.status(res.statusCode).send({ message: "this profile has already mute this notification " });
 }

} catch (error) {
  console.log(error),
  res.status(500).json({
    message: "Internal server error .",
    error,
  });
}
};
// see notification by user
exports.seeNotification = async (req, res) => {
    const { profile_id } = req.params;
    let { from_id } = req.body;
  try {
    const notificationsFound= await notificationModel.find({ "to.profile_id": profile_id,"from":from_id });
    
    if (!notificationsFound || notificationsFound.length ===0 ) 
    {
    res.status(res.statusCode).json("no notification founded for this profile");
    }
    else
    { 
     const seenNotifications = await notificationModel.updateMany({ 
      $and: [
      { "to.profile_id": profile_id },
      { from:from_id},
        {"to.seen" :false}
  ]},
  {$set:{ "to.$.seen": true  },
});
   if(seenNotifications.modifiedCount>0) 
   {
    res.status(res.statusCode).send({ message: "this profile's account  see this notification with success " });
   } 
    else  
    res.status(res.statusCode).send({ message: "this profile has already see this notification " });
  }
  } catch (error) {
    console.log(error),
    res.status(500).json({
      message: "Internal server error .",
      error,
    });
  }
};