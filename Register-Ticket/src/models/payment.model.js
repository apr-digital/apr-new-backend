const orderInfo = "select * from order_info where order_id=? and registrant_id_ref =?"
const orderInfo1 = "select * from order_info where order_id=? "

const bookingInfo = "select * from booking_info  where booking_id=? and registrant_id_ref =?";

const activeEvent = "select * from event_info where event_status='active'";

const runCat = "select race_type_id, race_type_name from race_category_info where race_type_id=?";

const runnerCount = "select count(*) as runner_count from runner_info where run_category_id_ref =? and registrant_event_id_ref =? and (runner_payment_status='paid' or runner_payment_status='paid by corporate' or runner_payment_status='refunded')"

const updateRunnerPaymentStatus = "update runner_info set runner_payment_status = ? , bib_number=?  where booking_id_ref=? and runner_id=?";

const updateOrderStatus = "update order_info set order_status= ? where order_id =? and booking_id_ref=?";

const regType = "select type_id, type_name from registrant_type_info where type_id =?";

const regCount=  "select * from order_info where  event_id_ref=? and order_status='success'";

const runnerDetails = "select * from runner_info where booking_id_ref =?";

const createPayment = "insert into  payment_info (payment_type,payment_status,payment_amount,payment_additional_amount,payment_date,payment_reference_id,registrant_id_ref,runner_id_ref,event_id_ref, order_id_ref, merchant_id,merchant_transaction_id, reg_payment_user_id_ref, check_pay_token) values(?, ?, ?,?,?,?,?,?,?, ?,?,?,?,?)"

const createTicket = "insert into ticket_info (ticket_id,registrant_class_ref,runner_id_ref,registrant_id_ref,event_id_ref,order_id_ref,ticket_status) values(?,?,?,?,?,?,?) "

const getOrderStatus = "select * from order_info where booking_id_ref=?";

const getRegistrant =
  "SELECT registrant_id, registrant_type_ref, first_name, middle_name, last_name, registrant_profile_image, email_id, mobile_number,resident_of_apr,address_type,addr_villa_number, addr_villa_lane_no,addr_villa_phase_no, addr_tower_no,addr_tower_block_no,addr_tower_flat_no, external_address, city, state, country, pin_code, need_80G_certificate,pancard_number," +
  "registrant_class_ref, card_det_ref, reg_payment_user_id ,notif_token FROM registrant_info WHERE registrant_id = ? ";


const updatePayment= "update payment_info set payment_status=?, code=?, message=?, response_code=?, success_state=?,payment_state=?, payment_instrument_type=?,upi_utr=?, card_cardtype=?, card_pgtransaction_id=?,"+
                       "  card_banktransaction_id=?, card_pgauthorization_code=?, card_arn=?, card_bank_id=?,card_brn=?, netbanking_pgtransaction_id=? ,  "+
                      "netbanking_servicetransaction_id=?, netbanking_banktransaction_id=?, netbanking_bank_id=?, provider_reference_id=?, response_code_description=? where  order_id_ref=? and registrant_id_ref=? and merchant_transaction_id=?" ;

const paymentCount = "select count(*) as payment_count from payment_info";

const paymentDetails = "select * from payment_info where registrant_id_ref=? and event_id_ref=?";

const updatePaymentInfo =  "update payment_info set payment_status =? where merchant_transaction_id =? and merchant_id=? ";
  
const getPaymentStatus= "select registrant_id_ref, payment_status, order_id_ref, merchant_id, merchant_transaction_id from payment_info where order_id_ref=? and merchant_transaction_id=? and merchant_id=?  limit 1";
const createNotification =  "INSERT INTO notification_info (notification_type,subject, message, email_id, registrant_id_ref,event_id_ref, read_status,created_by )"+ 
"VALUES (?,?,?,?,?,?,'unread',?)";

const orderDetail = "select * from order_info where registrant_id_ref=? and event_id_ref=? and (order_status='success' or order_status = 'payment initiated')";

const orderDetailForAdmin = "select * from order_info where  event_id_ref=? and order_status='success' ";
const regClass = "select category_name, registrant_type_id_ref from registrant_class_category_info where category_id=?";

const registrant = "select registrant_id, first_name, middle_name, last_name, email_id, mobile_number from registrant_info where registrant_id=?"

const billAddress = "select registrant_class_ref, billing_address from order_info where order_id =? and order_status='success'";

const transInfo = "select payment_date, order_id_ref, merchant_transaction_id, provider_reference_id, payment_amount,created_at from payment_info where order_id_ref=? and payment_status ='success' limit 1";

const runners = "select runner_id, runner_first_name, runner_last_name, runner_age, runner_gender,runner_email_id, runner_phone_number as mobile_number, bib_number, run_category_id_ref,role,tshirt_size from runner_info where booking_id_ref=?"

const ticketNo= "select ticket_id from ticket_info where runner_id_ref=? ";

const merchantTransId = "select * from payment_info where order_id_ref =?";

const getPrice = "select category_price from registrant_class_info where registrant_class_category_id_ref =?"
///////
const paymentInfo ="select * from payment_info where merchant_transaction_id =? limit 1";

const checkUnique = "select * from runner_info where bib_number = ?"

const payStatus ="select registrant_id_ref, payment_status, order_id_ref, merchant_id, merchant_transaction_id from payment_info where check_pay_token =? limit 1"

//Rishi

const getPaymentStatusForRegistrant = "select payment_status from payment_info where registrant_id_ref=?"

module.exports ={
  checkUnique,
  payStatus,
  orderInfo1,
  paymentInfo,
  getPrice,
  merchantTransId,
  orderDetailForAdmin,
  ticketNo,
  runners,
  orderDetail,
  createNotification,
  getPaymentStatus,
    updatePaymentInfo,
    getRegistrant,
    orderInfo,
    bookingInfo,
    activeEvent,
    runCat,
    runnerCount,
    updateRunnerPaymentStatus,
    updateOrderStatus,
    regType,
    regCount,
    runnerDetails,
    createPayment,
    createTicket,
    getOrderStatus,
    updatePayment,
    paymentCount,
    paymentDetails,
    regClass,
    registrant,
    billAddress,
    transInfo,

    //Rishi

    getPaymentStatusForRegistrant
}