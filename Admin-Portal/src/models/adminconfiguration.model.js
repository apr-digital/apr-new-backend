const getEventInfo = "SELECT * FROM event_info WHERE event_id=?";
const createEvent = "UPDATE  event_info event_name=?, event_year=?, event_date=?, event_time=?, event_location=?, event_description=?,is_spot_registration_avail=?,event_cut_off_date=?," +
    "event_cut_off_time=?,expo_day=?,stalls_opening_time=?,bib_collection_date=?, bib_collection_place=?, race_instruction=?, parking_instruction=?,created_by=? WHERE event_id = ?";
//  Start of changes for newUpdateEvent by -> Rishi on 31/01/24
const updateEvent = "UPDATE event_info SET  event_name =?, event_date=?, event_time=?, event_location=?,city=?,state=?, zip_code=?, event_description=?,event_cut_off_date=?," +
    "event_cut_off_time=?, registration_start_date=?,expo_day=?,stalls_opening_time=?, stall_closing_time=?, bib_collection_date=?, bib_collection_place=?,bib_collection_starts=?, bib_collection_ends=?,early_bird_cut_off_date=?, race_instruction=?, parking_instruction=?,updated_by =?, updated_at=? WHERE event_id=?";
const getActiveEvent = "select * from event_info where event_status='active'"
const setUpEvent1 = "insert into event_info (event_name, event_year, event_organiser, event_date, event_time, event_location, city, state, country, zip_code, event_description, event_cut_off_date, "+
"event_cut_off_time, registration_start_date, expo_day,stalls_opening_time, stall_closing_time, bib_collection_date, bib_collection_place, bib_collection_starts, bib_collection_ends, early_bird_cut_off_date, race_instruction, parking_instruction, updated_by, updated_at, event_status, is_spot_registration_avail) values "
+"(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,'active', true)"
const getCurrentEvent = "select * from event_info where event_name=? and event_year=?"
//  End of changes for newUpdateEvent by -> Rishi on 31/01/24
const getRaceCategory = "SELECT * FROM race_category_info";
const getRaceCategory1 = "SELECT race_type_id,race_type_name FROM race_category_info";
const getRegistrantClass = "SELECT * FROM registrant_class_info WHERE event_id_ref=?";
const getRegistrantSource = "SELECT * FROM registrant_source_info";
const getRegistrantType = "SELECT * FROM registrant_type_info";
const getRegistrantType1 = "SELECT type_id,type_name,image_url FROM registrant_type_info";
const setUpEvent = "INSERT INTO event_info (event_name, event_year, event_organiser ,event_status) VALUES (?,?,?,'inactive')";
const getTicketType = "SELECT * FROM ticket_type_info WHERE event_id_ref=?";
const getEvents = "SELECT * FROM event_info";
const activeEvent = "SELECT event_id, event_name,event_year,event_organiser FROM event_info WHERE event_status ='active'";
const ageType = "select age_type_id, age_type_name from age_category_info ";
const regType = "select category_id,category_name, registrant_type_id_ref from registrant_class_category_info where registrant_type_id_ref =?";
const runners = "select runner_id,runner_first_name,runner_last_name,registrant_id_ref,runner_dob,runner_gender,runner_email_id,runner_emergency_contact_number,runner_emergency_contact_name,runner_blood_group,age_type_id_ref," +
    "runner_age,runner_address,run_category_id_ref,tshirt_size,need_runner_kit,registrant_event_id_ref,bib_number,runner_payment_status,my_payment_id_ref,runner_phone_number,role,booking_id_ref,corporate_sponsor_id_ref from runner_info where runner_payment_status = 'paid' or runner_payment_status ='paid by corporate'";
const registrantFromOrderInfo = "select  registrant_id_ref from order_info where order_status = 'success' ";
const registrants = "select registrant_id, registrant_type_ref, first_name, middle_name, last_name,registrant_profile_image, email_id, mobile_number,address_type, CONCAT_WS(',',addr_villa_number, addr_villa_lane_no, addr_villa_phase_no, addr_tower_no, addr_tower_block_no, addr_tower_flat_no, city, state, country, pin_code) as address, need_80G_certificate,pancard_number," +
    " registrant_class_ref from registrant_info where registrant_id=?";
const overallRegistrant = "select * from registrant_info";
const insertRaceTime = "insert into race_timing_info (race_type_id_ref,age_type_id_ref, race_time, race_1k, race_5k, race_10k, event_id_ref, created_by) values (?,?,?,?,?,?,?,?)"
const insertClassPrice = "insert into registrant_class_info (registrant_class_category_id_ref,category_name,category_price,category_ticket_count, " +
    "runners_allowed_count,registrant_type_id_ref,created_by,event_id_ref) values(?,?,?,?,?,?,?,?)"
const getSponsorList = "select corporate_id, corp_registrant_firstname,corp_registrant_lastname, corp_registrant_mob_number," +
    "corp_company_name, corp_registrant_mailid, corp_code, CONCAT_WS(',', corp_address_type, corp_addr_villa_number,corp_addr_villa_lane_no, corp_addr_villa_phase_no,corp_addr_tower_no,corp_addr_tower_block_no,corp_addr_tower_flat_no, city, state, country, zipcode) as corp_reg_address, " +
    "sponsorship_category, sponsorship_amount, number_of_passes,corp_company_description, payment_ref_number,payment_ref_date, event_id_ref, created_by, created_at " +
    "from corporate_sponsor_info where event_id_ref=?";
const inactivateEvent = "update event_info set event_status ='inactive' where event_id =?";
const activateEvent = "update event_info set event_status ='active' where event_id =?";
const updateSponsorStatus = "update corporate_sponsor_info set sponsor_status =? where corporate_id =?";
const updateRegStatus = "update registrant_info set registrant_status =? where corporate_sponsor_id_ref =?"
const bookingInfo = "select * from booking_info where booking_id=?"
const registrant = "SELECT registrant_id, first_name, middle_name, last_name, registrant_profile_image, email_id, mobile_number,resident_of_apr,address_type,addr_villa_number, addr_villa_lane_no,addr_villa_phase_no, addr_tower_no,addr_tower_block_no,addr_tower_flat_no, external_address, city, state, country, pin_code, need_80G_certificate,pancard_number," +
    " reg_payment_user_id ,notif_token, role FROM registrant_info WHERE registrant_id = ? ";
const regTypeName = "select type_name from registrant_type_info where type_id=?";
const regClassName = "select category_name from registrant_class_category_info where category_id =?";
const runner = "select runner_id,runner_first_name,runner_last_name,registrant_id_ref,runner_dob,runner_gender,runner_email_id,runner_emergency_contact_number,runner_emergency_contact_name,runner_blood_group,age_type_id_ref," +
    "runner_age,runner_address,run_category_id_ref,tshirt_size,need_runner_kit,registrant_event_id_ref,bib_number,runner_payment_status,my_payment_id_ref,runner_phone_number,role,booking_id_ref,corporate_sponsor_id_ref, created_at from runner_info where booking_id_ref=?"
const runType = "select race_type_name from race_category_info where race_type_id =?";
const corpRunner = "SELECT ri.*, ci.corp_company_name FROM runner_info ri LEFT JOIN corporate_sponsor_info ci ON ri.corporate_sponsor_id_ref = ci.corporate_id WHERE runner_payment_status ='paid by corporate' and event_id_ref = ?";
//-----------------------laksh-----------------------
const getAllRegistrants = "select registrant_id, registrant_type_ref, first_name, middle_name, last_name, registrant_profile_image, email_id, mobile_number,resident_of_apr,address_type,addr_villa_number, addr_villa_lane_no,addr_villa_phase_no, addr_tower_no,addr_tower_block_no,addr_tower_flat_no, external_address, city, state, country, pin_code, need_80G_certificate,pancard_number,registrant_class_ref, card_det_ref, reg_payment_user_id  from registrant_info where registrant_status='active'";
const getDonateRegistrantId = "SELECT ri.booking_id,ri.registrant_id_ref,ot.order_id,ot.order_status,ot.total_amount FROM booking_info ri JOIN order_info ot ON ot.booking_id_ref = ri.booking_id WHERE ri.event_id_ref =? AND ri.registrant_type_ref = 3 AND ot.order_status = 'success'";
const getAllDonateRegistrants = "select registrant_id, registrant_type_ref, first_name, middle_name, last_name, registrant_profile_image, email_id, mobile_number,resident_of_apr,address_type,addr_villa_number, addr_villa_lane_no,addr_villa_phase_no, addr_tower_no,addr_tower_block_no,addr_tower_flat_no, external_address, city, state, country, pin_code, need_80G_certificate,pancard_number,registrant_class_ref, card_det_ref, reg_payment_user_id  from registrant_info where registrant_status='active' and registrant_id=?";
//-----------------------laksh-----------------------
// const orderStatus= "select order_status from order_info where order_status='success' and registrant_id_ref=?"
const orderStatus= "SELECT bk.registrant_type_ref, oi.order_status FROM booking_info bk LEFT JOIN order_info oi ON bk.booking_id = oi.booking_id_ref WHERE oi.order_status = 'success' AND oi.registrant_id_ref = ?"
const getCorporateName= "select corp_company_name from corporate_sponsor_info where corporate_id=? and corp_company_name notnull";
const regTypeForParticipant= "select type_name from registrant_type_info where type_id =?"
const deleteRaceTimings = "DELETE FROM race_timing_info"
const deleteRegistrantClassInfo = "DELETE FROM registrant_class_info"
const isEventExistsById = "SELECT * FROM event_info WHERE event_id=? AND event_status='active'"
const getEventDataById = "SELECT * FROM event_info WHERE event_id=?"
const getRegistrantClassDetails = "SELECT category_name, category_ticket_count, category_price, registrant_type_id_ref FROM registrant_class_info WHERE event_id_ref=?"
const getOneKTime = "SELECT DISTINCT race_time FROM race_timing_info WHERE race_type_id_ref=13 and event_id_ref=?"
const getTenKTime = "SELECT DISTINCT race_time FROM race_timing_info WHERE race_type_id_ref=15 and event_id_ref=?"
const getFiveKTime = "SELECT ai.age_type_id AS id, ai.age_type_name AS age_category, ri.race_time AS time FROM age_category_info ai LEFT JOIN race_timing_info ri ON ai.age_type_id = ri.age_type_id_ref WHERE ri.race_type_id_ref=14 and ri.event_id_ref=?"
const updateEventQuery = `UPDATE event_info SET 
event_name = ?, 
event_year = ?, 
event_organiser = ?, 
event_date = ?, 
event_time = ?, 
event_location = ?, 
city = ?, 
state = ?, 
country = ?, 
zip_code = ?, 
event_description = ?, 
event_cut_off_date = ?, 
event_cut_off_time = ?, 
registration_start_date = ?, 
expo_day = ?,
stalls_opening_time = ?, 
stall_closing_time = ?, 
bib_collection_date = ?, 
bib_collection_place = ?, 
bib_collection_starts = ?, 
bib_collection_ends = ?, 
early_bird_cut_off_date = ?, 
race_instruction = ?, 
parking_instruction = ?, 
updated_by = ?, 
updated_at = ? 
WHERE event_id = ?`

const getRaceArrayQuery = `SELECT DISTINCT ON (age_type_id_ref)
ri.age_type_id_ref AS id, 
ai.age_type_name AS age_category, 
ri.race_1k, 
ri.race_5k, 
ri.race_10k FROM race_timing_info ri LEFT JOIN age_category_info ai 
ON ri.age_type_id_ref = ai.age_type_id WHERE event_id_ref=? ORDER BY age_type_id_ref`

const inactiveAllEvents = "UPDATE event_info SET event_status='inactive'"

module.exports = {
    regTypeForParticipant,
    getCorporateName,
    orderStatus,
    corpRunner,
    runType,
    runner,
    regClassName,
    regTypeName,
    registrant,
    bookingInfo,
    getEventInfo,
    getRaceCategory,
    getRaceCategory1,
    getRegistrantClass,
    getRegistrantSource,
    getRegistrantType,
    getRegistrantType1,
    getTicketType,
    createEvent,
    updateEvent,
    setUpEvent,
    getEvents,
    activeEvent,
    ageType,
    regType,
    runners,
    registrantFromOrderInfo,
    registrants,
    overallRegistrant,
    insertRaceTime,
    insertClassPrice,
    getSponsorList,
    inactivateEvent,
    activateEvent,
    updateSponsorStatus,
    updateRegStatus,
    //laksh
    getAllRegistrants,
    getAllDonateRegistrants,
    getDonateRegistrantId,
    //laksh
    //Rishi
    setUpEvent1,
    getActiveEvent,
    getCurrentEvent,

    //Ram
    deleteRaceTimings,
    deleteRegistrantClassInfo,
    isEventExistsById,
    updateEventQuery,
    getEventDataById,
    getRegistrantClassDetails,
    getOneKTime,
    getTenKTime,
    getFiveKTime,
    getRaceArrayQuery,
    inactiveAllEvents
}