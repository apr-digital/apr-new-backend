const activeEvent = "select event_id from  event_info where event_status='active' ";

const paidRegistrant = "select * from order_info where order_status='success' and event_id_ref=?";

const runnerCountAsOfOrderId = " select count(*) as runner_count from runner_info where booking_id_ref =?";

const corpRunCount = "select count(*) as runner_count from runner_info where runner_payment_status ='paid by corporate' and registrant_event_id_ref=? ";

module.exports = {
    activeEvent,
    paidRegistrant,
    runnerCountAsOfOrderId,
    corpRunCount

}