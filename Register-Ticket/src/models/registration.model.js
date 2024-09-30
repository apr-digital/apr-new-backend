const addRegistrantInfo =
  "UPDATE registrant_info SET   registrant_type_ref =?, resident_of_apr=?,address_type=?,address=?," +
  "city=?,state=?,  country=?,pin_code=?, need_80G_certificate=?, pancard_number=?, registrant_source_ref=?, registrant_class_ref=?, event_id_ref = ? ,role=?  WHERE registrant_id =?";

const updateRegistrantInfo =
  "UPDATE registrant_info SET address_type=?, address=?," +
  "city=?,state=?,  country=?,pin_code=?, need_80G_certificate=?, pancard_number=?, registrant_source_ref=?, registrant_class_ref=?  WHERE registrant_id =?";

const getRegistrant =
  "SELECT registrant_id, registrant_type_ref, first_name, middle_name, last_name, registrant_profile_image, email_id, mobile_number,resident_of_apr,address_type,addr_villa_number, addr_villa_lane_no,addr_villa_phase_no, addr_tower_no,addr_tower_block_no,addr_tower_flat_no, external_address, city, state, country, pin_code, need_80G_certificate,pancard_number," +
  "registrant_class_ref, card_det_ref  FROM registrant_info WHERE registrant_id = ? ";

const removeRegistrsant = "DELETE FROM registrant_info WHERE registrant_id = ?";

const getRegistrantInfo =
  "SELECT registrant_id, registrant_type_ref, first_name, middle_name, last_name, email_id, mobile_number, address_type, city, state, country, pin_code, need_80G_certificate,pancard_number," +
  " registrant_class_ref, card_det_ref  FROM registrant_info WHERE registrant_id = ?";

const addRunner =
  "INSERT INTO runner_info (registrant_id_ref,  runner_first_name, runner_last_name, runner_dob, runner_gender, runner_email_id,  runner_phone_number, " +
  "runner_emergency_contact_name, runner_emergency_contact_number, runner_address_type, runner_address, runner_city, runner_state,runner_country,runner_pincode,tshirt_size,runner_blood_group,runner_age, age_type_id_ref, run_category_id_ref,registrant_event_id_ref, role)" +
  "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?, 'runner')";

const updateRunnerInfo =
  "UPDATE runner_info SET  runner_first_name =?, runner_last_name =?, runner_dob=?, runner_gender =?, runner_email_id=? ,  runner_phone_number=?, " +
  " runner_emergency_contact_name =?, runner_emergency_contact_number=?, runner_address_type=?, runner_address=?, runner_city=?, runner_state=?, runner_country=?, runner_pincode=?, tshirt_size=?, runner_blood_group=?, run_category_id_ref=?  WHERE runner_id= ? ";

const removeRunner = "DELETE  FROM runner_info WHERE runner_id = ?";

const getRunner = "SELECT * FROM runner_info WHERE runner_id = ?";

const getRegistrantTypes = "SELECT * FROM registrant_type_info ";

const getTicketTypes =
  "SELECT * FROM ticket_type_info WHERE registrant_type_id_ref =?";

const getEventDetail = "SELECT * FROM event_info WHERE event_status ='active'";

const getRaceCategory = "SELECT * FROM race_category_info";

const getAgeCategory = "SELECT age_type_id, age_type_name FROM age_category_info ";

const runnersCount =
  "SELECT COUNT(*) AS registrant_count FROM runner_info where registrant_event_id_ref = ? and (runner_payment_status ='paid' or runner_payment_status ='paid by corporate') ";

const getRegistrantImage =
  "SELECT registrant_profile_image FROM registrant_info ORDER BY created_at DESC LIMIT 5";

const getRunnerDetailForMasterList =
  "SELECT runner_first_name, runner_last_name, runner_gender, runner_age, run_category_id_ref FROM runner_info WHERE registrant_id_ref = ? AND registrant_event_id_ref = ?";

const getRegistrantType =
  "SELECT type_name, type_id FROM registrant_type_info WHERE type_id =? ";

const raceCategory =
  "SELECT race_type_id , race_type_name FROM race_category_info WHERE race_type_id = ?";

const runnerForRegistrant =
  "SELECT * FROM runner_info WHERE runner_id=? AND registrant_id_ref =?";

const runnerByRegistrant =
  "SELECT * FROM runner_info WHERE registrant_id_ref =?";

const registrantClassinfo =
  "SELECT category_id, category_name, registrant_type_id_ref FROM registrant_class_category_info WHERE  registrant_type_id_ref =?";

const registrantClass =
  "SELECT registrant_type_id_ref, category_id,category_name FROM registrant_class_category_info WHERE registrant_type_id_ref =? ORDER BY category_id";

const registrantClassForAdmin =
  "SELECT registrant_type_id_ref, category_id,category_name FROM registrant_class_category_info ORDER BY category_id"; //added by Rishi on 26-feb

const registrantSource =
  "SELECT source_id, source_name FROM registrant_source_info ";

const runCategory =
  "SELECT race_type_id, race_type_name FROM race_category_info";

const ageCatId =
  "SELECT age_type_id, age_type_name FROM age_category_info WHERE age_type_name=?";

const classPrice =
  "SELECT registrant_class_id, registrant_class_category_id_ref,category_price, category_ticket_count," +
  "runners_allowed_count,registrant_type_id_ref FROM registrant_class_info WHERE event_id_ref=? AND registrant_type_id_ref=? AND registrant_class_category_id_ref=?";

const registrantInfo =
  "select first_name, middle_name, last_name, email_id, mobile_number from registrant_info where registrant_id =?";

const getMinPrice =
  "select min(category_price) as min_price, registrant_type_id_ref from registrant_class_info where event_id_ref=? and registrant_type_id_ref=? GROUP BY registrant_type_id_ref ";

const raceTiming =
  "SELECT age_type_id_ref,race_type_id_ref, event_id_ref, race_time FROM race_timing_info WHERE event_id_ref =? and race_type_id_ref =?";

const getClassPrice =
  "select registrant_class_category_id_ref,category_price, category_ticket_count," +
  "runners_allowed_count, registrant_type_id_ref from registrant_class_info where event_id_ref =? and registrant_type_id_ref =?";

  const getEarlybirdClassPrice =
  "select registrant_class_category_id_ref, early_bird_price as category_price, category_ticket_count," +
  "runners_allowed_count, registrant_type_id_ref from registrant_class_info where event_id_ref =? and registrant_type_id_ref =?";

const className =
  "select category_name from registrant_class_category_info where category_id =?";

const getPrice =
  "select category_price, runners_allowed_count, category_ticket_count from registrant_class_info where event_id_ref=? and registrant_class_category_id_ref=?";

const bookingCount =
  "select count(*) as booking_count from booking_info where event_id_ref=? ";

const insertIntobooking =
  "INSERT INTO booking_info (registrant_type_ref, registrant_class_ref,need_80G_certificate,event_id_ref,registrant_id_ref, runner_count)" +
  "VALUES (?,?,?,?,?,?)";

const cutOffDate = "SELECT event_cut_off_date FROM event_info WHERE event_id=?";

const runnerInsertion = `INSERT INTO runner_info (
  registrant_id_ref, 
  runner_first_name, 
  runner_last_name, 
  runner_age_category, 
  runner_gender, 
  runner_email_id, 
  runner_phone_number, 
  runner_address_type,
  villa_number,
  lane_number,
  phase_number,
  tower_number,
  block_number,
  flat_number,
  external_address,
  runner_city,
  runner_state,
  runner_country,
  runner_pincode, 
  runner_address, 
  tshirt_size,  
  run_category_id_ref, 
  registrant_event_id_ref, 
  role,
  booking_id_ref
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,  'runner',?)`

const addRegistrant =
  "UPDATE registrant_info SET  resident_of_apr=?,address_type=?,addr_villa_number=?, addr_villa_lane_no=?,addr_villa_phase_no=?,addr_tower_no=?,addr_tower_block_no=?, addr_tower_flat_no=?,external_address=?," +
  "city=?,state=?,  country=?,pin_code=?,  pancard_number=? ,emergency_contact_name=?,emergency_contact_number=?,role=?  WHERE registrant_id =?";

const getBookingid =
  "select booking_id, registrant_type_ref, registrant_class_ref from booking_info where registrant_id_ref=? and event_id_ref=? and registrant_type_ref=?";

const runnerByBookingId = "select * from runner_info where booking_id_ref=?";

const getRegClass =
  "select category_name , registrant_type_id_ref from registrant_class_category_info where category_id=?";
  

const orderCount = "select count(*) as count from order_info";

const createOrder =
  "insert into order_info (order_id, registrant_class_ref, registrant_id_ref, event_id_ref, booking_id_ref,order_status,runner_count,total_amount, billing_address) values(?,?,?,?,?,?,?,?,?)";

const bookingId = "select * from booking_info where booking_id=?";

const orderStatus =
  "select * from order_info where registrant_id_ref=? and order_status = 'success'";
//const runnersByBookingid = "select * from runner_info where booking_id_ref=?";

const registrantData =
  "select registrant_id, first_name, middle_name, last_name, email_id, mobile_number,  address_type," +
  "role from registrant_info where registrant_id = ? ";

const villaAddress =
  "select CONCAT_WS(',' , addr_villa_number, addr_villa_lane_no, addr_villa_phase_no, city, state, country, pin_code ) as address from registrant_info where registrant_id=?";

const towerAddress =
  "select CONCAT_WS(',' , addr_tower_no, addr_tower_block_no, addr_tower_flat_no, city, state, country, pin_code ) as address from registrant_info where registrant_id=?";

const otherAddress =
  "select CONCAT_WS(',' , external_address, city, state, country, pin_code ) as address from registrant_info where registrant_id=?";

const checkUser =
  "SELECT registrant_id, first_name, middle_name, last_name, email_id, mobile_number,address_type, city, state, country, pin_code, need_80G_certificate,pancard_number," +
  "registrant_source_ref FROM registrant_info WHERE registrant_id = ? ";

const editUser =
  "update registrant_info set first_name=?, middle_name=?, last_name =?, email_id=?, mobile_number=?, resident_of_apr=?,address_type=?, addr_villa_number=?, addr_villa_lane_no=?," +
  "addr_villa_phase_no=?, addr_tower_no=?, addr_tower_block_no=?,addr_tower_flat_no=?, external_address=?, city=?,state=?, country=?,pin_code=?," +
  "registrant_profile_image=? where registrant_id=?";

const saveOtp =
  "INSERT INTO otp_info (email_id, phone_number, otp) VALUES (?,?,?)";

const getOtp =
  "SELECT otp,email_id FROM otp_info WHERE phone_number = ? ORDER BY created_at DESC LIMIT 1";

const villaInfo = "select * from villa_primary_info";

const getTowerData =
  "select tower_id, tower_number from tower_info where type='tower'";

const getBlock1 =
  "select block_number from tower_info where type='block' and tower_1 ='true'";

const getBlock2 =
  "select  block_number from tower_info where type='block' and tower_2 ='true'";

const getBlock3 =
  "select  block_number from tower_info where type='block' and tower_3 ='true'";

const getBlock4 =
  "select  block_number from tower_info where type='block' and tower_4 ='true'";

const getBlock5 =
  "select  block_number from tower_info where type='block' and tower_5 ='true'";

const getBlock6 =
  "select  block_number from tower_info where type='block' and tower_6 ='true'";

const getBlock7 =
  "select  block_number from tower_info where type='block' and tower_7 ='true'";

const orderInfo = "select * from order_info where order_id=? and registrant_id_ref =?"

const bookingInfo = "select * from booking_info  where booking_id=? and registrant_id_ref =?";

const activeEvent = "select * from event_info where event_status='active'";

const runCat = "select race_type_id, race_type_name from race_category_info where race_type_id=?";

const runnerCount = "select count(*) as runner_count from runner_info where run_category_id_ref =? and registrant_event_id_ref =? and (runner_payment_status='paid' or runner_payment_status='paid by corporate' or runner_payment_status='refunded')"

const updateRunnerPaymentStatus = "update runner_info set runner_payment_status = ? , bib_number=?  where booking_id_ref=? and runner_id=?";

const updateOrderStatus = "update order_info set order_status= ? where order_id =? and booking_id_ref=?";

const regType = "select type_id, type_name from registrant_type_info where type_id =?";

const regCount=  "select * from order_info where registrant_id_ref=? and event_id_ref=? and order_status='success'";

const runnerDetails = "select * from runner_info where booking_id_ref =?";

const createPayment = "insert into  payment_info (payment_type,payment_status,payment_amount,payment_additional_amount,payment_date,payment_reference_id,registrant_id_ref,runner_id_ref,event_id_ref) values(?, ?, ?,?,?,?,?,?,?)"

const createTicket = "insert into ticket_info (ticket_id,registrant_class_ref,runner_id_ref,registrant_id_ref,event_id_ref,order_id_ref,ticket_status) values(?,?,?,?,?,?,?) "

const getOrderStatus = "select * from order_info where booking_id_ref=?";

const raceForAge = "select race_time_id, age_type_id_ref, race_time, race_type_id_ref from race_timing_info where age_type_id_ref=? and event_id_ref=?"

const paymentDate="select * from payment_info where order_id_ref = ? limit 1 ";

const profilePic = "update registrant_info set registrant_profile_image=? where registrant_id=?";

//Rishi added on 20-Feb-24

const getActiveEventId = "select event_id from event_info where event_status='active'";

const addNewRegistrant =
  "insert into registrant_info  (first_name,middle_name,last_name,email_id,mobile_number,resident_of_apr,address_type,addr_villa_number, addr_villa_lane_no,addr_villa_phase_no,addr_tower_no,addr_tower_block_no, addr_tower_flat_no,external_address," +
  "city,state,  country,pin_code,  pancard_number, emergency_contact_name, emergency_contact_number ,role,created_by,registrant_status,existing_user) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,'admin','active',false)";

const getAddedRegistrantID = "select registrant_id from registrant_info where first_name=? and last_name=? and email_id=? and mobile_number=?";
const getOldRegistrantID = "select registrant_id from registrant_info where email_id=? or mobile_number=?";
const getPaymentStatusAdminRegistrants = "select ri.*, pi.payment_status, pi.order_id_ref, pi.payment_amount from registrant_info ri left join payment_info pi on registrant_id = registrant_id_ref where ri.created_by = 'admin' and pi.event_id_ref = ? and pi.payment_status = 'success';"
const getBookingIDForAdmin = "select booking_id, registrant_type_ref,registrant_class_ref from booking_info where registrant_id_ref=? and registrant_type_ref NOTNULL"
const getCategoryName = "select category_name from registrant_class_category_info where category_id=?"
const getCategoryInfo = "select race_type_name from race_category_info where race_type_id=?"
const getTranscationId = "select provider_reference_id,merchant_transaction_id from payment_info where registrant_id_ref=?"
const getSearchedRegistrantsByMail = "select distinct ri.registrant_id,ri.first_name,ri.last_name,ri.email_id,ri.mobile_number,bi.event_id_ref,bi.registrant_type_ref from registrant_info ri right join booking_info bi on ri.registrant_id = bi.registrant_id_ref where event_id_ref != ? and email_id like ?";
const getSearchedRegistrantsByMobileNumber = "select ri.registrant_id,ri.first_name,ri.last_name,ri.email_id,ri.mobile_number,bi.event_id_ref,bi.registrant_type_ref from registrant_info ri right join booking_info bi on ri.registrant_id = bi.registrant_id_ref where mobile_number like ?";
const getRegistrantData = "select registrant_id,registrant_type_ref,first_name, middle_name, last_name, email_id"+
",mobile_number,address_type,additional_email_id,city,state,pin_code,pancard_number,registrant_source_ref,"+
" registrant_class_ref, need_80g_certificate, certificate_80g_url, created_at, updated_at,refresh_token,"+
"google_id,card_det_ref,country,registrant_profile_image,role,corporate_sponsor_id_ref,resident_of_apr,"+
"otp_verification_status,addr_villa_number,addr_villa_lane_no,addr_villa_phase_no,addr_tower_no,addr_tower_block_no,"+
"addr_tower_flat_no,external_address,notif_token,registrant_status,reg_payment_user_id,existing_user,"+
"created_by from registrant_info"+" where registrant_id = ?;"
const getRunnerData = "select * from runner_info where registrant_id_ref = ? and registrant_event_id_ref = ?"
const getEventName = "select event_name from event_info where event_id = ?";
const getClassName = "select type_name from registrant_type_info where type_id=?";

//-----------------------24-09-2024 by suganthi----------------------------
const eventRegisterinfo = `SELECT booking_info.booking_id 
FROM order_info 
JOIN booking_info ON order_info.booking_id_ref = booking_info.booking_id
WHERE order_info.event_id_ref IN (
    SELECT event_id 
    FROM event_info 
    WHERE event_year < ?
) 
AND order_info.registrant_id_ref =  ?
AND order_info.order_status = 'success'
AND booking_info.registrant_type_ref = 1
AND booking_info.registrant_class_ref = ?`;

const previousEventRunner = 'select * from runner_info where booking_id_ref=? '
module.exports = {
  profilePic,
  paymentDate,
  createPayment,
  createTicket,
  regType,
  regCount,
  addRegistrantInfo,
  removeRegistrsant,
  addRunner,
  updateRunnerInfo,
  removeRunner,
  getRegistrant,
  getRunner,
  updateRegistrantInfo,
  getRegistrantTypes,
  getTicketTypes,
  getEventDetail,
  getRaceCategory,
  getAgeCategory,
  getRegistrantImage,
  runnersCount,
  getRunnerDetailForMasterList,
  getRegistrantType,
  raceCategory,
  runnerForRegistrant,
  runnerByRegistrant,
  registrantClassinfo,
  registrantClass,
  registrantSource,
  runCategory,
  ageCatId,
  classPrice,
  registrantInfo,
  getMinPrice,
  raceTiming,
  getClassPrice,
  className,
  getPrice,
  bookingCount,
  insertIntobooking,
  cutOffDate,
  runnerInsertion,
  addRegistrant,
  getBookingid,
  runnerByBookingId,
  getRegClass,
  orderCount,
  createOrder,
  bookingId,
  orderStatus,
  //runnersByBookingid,
  registrantData,
  checkUser,
  editUser,
  saveOtp,
  getOtp,
  getRegistrantInfo,
  villaInfo,
  getBlock1,
  getBlock2,
  getBlock3,
  getBlock4,
  getBlock5,
  getBlock6,
  getBlock7,
  getTowerData,
  villaAddress,
  towerAddress,
  otherAddress,

  orderInfo,
  bookingInfo,
  activeEvent,
  runCat,
  runnerCount,
  updateRunnerPaymentStatus,
  updateOrderStatus,
  runnerDetails,
  getOrderStatus,
  getEarlybirdClassPrice,
  raceForAge,

  //Rishi added on 20-Feb-24
  getActiveEventId,
  addNewRegistrant,
  getAddedRegistrantID,
  getPaymentStatusAdminRegistrants,
  getBookingIDForAdmin,
  getSearchedRegistrantsByMail,
  getSearchedRegistrantsByMobileNumber,
  getRegistrantData,
  getEventName,
  getCategoryName,
  getRunnerData,
  registrantClassForAdmin,
  getTranscationId,
  getClassName,
  getOldRegistrantID,
  getCategoryInfo,
  eventRegisterinfo,
  previousEventRunner
};