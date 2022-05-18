const express = require('express');
const router = express.Router();
const { sendNotification, findNotificationsByProfileId, findAllSeenNotification, createNotification, updateNotification, deleteNotification, findOneNotification, findAllNotification, muteNotification ,seeNotification } = require('../controllers/notificationController');

// all Notification's routes
//get notification by findNotificationsByProfileId
router.get('/getOneNotification/:id', findOneNotification);
// find notifications related to a profileId
router.get('/findNotificationsByProfileId/:profileId', findNotificationsByProfileId);
//get all seen notifications related to profileId
router.get('/findAllSeenNotification/:profileId', findAllSeenNotification);
//get all notification in databases
router.get('/getAllNotifications', findAllNotification);
//send notification using fcm node with the fcm token of the user
router.post('/sendNotification', sendNotification);
//create a notification
router.post('/createNotification', createNotification);
//update a notification
router.put('/updateNotification/:id', updateNotification);
//delete a notification 
router.delete('/deleteNotification/:id', deleteNotification);
//mute notification by user
router.post('/muteNotification/:profile_id', muteNotification);
//seeing notification by user
router.post('/seeNotification/:profile_id', seeNotification);
module.exports = router;
