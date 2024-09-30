// const sgMail = require('@sendgrid/mail');
// //const { default: AsyncQueue } = require('sequelize/types/dialects/mssql/async-queue');

// const SENDGRID_API_KEY = "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";

// const sendMail =async (to, from, subject, text, html) => {
//    // return new Promise((resolve,reject)=>{
//     sgMail.setApiKey(SENDGRID_API_KEY)
//     const msg = {
       
//         to: to,
//         from: from,
//         subject: subject,
//         text: text,
//         html: html

//     }
//     console.log(msg);
//     sgMail
//         .send(msg)
//         .then(() => {
//             console.log('Email sent')
//             count = 1;
//         })
//         .catch((error) => {
//             console.error(error)
//             count = 0;
//         })

//     if (count = 1) {
//         return (true);
//     } else {
//         return (false);
//     }
// //});
// }

// module.exports = {
//     sendMail
// }


const nodemailer = require('nodemailer');




const mail= async(to, subject, text)=>{

  return new Promise(async(resolve, reject)=>{

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'aprmarathon2009@gmail.com',
            pass: 'qflk tytu ipfa raoi'
           // pass: 'nysg yexz iuzg hoed '
        }
    });
    
let mailOptions = {
    from: 'aprmarathon2009@gmail.com',
    to: to,
    subject: subject,
    html: text
//     `<html>
//     <head>
//       <title>Formatted HTML Email</title>
//     </head>
//     <body>
//       <h1>Hello!</h1>
//       <p>This is a formatted HTML email.</p>
//       <p><strong>Important Information:</strong> Please read carefully.</p>
//     </body>
//   </html>`
};



transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
        console.log(error);
        return  reject(error);
       
    } else {

        console.log('Email sent: ' + info.response);
        return resolve(true);
        
    }
});
})
}

module.exports = {
    mail
}