const addReminder="insert into reminder_info (subject,message,month, date, hour,minute,year, created_by) values (?, ?, ?, ?, ?, ?, ?, ?)"

const paidReg = "select registrant_id_ref from order_info where order_status='success' and event_id_ref=?"

const getReg = "select registrant_id, email_id,  notif_token from registrant_info where registrant_id =?";

module.exports =
{
    getReg,
addReminder,
paidReg
}