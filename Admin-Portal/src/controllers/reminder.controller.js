const db = require("../config/dbconfig");
const query = require("../models/reminder.model");
const { sequelize } = require("sequelize");
const { QueryTypes } = require("sequelize");
const query1 = require("../models/adminconfiguration.model");
const query2 = require("../models/communication.model");
const notif = require("../models/communication.model");
const mail = require("../middlewares/mail");

const cron = require('node-cron');

const scheduleReminder = async (req, res) => {
  try {
    const { subject, message, year, month, date, hour, minute, created_by } =
      req.body;

    const eventInfo = await db.sequelize.query(query1.activeEvent, {
      type: QueryTypes.SELECT,
    });

    // Define cron jobs for the specified times
    const notifTimes = [
      { date: date, hour: hour, minute: minute, month: month },
    ];

    const notification_type = "reminder-notification";
    //save reminder time to database
    const saveDateinDb = await db.sequelize.query(query.addReminder, {
      replacements: [
        subject,
        message,
        month,
        date,
        hour,
        minute,
        year,
        created_by,
      ],
    });
    console.log(saveDateinDb);

    notifTimes.forEach((time) => {
      const cronExpression = `${time.minute} ${time.hour} ${time.date} ${time.month} *`; // Minute Hour Day Month DayOfWeek

      console.log(cronExpression);

      cron.schedule(cronExpression, async () => {
        try {
        

          //get paid registrant
          const paidRegistrant = await db.sequelize.query(query.paidReg, {replacements:[eventInfo[0].event_id], type:QueryTypes.SELECT}) 
          
          

          let count=0;
          
          for(let i=0; i< paidRegistrant.length; i++){

// get registrant notif token
            const regInfo = await db.sequelize.query(query.getReg, {replacements:[ paidRegistrant[i].registrant_id_ref], type:QueryTypes.SELECT})
          
            const result = await db.sequelize.query(query2.createCommunication, {
            replacements: [
              notification_type,
              subject,
              message,
              "registrant",
               paidRegistrant[i].registrant_id_ref,
              eventInfo[0].event_id,
              created_by,
            ],
            type: QueryTypes.INSERT,
          });

           
           
          //push notification 
           //push notification

    // let title = subject;
    // let body =  message;
    // let token = regInfo[0].notif_token;
    // const sendNotif = await pushNotif.notification(title,body,token);
console.log("line85 :", regInfo[0]);

          if(result[1]===1){
           // const from = "laksh0762@gmail.com";
            let obj = {
              //from: from,
              to: regInfo[0].email_id ,
              subj: subject,
              msg: message,
            };
      
            let text = "Announcement from ACT!";
            let html =  `<html><head><title>${text}</title></head>
            <body>${obj.msg}</body></html>`;
            let mailResponse = await mail.mail(
              obj.to,
             // obj.from,
              obj.subj,
              //text,
              html
            );
            console.log("mailResponse", mailResponse);
            if (mailResponse == true) {
            count++;
          }
        }
         
       } } catch (error) {
          console.log(error);
         }
       });

   
    });
    res.status(200).json("Reminder scheduled successfully");
  } catch (error) {
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
};

module.exports = { scheduleReminder };
