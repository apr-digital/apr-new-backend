
const admin = require('firebase-admin');
const url = require("./serviceaccount.json");

admin.initializeApp({
    credential: admin.credential.cert(url),
    // databaseURL: 'https://your-project-id.firebaseio.com' // Your Firebase Database URL
});


const notification = async(title, body)=>{
    return new Promise((resolve,reject)=>{
        const message = {
            notification: {
                title,
                body
            },
            topic: "all"
        };
        admin.messaging().send(message)
            .then((response) => {
                console.log('Successfully sent message:', response);
                return resolve(response)
            })
            .catch((error) => {
                console.error('Error sending message:', error);
                return reject(error)
            }
        );
    })
}


module.exports = {notification}