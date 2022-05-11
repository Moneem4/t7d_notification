const express = require('express');
const router = express.Router();
const {sendNotification,findNotificationsByProfileId,findAllSeenNotification,createNotification,updateNotification,deleteNotification,findOneNotification,findAllNotification} = require('../controllers/notificationController');

// all Notification's routes
router.get('/getOneNotification/:id',findOneNotification);
router.get('/findNotificationsByProfileId/:profileId',findNotificationsByProfileId);
router.get('/findAllSeenNotification/:profileId',findAllSeenNotification);
router.get('/getAllNotifications',findAllNotification);
router.post('/sendNotification',sendNotification);
router.post('/createNotification',createNotification);
router.put('/updateNotification/:id',updateNotification);
router.delete('/deleteNotification/:id',deleteNotification);
module.exports = router;