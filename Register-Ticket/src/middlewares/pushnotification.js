
const admin = require('firebase-admin');
const url = require("./lte-notif-firebase-adminsdk-vwtch-a8b0de3116.json");

admin.initializeApp({
    credential: admin.credential.cert(url),
    // databaseURL: 'https://your-project-id.firebaseio.com' // Your Firebase Database URL
});


const notification = async(title, body, token)=>{
return new Promise((resolve,reject)=>{
const message = {
    notification: {
        // title: 'Notif from APR Marathon',
        // body: 'Welcome to APR Marathon',
        title: title,
        body:body,
        
    },
    //token: 'dxOdhaRWMNIJt08IRS6fDd:APA91bGBcr-5EHV4pBFdCV2N0ckFMv7fKI_z54kFEyD4JaWK4-CDrov3Zbh7nI6kftZ8Kku9dtQrlUCBB1En2U-ztGE7o9xG99IT4cvCpFJiYIDo-23NJQ8joU_rSysCqK_BnD4d0U8p', // The token of the device you want to send the notification to
         token: token
};
admin.messaging().send(message)
    .then((response) => {
        console.log('Successfully sent message:', response);
        return resolve(response)
    })
    .catch((error) => {
        console.error('Error sending message:', error);
        return reject(error)
    });
})
}


module.exports = {notification}