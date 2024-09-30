//const { get } = require("../routes/new.registration.routes");

const activeEvent = "select event_id, event_name from event_info where event_status='active' ";
const updateRegistrant= `update registrant_info set emergency_contact_name=?, emergency_contact_number=?, resident_of_apr=?, address_type=?, 
                        addr_villa_number=?, addr_villa_lane_no=?, addr_villa_phase_no=?, addr_tower_no=?,addr_tower_block_no=?, 
                        addr_tower_flat_no=?, external_address=?,city=?,state=?,country=?, pin_code=?, current_stage=? where registrant_id=? `
                        
const insertBooking = `insert into booking_info (registrant_id_ref, registrant_type_ref, registrant_class_ref,runner_count, event_id_ref) 
                       values(?,?,?,?,?) returning booking_id`

const addRunner = `insert into runner_info (runner_first_name, runner_last_name, registrant_id_ref, runner_gender, runner_email_id, runner_phone_number,
                   run_category_id_ref, tshirt_size, registrant_event_id_ref, booking_id_ref, runner_age_category, role, address_type,villa_number, lane_number, phase_number,tower_number, 
                   block_number, flat_number, external_address,runner_city,runner_state, runner_country,runner_pincode) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

const bookingData = `SELECT b.*, rc.category_price, rc.runners_allowed_count, CONCAT_WS(' , ' , ri.addr_villa_number, ri.addr_villa_lane_no, ri.addr_villa_phase_no, ri.addr_tower_no,ri.addr_tower_block_no, 
                     ri.addr_tower_flat_no, ri.external_address,ri.city,state,ri.country, ri.pin_code) as billing_address FROM registrant_class_info rc 
                     JOIN booking_info b ON b.registrant_class_ref = rc.registrant_class_category_id_ref
                     JOIN registrant_info ri ON ri.registrant_id = b.registrant_id_ref
                      AND rc.event_id_ref = b.event_id_ref WHERE b.booking_id =?   `;

const createOrder = `INSERT INTO order_info (order_id, registrant_class_ref, event_id_ref, registrant_id_ref, runner_count, booking_id_ref, billing_address,
                     total_amount, order_status) VALUES (?,?,?,?,?,?,?,?, 'payment pending') returning created_at, total_amount, order_status`

const updateStage = "update registrant_info set current_stage=? where registrant_id=?";

const getRunner= "select runner_id from runner_info where booking_id_ref =?"

const activeEventwithBooking =`SELECT 
    b.*, 
    e.event_id, 
    e.event_name 
FROM 
    booking_info b
JOIN 
    event_info e 
ON 
    b.event_id_ref = e.event_id 
WHERE 
    e.event_status = 'active' 
    AND b.booking_id = ?
`; 

const fetchEventData = `SELECT  e.*,  r.first_name, r.last_name, r.email_id,  r.mobile_number, r.emergency_contact_name, r.emergency_contact_number, 
                        r.address_type,  r.addr_villa_number, r.addr_villa_lane_no, r.addr_villa_phase_no,  r.addr_tower_no,
                        r.addr_tower_block_no, r.addr_tower_flat_no,   r.external_address, r.city, r.state, r.country, r.pin_code, 
                        r.current_stage FROM event_info e CROSS JOIN     registrant_info r WHERE  e.event_status = 'active'  AND r.registrant_id = ?`

const reg_type_data = `SELECT  rt.type_id,  rt.type_name, rt.image_url, rcc.category_id,  rcc.category_name, rc.category_price, rc.runners_allowed_count 
                       FROM registrant_type_info rt JOIN    registrant_class_info rc ON  rt.type_id = rc.registrant_type_id_ref JOIN registrant_class_category_info 
                       rcc ON  rcc.category_id = rc.registrant_class_category_id_ref WHERE rc.event_id_ref = ?  AND rt.type_id = ? AND rcc.available_event='true'`

//const race_timing = `select race.race_type_id, race.race_type_name, rtg.tace_time,  `
const getRegistrant = "select * from registrant_info where registrant_id =?"
module.exports={
    activeEvent,
    updateRegistrant,
    insertBooking,
    addRunner,
    bookingData,
    createOrder,
    updateStage,
    getRunner,
    fetchEventData,
    reg_type_data,
    getRegistrant
}