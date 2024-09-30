const db = require("../config/dbconfig");
const query = require("../models/communication.model");
const { sequelize } = require("sequelize");
const { QueryTypes } = require("sequelize");
const mail = require("../middlewares/mail");
const pushNotif = require("../middlewares/pushnotification");

//---------------------------------------code added by Rishi---------------------------------
const verifyEmails = async(req,res)=>{

  const { type, emails } = req.body;

  if(type === "corporate-sponsor"){

    const fetch_event_id = await db.sequelize.query(query.getActiveEvent,{typee: QueryTypes.SELECT});
    const event_id = fetch_event_id[0][0]?.event_id;

    if(!event_id){
      return res.status(400).send("Unable to send email due to inactive event");
    }

    const resolveUnregisteredEmails = await Promise.all(emails.map(async (email) => {
      const result = await db.sequelize.query(query.checkCSEmail,{
        replacements: [email, event_id],
        typee: QueryTypes.SELECT
      });

      if(result[0].length === 0){
        return email;
      }
    }));

    const unregisteredEmails = resolveUnregisteredEmails.filter(email => email);

    res.status(200).json({ 
      hasUnRegisteredEmails: unregisteredEmails.length > 0, 
      emailsNotRegistered: unregisteredEmails
    });

  }else{
    
    const resolveUnregisteredEmails = await Promise.all(emails.map(async (email) => {
      const result = await db.sequelize.query(query.checkRegistrantEmail,{
        replacements: [email],
        typee: QueryTypes.SELECT
      });

      console.log(result)
      if(result[0].length === 0){
        return email;
      }
    }));

    const unregisteredEmails = resolveUnregisteredEmails.filter(email => email);

    res.status(200).json({ 
      hasUnRegisteredEmails: unregisteredEmails.length > 0, 
      emailsNotRegistered: unregisteredEmails
    });
    
   
  }
  
}




const getEmails = async(req,res)=>{

  // worked by ram => 09/04/2024
  const { email,category } = req.body
  
  if(category === "corporate-sponsor"){

    const fetch_event_id = await db.sequelize.query(query.getActiveEvent,{typee: QueryTypes.SELECT});
    const event_id = fetch_event_id[0][0]?.event_id;

    if(!event_id){
      return res.status(400).send("No sponsors available due to inactive event");
    }

    const registrant = await db.sequelize.query(query.getCSEmails,{
      replacements: [email+"%",event_id],
      typee: QueryTypes.SELECT
    });

    return res.status(200).json(registrant[0]);
  }else{
    const registrant = await db.sequelize.query(query.getRegistrantEmails,{
      replacements: [email+"%"],
      typee: QueryTypes.SELECT
    });
    res.status(200).json(registrant[0]);
  }

}

// const sendEmail = async (req, res) => {
//   try {
//     const {
//       event_id,
//       notification_type,
//       category,
//       send_to_all,
//       mail_id,
//       subject,
//       message,
//       created_by,
//     } = req.body;
//     if (send_to_all === true) {
//       if(category == "registrant"){
//         const paidRegistrants = await db.sequelize.query(query.paidRegistrants, {
//           replacements: [event_id],
//           typee: QueryTypes.SELECT,
//         });
  
//         console.log(paidRegistrants[0]);
        
//         const mailList = await getRegistrantMAil(paidRegistrants[0]);
//         const corpReg = await db.sequelize.query(query.corpReg , {replacements:[event_id], type:QueryTypes.SELECT});
//         console.log(mailList,corpReg)
//         console.log(mailList.length,corpReg.length)
//         let data = [...mailList, ...corpReg]
//         let count = 0;
//         for (let j = 0; j < data.length; j++) {
//           if(data[j] !== undefined){
//             let obj = {
//               //from: from,
//               to: data[j].email_id,
//               subj: subject,
//               msg: message,
//             };
  
//             let text = "Announcement from ACT!";
//             let html = `<html><head><title>${text}</title></head>
//             <body>${obj.msg}</body></html>`;
//             let mailResponse = await mail.mail(
//               obj.to,
//               obj.subj,
//               html
//             );
  
//             console.log("mailResponse", mailResponse);
  
//             if (mailResponse == true) {
              
//               console.log(notification_type);
  
//               const result = await db.sequelize.query(query.createCommunication, {
//                 replacements: [
//                   notification_type,
//                   subject,
//                   message,
//                   obj.to,
//                   data[j].registrant_id,
//                   event_id,
//                   created_by,
//                 ],
//                 type: QueryTypes.INSERT,
//               });
//               console.log(result);
  
//               if (result[1] === 1) {
//                 count++;
//               } else {
//                 console.log(error);
//               }
//             }
//           }
//           else{
//             count++;
//           }
//           //const from = "laksh0762@gmail.com";
//         }
//         if (count == data.length) {
//           res.status(200).json("Notification created successfully and mail sent");
//         } else {
//           res.status(201).json("something went wrong, mail not sent");
//         }
//       }
//       else{
//         const corpReg = await db.sequelize.query(query.getCorporateMail , {replacements:[event_id], type:QueryTypes.SELECT});
//         console.log(corpReg);
//         let data = corpReg
//         let count = 0;
//         for (let j = 0; j < data.length; j++) {
//           //const from = "laksh0762@gmail.com";
//           let obj = {
//             //from: from,
//             to: data[j].corp_registrant_mailid,
//             subj: subject,
//             msg: message,
//           };
//           let text = "Announcement from ACT!";
//           let html = `<html><head><title>${text}</title></head>
//           <body>${obj.msg}</body></html>`;
//           let mailResponse = await mail.mail(
//             obj.to,
//             obj.subj,
//             html
//           );
//           console.log("mailResponse", mailResponse);
//           if (mailResponse == true) {
//             console.log(notification_type);
//             /*const result = await db.sequelize.query(query.createCommunication, {
//               replacements: [
//                 notification_type,
//                 subject,
//                 message,
//                 obj.to,
//                 data[j].corporate_id,
//                 event_id,
//                 created_by,
//               ],
//               type: QueryTypes.INSERT,
//             });
//             console.log(result);
//             if (result[1] === 1) {
//               count++;
//             } else {
//               console.log(error);
//             }*/
//             count++;
//           }
//         }
//         if (count == data.length) {
//           res.status(200).json("Notification created successfully and mail sent");
//         } else {
//           res.status(201).json("something went wrong, mail not sent");
//         }
//       }
      
//     } 
    
//     else {
//      // const from = "laksh0762@gmail.com";
//      let count = 0;
//      for(i=0;i<mail_id.length;i++){
//       let obj = {
//         to: mail_id[i],
//         subj: subject,
//         msg: message,
//       };
//       let text = "Announcement from ACT!";
//       let html =  `<html><head><title>${text}</title></head>
//       <body>${obj.msg}</body></html>`;
//       let mailResponse = await mail.mail(
//         obj.to,
      
//         obj.subj,
      
//         html
//       );
//       console.log("mailResponse", mailResponse);
//       if (mailResponse == true) {
//         if(category == 'registrant'){
//           console.log(notification_type);
//           const getregistrant_id = await db.sequelize.query(
//             "select registrant_id from registrant_info where email_id =?",
//             { replacements: [obj.to], type: QueryTypes.SELECT });
//           let registrantId =getregistrant_id[0].registrant_id;
          
//           const result = await db.sequelize.query(query.createCommunication, {
//             replacements: [
//               notification_type,
//               subject,
//               message,
//               obj.to,
//               registrantId,
//               event_id,
//               created_by,
//             ],
//             type: QueryTypes.INSERT,
//           });
//           console.log(result);
//           if (result[1] === 1) {
//             count++;
//           }
//         }
//         else{
//           count++;
//         }
//       }
//      }
//      if(count == mail_id.length){
//       res.status(200).json("Notification created successfully and mail sent");
//      }
//      else{
//       res.status(201).json("something went wrong, mail not sent");
//      }
//     }
//   } catch (error) {
//     res
//       .status(400)
//       .json({
//         error_msg: error.message,
//         stack_trace: error.stack,
//         error_obj: error,
//       });
//   }
// };



const sendEmail = async (req, res) => {
  try {
    const {
      notification_type,
      category,
      send_to_all,
      all_type,
      mail_id,
      subject,
      message,
      created_by,
    } = req.body;

    //fetch_event_if added by Rishi->07/02
    // const fetch_event_id = await db.sequelize.query(query.getActiveEvent,{typee: QueryTypes.SELECT});
    // const event_id = fetch_event_id[0][0].event_id;
    let event_id = 0
    let corpReg = []

    if (send_to_all === true) {
      if(category == "registrant"){
        let mailList = []
        if(all_type=="Paid"){
          const fetch_event_id = await db.sequelize.query(query.getActiveEvent,{typee: QueryTypes.SELECT});
          if(fetch_event_id[0][0] != undefined){
            event_id = fetch_event_id[0][0].event_id;
            const Registrants = await db.sequelize.query(query.paidRegistrants, {
              replacements: [event_id],
              typee: QueryTypes.SELECT,
            });
            mailList = await getRegistrantMAil(Registrants[0]);
            corpReg = await db.sequelize.query(query.corpReg , {replacements:[event_id], type:QueryTypes.SELECT});
          }
          else{
            res.status(400).send("Unable to send email due to inactive event");
            return
          }
        }
        else if(all_type=="unPaid"){
          const fetch_event_id = await db.sequelize.query(query.getActiveEvent,{typee: QueryTypes.SELECT});
          if(fetch_event_id[0][0] != undefined){
            event_id = fetch_event_id[0][0].event_id;
            const Registrants = await db.sequelize.query(query.unpaidRegistrants, {
              replacements: [event_id],
              typee: QueryTypes.SELECT,
            });
            const Registrants1 = await db.sequelize.query(query.unpaidRegistrants1, {
              replacements: [event_id],
              typee: QueryTypes.SELECT,
            });
            console.log(Registrants[0]);
            mailList = [...Registrants[0],...Registrants1[0]];
          }
          else{
            res.status(400).send("Unable to send email due to inactive event");
            return
          }
        }
        else{
          const Registrants = await db.sequelize.query(query.allregistrants, {
            typee: QueryTypes.SELECT,
          });
          mailList = Registrants[0];
          corpReg = await db.sequelize.query(query.corpReg , {replacements:[event_id], type:QueryTypes.SELECT});
        }
  
        console.log(mailList);

        let data = [...mailList, ...corpReg]
        let count = 0;
        for (let j = 0; j < data.length; j++) {
          if(data[j] !== undefined){
            let obj = {
              //from: from,
              to: data[j].email_id,
              subj: subject,
              msg: message,
            };
  
            let text = "Announcement from ACT!";
            let html = `<html><head><title>${text}</title></head>
            <body>${obj.msg}</body></html>`;
            let mailResponse = await mail.mail(
              obj.to,
              obj.subj,
              html
            );
  
            console.log("mailResponse", mailResponse);
  
            if (mailResponse == true) {
              
              console.log(notification_type);
  
              const result = await db.sequelize.query(query.createCommunication, {
                replacements: [
                  notification_type,
                  subject,
                  message,
                  obj.to,
                  data[j].registrant_id,
                  event_id,
                  created_by,
                ],
                type: QueryTypes.INSERT,
              });
              console.log(result);
  
              if (result[1] === 1) {
                count++;
              } else {
                console.log(error);
              }
            }
          }
          else{
            count++;
          }
          //const from = "laksh0762@gmail.com";
        }
        if (count == data.length) {
          res.status(200).json("Notification created successfully and mail sent");
        } else {
          res.status(201).json("something went wrong, mail not sent");
        }
      }
      else{
        const fetch_event_id = await db.sequelize.query(query.getActiveEvent,{typee: QueryTypes.SELECT});
        if(fetch_event_id[0][0] != undefined){
          event_id = fetch_event_id[0][0].event_id;
          const corpReg = await db.sequelize.query(query.getCorporateMail , {replacements:[event_id], type:QueryTypes.SELECT});
          console.log(corpReg);
          let data = corpReg
          let count = 0;
          for (let j = 0; j < data.length; j++) {
            //const from = "laksh0762@gmail.com";
            let obj = {
              //from: from,
              to: data[j].corp_registrant_mailid,
              subj: subject,
              msg: message,
            };
            let text = "Announcement from ACT!";
            let html = `<html><head><title>${text}</title></head>
            <body>${obj.msg}</body></html>`;
            let mailResponse = await mail.mail(
              obj.to,
              obj.subj,
              html
            );
            console.log("mailResponse", mailResponse);
            if (mailResponse == true) {
              console.log(notification_type);
              /*const result = await db.sequelize.query(query.createCommunication, {
                replacements: [
                  notification_type,
                  subject,
                  message,
                  obj.to,
                  data[j].corporate_id,
                  event_id,
                  created_by,
                ],
                type: QueryTypes.INSERT,
              });
              console.log(result);
              if (result[1] === 1) {
                count++;
              } else {
                console.log(error);
              }*/
              count++;
            }
          }
          if (count == data.length) {
            res.status(200).json("Notification created successfully and mail sent");
          } else {
            res.status(201).json("something went wrong, mail not sent");
          }
        }
        else{
          res.status(400).send("Unable to send email due to inactive event");
          return
        }
      }
      
    } 
    
    else {
     // const from = "laksh0762@gmail.com";
     let count = 0;
     for(i=0;i<mail_id.length;i++){
      let obj = {
        to: mail_id[i],
        subj: subject,
        msg: message,
      };
      let text = "Announcement from ACT!";
      let html =  `<html><head><title>${text}</title></head>
      <body>${obj.msg}</body></html>`;
      let mailResponse = await mail.mail(
        obj.to,
      
        obj.subj,
      
        html
      );
      console.log("mailResponse", mailResponse);
      if (mailResponse == true) {
        if(category == 'registrant'){
          console.log(notification_type);
          const getregistrant_id = await db.sequelize.query(
            "select registrant_id from registrant_info where email_id =?",
            { replacements: [obj.to], type: QueryTypes.SELECT });
          if(getregistrant_id[0] != undefined){
            let registrantId =getregistrant_id[0].registrant_id;
          
            const result = await db.sequelize.query(query.createCommunication, {
              replacements: [
                notification_type,
                subject,
                message,
                obj.to,
                registrantId,
                event_id,
                created_by,
              ],
              type: QueryTypes.INSERT,
            });
            console.log(result);
            if (result[1] === 1) {
              count++;
            }
          }
          else{
            count++;
          }
        }
        else{
          count++;
        }
      }
     }
     if(count == mail_id.length){
      res.status(200).json("Notification created successfully and mail sent");
     }
     else{
      res.status(201).json("something went wrong, mail not sent");
     }
    }
  } catch (error) {
    res
      .status(400)
      .json({
        error_msg: error.message,
        stack_trace: error.stack,
        error_obj: error,
      });
  }
};
const getRegistrantMAil = async (paidRegistrants) => {
  return new Promise(async (resolve, reject) => {
    let mailList = [];
    if(paidRegistrants.length >0){
    for (let i = 0; i < paidRegistrants.length; i++) {
      const result = await db.sequelize.query(query.getRegistrantMAil, {
        replacements: [paidRegistrants[i].registrant_id_ref],
        type: QueryTypes.SELECT,
      });
      mailList.push(result[0]);
      console.log(mailList);
    }
    if (mailList.length === paidRegistrants.length) {
      return resolve(mailList);
    }
  }else{
    return resolve([])
  }
  });
};
const notifToReg = async(req,res)=>{
  try{
  const {
    event_id,
    notification_type,
    category,
    send_to_all,
    subject,
    message,
    created_by,
  } = req.body;
  let title = subject;
  let body = message;
  if(category =='registrant'){
    //if(send_to_all ==true){
      const paidRegistrants = await db.sequelize.query(query.paidRegistrants, {
        replacements: [event_id],
        typee: QueryTypes.SELECT,
      });
      console.log(paidRegistrants[0]);
      const corpReg = await db.sequelize.query(query.corpReg , {replacements:[event_id], type:QueryTypes.SELECT});
      const regToken = await getRegToken(paidRegistrants[0]);
           let data = [... regToken, ...corpReg]
      let count = 0;
      if(data.length >0){
      for(let i=0; i< data.length; i++){
           let token = data[i].notif_token;
           const sendNotif = await pushNotif.notification(title,body,token);
           if(sendNotif === true){
            const result = await db.sequelize.query(query.createCommunication, {
              replacements: [
                notification_type,
                subject,
                message,
                token,
                data[i].registrant_id,
                event_id,
                created_by,
              ],
              type: QueryTypes.INSERT,
            });
            console.log(result);
            if(result ===1 )
              count++;
           }
      }
             if(count ===data.length){
              res.status(200).json("Notification sent successfully...! ")
             }
            }else{
              res.status(201).json("No registrant info found")
            }
    }else{
      const corpToken = await db.sequelize.query(query.getCorporateMail, {
        replacements: [event_id],
        type: QueryTypes.SELECT,
      });
      if(corpToken.length >0){
      for(let i=0; i< corpToken.length; i++){
        let token = corpToken[i].notif_token;
        const sendNotif = await pushNotif.notification(title,body,token);
        if(sendNotif === true){
         const result = await db.sequelize.query(query.createCommunication, {
           replacements: [
             notification_type,
             subject,
             message,
             token,
            corpToken[i].corp_registrant_id,
             event_id,
             created_by,
           ],
           type: QueryTypes.INSERT,
         });
         console.log(result);
         if(result ===1 )
           count++;
        }
   }
          if(count ===corpToken.length){
           res.status(200).json("Notification sent successfully...! ")
          }
        }else{
          res.status(201).json("There is no registrant info found ")
        }
   }
  } catch (error) {
    res
      .status(400)
      .json({
        error_msg: error.message,
        stack_trace: error.stack,
        error_obj: error,
      });
  }
}
const getRegToken = async (registrant)=>{
  return new Promise(async(resolve,reject)=>{
    let token = [];
       if(registrant.length>0){
        for(let i=0; i< registrant.length; i++){
                const result = await db.sequelize.query(query.getRegistrantMAil, {replacements: [registrant[i].registrant_id_ref], type:QueryTypes.SELECT})
                token.push(result[0]);
                console.log(token);;
              }
              if(registrant.length == token.length){
                return resolve(token)
              }
       }else{
        return resolve([])
       }
  })
};
const notificationForRegistrant = async (req,res)=>{
  try{
  const {event_id, registrant_id}=req.body;
      const notifDetail = await db.sequelize.query(query.notifForReg, {replacements:[event_id, registrant_id], type:QueryTypes.SELECT});
      res.status(200).json(notifDetail)
  } catch (error) {
  res
    .status(400)
    .json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
}
const updateNotifReadStatus = async(req,res) =>{
  try{
  const {data}=req.body;
   console.log("test", data);
  let count=0;
   for(let i=0; i<data.length; i++){
    //let event_id = data[i].event_id;
    let registrant_id =  data[i].registrant_id;
    let notification_id=data[i].notification_id;
   const result = await db.sequelize.query(query.updateNotif, {replacements: [registrant_id, notification_id], type:QueryTypes.UPDATE})
     if(result[1]===1){
      count++;
     }
   }
   if(count == data.length){
    res.status(200).json("notification status updated")
   }
  } catch (error) {
    res
      .status(400)
      .json({
        error_msg: error.message,
        stack_trace: error.stack,
        error_obj: error,
      });
  }
}


const sendNotification = async (req, res) => {
  try {
    const {
      notification_type,
      category,
      subject,
      message,
      created_by,
    } = req.body;

    //fetch_event_if added by Rishi->07/02
    const fetch_event_id = await db.sequelize.query(query.getActiveEvent,{typee: QueryTypes.SELECT});
    const event_id = fetch_event_id[0][0].event_id;

    if(category == "registrant"){
      // const paidRegistrants = await db.sequelize.query(query.paidRegistrants, {
      //   replacements: [event_id],
      //   typee: QueryTypes.SELECT,
      // });
      // const mailList = await getRegistrantMAil(paidRegistrants[0]);

      /********************************************* commented by ramanan *******************************************************/

      // let mailList = []
      // if(all_type=="Paid"){
      //   const Registrants = await db.sequelize.query(query.paidRegistrants, {
      //     replacements: [event_id],
      //     typee: QueryTypes.SELECT,
      //   });
      //   mailList = await getRegistrantMAil(Registrants[0]);
      // }
      // else if(all_type=="unPaid"){
      //   const Registrants = await db.sequelize.query(query.unpaidRegistrants, {
      //     replacements: [event_id],
      //     typee: QueryTypes.SELECT,
      //   });
      //   const Registrants1 = await db.sequelize.query(query.unpaidRegistrants1, {
      //     replacements: [event_id],
      //     typee: QueryTypes.SELECT,
      //   });
      //   console.log(Registrants[0]);
      //   mailList = [...Registrants[0],...Registrants1[0]];
      // }
      // else{
      //   const Registrants = await db.sequelize.query(query.allregistrants, {
      //     replacements: [event_id],
      //     typee: QueryTypes.SELECT,
      //   });
      //   mailList = Registrants[0];
      // }

      const [ mailList ] = await db.sequelize.query(query.allregistrants, {
        replacements: [event_id],
        typee: QueryTypes.SELECT,
      });
      const corpReg = await db.sequelize.query(query.corpReg , {replacements:[event_id], type:QueryTypes.SELECT});
      let data = [...mailList, ...corpReg]
      let count = 0;

      if(notification_type === "mail"){
        for (let j = 0; j < data.length; j++) {
          if(data[j] !== undefined){
            console.log("hello")
            if(true){
              const notifResponse = await pushNotif.notification(subject,message,data[j].notif_token)
              console.log("mailResponse", notifResponse);
              if (notifResponse == true) {
                console.log(notification_type);
                const result = await db.sequelize.query(query.createCommunication, {
                  replacements: [
                    notification_type,
                    subject,
                    message,
                    obj.to,
                    data[j].registrant_id,
                    event_id,
                    created_by,
                  ],
                  type: QueryTypes.INSERT,
                });
                console.log(result);
                if (result[1] === 1) {
                  count++;
                } else {
                  console.log(error);
                }
              }
            }
            else{
              count++;
            }
          }
          else{
            count++;
          }
          //const from = "laksh0762@gmail.com";
        }
      }else{
        const notifResponse = await pushNotif.notification(subject,message)
        console.log("Notification Response", notifResponse);
        if (notifResponse == true) {
          console.log(notification_type);
          const result = await db.sequelize.query(query.createCommunication, {
            replacements: [
              notification_type,
              subject,
              message,
              obj.to,
              data[j].registrant_id,
              event_id,
              created_by,
            ],
            type: QueryTypes.INSERT,
          });
          console.log(result);
          if (result[1] === 1) {
            count++;
          } else {
            console.log(error);
          }
        }
      }
      
      if (count == data.length || notification_type === "notification") {
        res.status(200).json("Notification created successfully and mail sent");
      } else {
        res.status(201).json("something went wrong, mail not sent");
      }
    }
    else{
      const corpReg = await db.sequelize.query(query.getCorporateMail , {replacements:[event_id], type:QueryTypes.SELECT});
      console.log(corpReg);
      let data = corpReg
      let count = 0;
      for (let j = 0; j < data.length; j++) {
        if(data[j].corp_notif_token != null && data[j].corp_notif_token != ''){
          const notifResponse = await pushNotif.notification(subject,message,data[j].corp_notif_token)
          console.log("notifResponse", notifResponse);
          if (notifResponse == true) {
            console.log(notification_type);
            /*const result = await db.sequelize.query(query.createCommunication, {
              replacements: [
                notification_type,
                subject,
                message,
                obj.to,
                data[j].corporate_id,
                event_id,
                created_by,
              ],
              type: QueryTypes.INSERT,
            });
            console.log(result);
            if (result[1] === 1) {
              count++;
            } else {
              console.log(error);
            }*/
            count++;
          }
        }
        else{
          count++;
        }
        //const from = "laksh0762@gmail.com";
      }
      if (count == data.length) {
        res.status(200).json("Notification created successfully and mail sent");
      } else {
        res.status(201).json("something went wrong, mail not sent");
      }
    }
  } catch (error) {
    res
      .status(400)
      .json({
        error_msg: error.message,
        stack_trace: error.stack,
        error_obj: error,
      });
  }
};
module.exports = {
  verifyEmails,
  sendEmail,
  notifToReg,
  notificationForRegistrant,
  updateNotifReadStatus,
  getEmails,
  sendNotification
};



//---------------------------------------------commented by suganthi---------------------------
// const db = require("../config/dbconfig");
// const query = require("../models/communication.model");
// const { sequelize } = require("sequelize");
// const { QueryTypes } = require("sequelize");
// const mail = require("../middlewares/mail");
// const pushNotif = require("../middlewares/pushnotification");

// const mailToRegistrant = async (req, res) => {
//   try {
//     const {
//       event_id,
//       notification_type,
//       category,
//       send_to_all,
//       mail_id,
//       subject,
//       message,
//       created_by,
//     } = req.body;

//     if (send_to_all === true) {
//       const paidRegistrants = await db.sequelize.query(query.paidRegistrants, {
//         replacements: [event_id],
//         typee: QueryTypes.SELECT,
//       });

//       console.log(paidRegistrants[0]);
//       const mailList = await getRegistrantMAil(paidRegistrants[0]);
//       const corpReg = await db.sequelize.query(query.corpReg , {replacements:[event_id], type:QueryTypes.SELECT});


//       let data =[...mailList, ...corpReg]
//       let count = 0;
//       for (let j = 0; j < data.length; j++) {
//         const from = "laksh0762@gmail.com";
//         let obj = {
//           from: from,
//           to: data[j].email_id,
//           subj: subject,
//           msg: message,
//         };

//         let text = "Announcement from ACT!";
//         let html = `<html><head><title>${text}</title></head>
//         <body>${obj.msg}</body></html>`;
//         let mailResponse = await mail.mail(
//           obj.to,
//           obj.subj,
//           html
//         );
//         console.log("mailResponse", mailResponse);
//         if (mailResponse == true) {
//           console.log(notification_type);

//           const result = await db.sequelize.query(query.createCommunication, {
//             replacements: [
//               notification_type,
//               subject,
//               message,
//               obj.to,
//               data[j].registrant_id,
//               event_id,
//               created_by,
//             ],
//             type: QueryTypes.INSERT,
//           });
//           console.log(result);

//           if (result[1] === 1) {
//             count++;
//           } else {
//             console.log(error);
//           }
//         }
//       }
//       if (count == data.length) {
//         res.status(200).json("Notification created successfully and mail sent");
//       } else {
//         res.status(201).json("something went wrong, mail not sent");
//       }
//     } else {
//      // const from = "laksh0762@gmail.com";
//       let obj = {
      
//         to: mail_id,
//         subj: subject,
//         msg: message,
//       };

//       let text = "Announcement from ACT!";
//       let html =  `<html><head><title>${text}</title></head>
//       <body>${obj.msg}</body></html>`;
//       let mailResponse = await mail.mail(
//         obj.to,
      
//         obj.subj,
      
//         html
//       );
//       console.log("mailResponse", mailResponse);
//       if (mailResponse == true) {
//         console.log(notification_type);
//         const getregistrant_id = await db.sequelize.query(
//           "select registrant_id from registrant_info where email_id =?",
//           { replacements: [obj.to], type: QueryTypes.SELECT });

//         let registrantId =getregistrant_id[0].registrant_id;
         
//         const result = await db.sequelize.query(query.createCommunication, {
//           replacements: [
//             notification_type,
//             subject,
//             message,
//             obj.to,
//             registrantId,
//             event_id,
//             created_by,
//           ],
//           type: QueryTypes.INSERT,
//         });
//         console.log(result);

//         if (result[1] === 1) {
//             res.status(200).json("Notification created successfully and mail sent");
//         } else {
//             res.status(201).json("something went wrong, mail not sent");
//         }
//       }

    
//     }
//   } catch (error) {
//     res
//       .status(400)
//       .json({
//         error_msg: error.message,
//         stack_trace: error.stack,
//         error_obj: error,
//       });
//   }
// };

// const getRegistrantMAil = async (paidRegistrants) => {
//   return new Promise(async (resolve, reject) => {
//     let mailList = [];
//     if(paidRegistrants.length >0){
//     for (let i = 0; i < paidRegistrants.length; i++) {
//       const result = await db.sequelize.query(query.getRegistrantMAil, {
//         replacements: [paidRegistrants[i].registrant_id_ref],
//         type: QueryTypes.SELECT,
//       });
//       mailList.push(result[0]);
//       console.log(mailList);
//     }
//     if (mailList.length === paidRegistrants.length) {
//       return resolve(mailList);
//     }
//   }else{
//     return resolve([])
//   }
//   });
// };



// const mailToCorporate = async (req, res) => {
//   try {
//     const {
//       event_id,
//       notification_type,
//       category,
//       subject,
//       message,
//       created_by,
//     } = req.body;

//     const mailList = await db.sequelize.query(query.getCorporateMail, {
//       replacements: [event_id],
//       type: QueryTypes.SELECT,
//     });
//     //const mailList = await getRegistrantMAil(paidRegistrants[0]);

//     let count = 0;
//     for (let j = 0; j < mailList.length; j++) {
//       const from = "laksh0762@gmail.com";
//       let obj = {
//         from: from,
//         to: mailList[j].corp_registrant_mailid,
//         subj: subject,
//         msg: message,
//       };

//       let text = "Announcement from ACT!";
//       let html =  `<html><head><title>${text}</title></head>
//       <body>${obj.msg}</body></html>`;
//       let mailResponse = await mail.mail(
//         obj.to,
//        // obj.from,
//         obj.subj,
//        // text,
//         html
//       );
//       console.log("mailResponse", mailResponse);
//       if (mailResponse == true) {
//         console.log(notification_type);

//         const result = await db.sequelize.query(query.createCommunication, {
//           replacements: [
//             notification_type,
//             subject,
//             message,
//             obj.to,
//             mailList[j].corp_registrant_id,
//             event_id,
//             created_by,
//           ],
//           type: QueryTypes.INSERT,
//         });
//         console.log(result);

//         if (result[1] === 1) {
//           count++;
//         } else {
//           console.log(error);
//         }
//       }
//     }
//     if (count == mailList.length) {
//       res.status(200).json("Notification created successfully and mail sent");
//     } else {
//       res.status(201).json("something went wrong, mail not sent");
//     }
//   } catch (error) {
//     res
//       .status(400)
//       .json({
//         error_msg: error.message,
//         stack_trace: error.stack,
//         error_obj: error,
//       });
//   }
// };

// const notifToReg = async(req,res)=>{
//   try{
//   const {
//     event_id,
//     notification_type,
//     category,
//     send_to_all,
//     subject,
//     message,
//     created_by,
//   } = req.body;


//   let title = subject;
//   let body = message;
   
//   if(category =='registrant'){

//     //if(send_to_all ==true){

//       const paidRegistrants = await db.sequelize.query(query.paidRegistrants, {
//         replacements: [event_id],
//         typee: QueryTypes.SELECT,
//       });
//       console.log(paidRegistrants[0]);  
       
//       const corpReg = await db.sequelize.query(query.corpReg , {replacements:[event_id], type:QueryTypes.SELECT});

//       const regToken = await getRegToken(paidRegistrants[0]);
//            let data = [... regToken, ...corpReg] 
//       let count = 0;

//       if(data.length >0){
//       for(let i=0; i< data.length; i++){
              
//            let token = data[i].notif_token;

//            const sendNotif = await pushNotif.notification(title,body,token);

//            if(sendNotif === true){
//             const result = await db.sequelize.query(query.createCommunication, {
//               replacements: [
//                 notification_type,
//                 subject,
//                 message,
//                 token,
//                 data[i].registrant_id,
//                 event_id,
//                 created_by,
//               ],
//               type: QueryTypes.INSERT,
//             });
//             console.log(result);
//             if(result ===1 )
//               count++;
//            }

           
//       }
//              if(count ===data.length){
//               res.status(200).json("Notification sent successfully...! ")
//              }
//             }else{
//               res.status(201).json("No registrant info found")
//             }
//     }else{
//       const corpToken = await db.sequelize.query(query.getCorporateMail, {
//         replacements: [event_id],
//         type: QueryTypes.SELECT,
//       });  
      
//       if(corpToken.length >0){
//       for(let i=0; i< corpToken.length; i++){
              
//         let token = corpToken[i].notif_token;

//         const sendNotif = await pushNotif.notification(title,body,token);

//         if(sendNotif === true){
//          const result = await db.sequelize.query(query.createCommunication, {
//            replacements: [
//              notification_type,
//              subject,
//              message,
//              token,
//             corpToken[i].corp_registrant_id,
//              event_id,
//              created_by,
//            ],
//            type: QueryTypes.INSERT,
//          });
//          console.log(result);
//          if(result ===1 )
//            count++;
//         }

        
//    }
//           if(count ===corpToken.length){
//            res.status(200).json("Notification sent successfully...! ")
//           }
//         }else{
//           res.status(201).json("There is no registrant info found ")
//         }
//    }
   
//   } catch (error) {
//     res
//       .status(400)
//       .json({
//         error_msg: error.message,
//         stack_trace: error.stack,
//         error_obj: error,
//       });
//   }
// }

// const getRegToken = async (registrant)=>{
//   return new Promise(async(resolve,reject)=>{

//     let token = [];
//        if(registrant.length>0){
    
//         for(let i=0; i< registrant.length; i++){
//                 const result = await db.sequelize.query(query.getRegistrantMAil, {replacements: [registrant[i].registrant_id_ref], type:QueryTypes.SELECT})
       
//                 token.push(result[0]);
//                 console.log(token);;

//               }
          
//               if(registrant.length == token.length){
//                 return resolve(token)
//               }
//        }else{
//         return resolve([])
//        }
//   })
// };

// const notificationForRegistrant = async (req,res)=>{
//        try{
//         const {event_id, registrant_id}=req.body;


//             const notifDetail = await db.sequelize.query(query.notifForReg, {replacements:[event_id, registrant_id], type:QueryTypes.SELECT});

//             res.status(200).json(notifDetail)
     
// } catch (error) {
//   res
//     .status(400)
//     .json({
//       error_msg: error.message,
//       stack_trace: error.stack,
//       error_obj: error,
//     });
// }
// }

// const updateNotifReadStatus = async(req,res) =>{
//   try{
//   const {data}=req.body;
//    console.log("test", data);
//   let count=0;

//    for(let i=0; i<data.length; i++){

//     //let event_id = data[i].event_id;
//     let registrant_id =  data[i].registrant_id;
//     let notification_id=data[i].notification_id;

//    const result = await db.sequelize.query(query.updateNotif, {replacements: [registrant_id, notification_id], type:QueryTypes.UPDATE})

//      if(result[1]===1){
//       count++;
//      }

//    }

//    if(count == data.length){
//     res.status(200).json("notification status updated")
//    }
//   } catch (error) {
//     res
//       .status(400)
//       .json({
//         error_msg: error.message,
//         stack_trace: error.stack,
//         error_obj: error,
//       });
//   }

// }

// module.exports = {
//   mailToRegistrant,
//   mailToCorporate,
//   notifToReg,
//   notificationForRegistrant,
//   updateNotifReadStatus
// };
