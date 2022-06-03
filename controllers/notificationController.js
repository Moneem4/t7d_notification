
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
    display_error_message(res, error,500);
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
      display_error_message(res, error,500);
    }
  };
  // find  notifications by UserId
exports.findNotificationsByProfileId = async (req, res) => {
  try {
    const {profileId}  = req.verified;
    const notifications = await notificationModel.find({ "to.profile_id": profileId });
    if (!notifications || notifications.length===0) {res.status(res.statusCode).json("notification doesn't exist");}
    else {
      res.status(res.statusCode).send({ message: " Success", data: notifications });
    }
  } catch (error) {
    display_error_message(res, error,500);
  }
 };
// findAllSeenNotification
exports.findAllSeenNotification = async (req, res) => {
  console.log("profileId: " );
  try {
    const {profileId}  = req.verified;
   
    const notifications = await notificationModel.find({ "to.profile_id": profileId,"to.seen":true });
    if (!notifications || notifications.length===0) {res.status(res.statusCode).json("notification doesn't exist");}
    else {
      res.status(res.statusCode).send({ message: "Success", data: notifications });
    }
  } catch (error) {
    display_error_message(res, error,500);
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
    display_error_message(res, error,500);
  }
};
// Send  notification using node-cron 
exports.sendNotification = async (req, res) => {
  // retrieve all the attributes passed it in body 
   let obj= {title,icon,link,body,from,consignees,categoryType,notifType}=req.body;
   let bool =false
   for (consignee of consignees)
   {    
       let notificationsFound= await notificationModel.find(
     { 
        $and: 
        [
          {"to.profile_id": consignee},
       {"from":from},
       {"to.muted": true} 
       ]
    });
  
     
    if (notificationsFound && notificationsFound.length >0) 
    {
    bool=true
    }
  } 
  if(bool===true)
  {res.status(500).json("this type notification was muted by the receiver ");
   return
  }
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
  display_error_message(res, error,500);
  
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
  display_error_message(res, error,500);
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
    display_error_message(res, error,500);
  }
};
// mute notification by user
exports.muteNotification = async (req, res) => {
  const { profileId } = req.verified;
  let { from_id } = req.body;
try {
  const notificationsFound= await notificationModel.find({ "to.profile_id": profileId,"from":from_id });
  if (!notificationsFound || notificationsFound.length ===0) 
  {
  res.status(res.statusCode).json("no notification founded for this profile");
  }

 else { const mutedNotifications = await notificationModel.updateMany({ 
    $and: [
    { "to.profile_id": profileId },
    { from:from_id},
    {"to.muted": false}
]},
{$set:{ "to.$.muted": true  },
});



 if(mutedNotifications.modifiedCount>0) { res.status(res.statusCode).send({ message: "this profile has muted this notification " });} 
 else  res.status(res.statusCode).send({ message: "this profile has already mute this notification " });
 }

} catch (error) {
  display_error_message(res, error,500);
}
};
// see notification by user
exports.seeNotification = async (req, res) => {
    const { profileId } = req.verified;
    let { from_id } = req.body;
  try {
    const notificationsFound= await notificationModel.find({ "to.profile_id": profileId,"from":from_id });
    
    if (!notificationsFound || notificationsFound.length ===0 ) 
    {
    res.status(res.statusCode).json("no notification founded for this profile");
    }
    else
    { 
     const seenNotifications = await notificationModel.updateMany({ 
      $and: [
      { "to.profile_id": profileId },
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
    display_error_message(res, error,500);
  }
};