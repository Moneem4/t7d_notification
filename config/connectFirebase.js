// Import the functions you need from the SDKs you need
const  initializeApp =require ("firebase/app")
const firebase = require('firebase')

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Initialize Firebase
const connectFirebase = () =>
{
    firebase.initializeApp( {
  apiKey: process.env.API_KEY,
  authDomain:process.env.AUTH_DOMAIN ,
  projectId:process.env.PROJECT_ID ,
  storageBucket:process.env.STORAGE_BUCKET ,
  messagingSenderId:process.env.MESSAGE_SENDER_ID,
  appId:process.env.APP_ID ,
  measurementId:process.env.MEASUREMENT_ID
});
}

module.exports = connectFirebase; 
