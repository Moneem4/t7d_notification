const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//Model notification
//commit test
const notificationSchema = new Schema(
  {
    title: {
      type: String,
      
    },
    body: {
      type: String,
      required: false,
    },
    from: {
      type: String,
      required: false,

    },
    to: {
      type: String,
      required: false,
    
    },
    link: {
      type: String,
      required: false,
    
    },
    icon: {
      type: String,
      required: false,
  
    },
  
    seen: {
      type: Boolean,
      default: false
    
    },
    muted: {
      type: Boolean,
      default: false
    
    },
    categoryType: {
      type: String,
       enum: ["TOURNAMENT","TEAMS","PROFILE","SUBSCRIPTION","SYSTEM_NOTIF"]
    },
    notifType: {
       type: String, enum: ["INTERACTIVE", "INFO"]  
      },
  },
     
     { timestamps: true }
);
module.exports = mongoose.model('Notification', notificationSchema)