const paidRegistrants= "SELECT registrant_id_ref FROM order_info WHERE event_id_ref=? AND order_status='success' ";
const getRegistrantMAil = "SELECT registrant_id, email_id, notif_token FROM registrant_info WHERE registrant_id =? and email_id NOTNULL";
const createCommunication = "INSERT INTO notification_info (notification_type,subject, message, email_id, registrant_id_ref,event_id_ref, read_status,created_by )"+
                      "VALUES (?,?,?,?,?,?,'unread',?)";
const getCorporateMail = "SELECT corporate_id, corp_registrant_mailid, corp_notif_token FROM corporate_sponsor_info WHERE event_id_ref=?";
const regToken = "select registrant_id, notif_token from registrant_info where registrant_id=?";
//Code edited by Rishi
const corpReg = "select distinct ri.registrant_id,ri.email_id, ri.notif_token from registrant_info ri left join runner_info ru on ri.registrant_id = ru.registrant_id_ref where ri.email_id NOTNULL and ru.role ='corporate runner' "
const checkPaidReg= "SELECT registrant_id_ref FROM order_info WHERE event_id_ref=? AND order_status='success'  AND registrant_id_ref=?";
const reminderNotifForReg = "select * from notification_info where notification_type = 'reminder-notification' and event_id_ref=? order by created_at desc";
const getActiveReg="select * from registrant_info where registrant_status='active' and registrant_id =?";
const notifForReg = "select * from notification_info where event_id_ref=? and registrant_id_ref=? and read_status='unread'";
const updateNotif = "update  notification_info set read_status ='read'  where registrant_id_ref=? and notification_id=? ";
const getRegistrantEmails = "select email_id from registrant_info where email_id like ?";
const getCSEmails = "select corp_registrant_mailid from corporate_sponsor_info where corp_registrant_mailid like ? and event_id_ref=?";
const checkRegistrantEmail = "select email_id from registrant_info where email_id=?";
const checkCSEmail = "select corp_registrant_mailid from corporate_sponsor_info where corp_registrant_mailid = ? and event_id_ref=?";
const unpaidRegistrants= "select ri.registrant_id, ri.email_id, ri.notif_token from registrant_info ri left join order_info oi on ri.registrant_id = oi.registrant_id_ref where oi.order_status != 'success' and oi.event_id_ref=? and ri.email_id NOTNULL";
const unpaidRegistrants1= "SELECT ri.registrant_id, ri.email_id, ri.notif_token FROM registrant_info ri LEFT JOIN order_info oi ON ri.registrant_id = oi.registrant_id_ref AND oi.event_id_ref = ? WHERE oi.registrant_id_ref IS NULL and ri.email_id notnull"
const allregistrants = "SELECT registrant_id, email_id, notif_token FROM registrant_info";
const getActiveEvent = "SELECT event_id from event_info where event_status='active'";
module.exports={
    updateNotif,
    getActiveReg,
    paidRegistrants,
    getRegistrantMAil,
    createCommunication,
    getCorporateMail,
    checkPaidReg,
    regToken,
    corpReg,
    reminderNotifForReg,
    notifForReg,
    getRegistrantEmails,
    getCSEmails,
    checkRegistrantEmail,
    checkCSEmail,
    unpaidRegistrants,
    unpaidRegistrants1,
    allregistrants,
    getActiveEvent
}
//=====================commented by suganthi---------------------------------------------------------------------------
// const paidRegistrants= "SELECT registrant_id_ref FROM order_info WHERE event_id_ref=? AND order_status='success' ";
// const getRegistrantMAil = "SELECT registrant_id, email_id, notif_token FROM registrant_info WHERE registrant_id =?";
// const createCommunication = "INSERT INTO notification_info (notification_type,subject, message, email_id, registrant_id_ref,event_id_ref, read_status,created_by )"+ 
//                       "VALUES (?,?,?,?,?,?,'unread',?)";
// const getCorporateMail = "SELECT corp_registrant_id, corp_registrant_mailid, notif_token FROM corporate_info WHERE event_id_ref=?";                      
        
// const regToken = "select registrant_id, notif_token from registrant_info where registrant_id=?";
// const corpReg = "select registrant_id,email_id, notif_token from registrant_info where event_id =? and role ='corporate registrant' "
// const checkPaidReg= "SELECT registrant_id_ref FROM order_info WHERE event_id_ref=? AND order_status='success'  AND registrant_id_ref=?";
// const reminderNotifForReg = "select * from notification_info where notification_type = 'reminder-notification' and event_id_ref=? order by created_at desc"; 
// const getActiveReg="select * from registrant_info where registrant_status='active' and registrant_id =?";
// const notifForReg = "select * from notification_info where event_id_ref=? and registrant_id_ref=? and read_status='unread'";
// const updateNotif = "update  notification_info set read_status ='read'  where registrant_id_ref=? and notification_id=? "
// module.exports={
//     updateNotif,
//     getActiveReg,
//     paidRegistrants,
//     getRegistrantMAil,
//     createCommunication,
//     getCorporateMail,
//     checkPaidReg,
//     regToken,
//     corpReg,
//     reminderNotifForReg,
//     notifForReg
// }




