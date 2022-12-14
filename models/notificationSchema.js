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
      
    },
    from: {
      type: String,
    },
    tournamentId: {
      type: String,
    },
    to: [{
    profile_id:{
      type: String, 
    },
    seen: {
    type:Boolean,
    default: false

    },
    muted: {
      type: Boolean,
      default: false
    
    },
  }],
    link: {
      type: String, 
    },
    icon: {
      type: String,
    },
    categoryType: {
      type: String,
       enum: ['TOURNAMENT','TEAMS','PROFILE','SUBSCRIPTION','SYSTEM_NOTIF','QUEST']
    },
    notifType: {
       type: String, enum: ['INTERACTIVE','INFO']  
    },
  },     
  { timestamps: true }
);
module.exports = mongoose.model('Notification', notificationSchema)
