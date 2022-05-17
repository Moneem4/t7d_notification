# T7D_Notification
# this is the code source of notification microservice 
# we have five main types of notification : 
-TOURNAMENT
-TEAMS
-PROFILE
-SUBSCRIPTION
-SYSTEM_NOTIF
# we have two types of notification :
-INTERACTIVE
-INFO
# to install packages :
npm i or npm install
# Start project 
npm run dev or nodemon app.js
# List of api with their functionalities :
Main URL : /notification
1-  GET API:
=> getOneNotification/:id  : get notification by id 
=>findNotificationsByProfileId/:profileId :get notification by specific profile  
=>findAllSeenNotification/:profileId :get all notifications seen  by specific profile 
=> getAllNotifications : :get all notifications
2-  POST API:
 => sendNotification :send notification to specific profile using his fcm token and save it in database
    body : {title,icon,link,body,from,consignees,categoryType,notifType}
=> createNotification :create notification and save it in database
2-  PUT API:
=> updateNotification/:id :update a specific notification (id :id of notification)
3-  DELETE API:
=> deleteNotification/:id :delete a specific notification (id :id of notification)
