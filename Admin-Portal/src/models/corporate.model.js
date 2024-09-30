
const getCorpRunner = "select * from runner_info where registrant_event_id_ref=? and corporate_sponsor_id_ref =? and runner_payment_status='paid by corporate'";


const getEvent = "select * from event_info where event_status='active'"

const addSponsor = "insert into corporate_sponsor_info (corp_registrant_firstname,corp_registrant_lastname,corp_registrant_mob_number, "+
                    "corp_company_name, corp_registrant_mailid, corp_registrant_password,  corp_company_description,"+
                    "corp_company_logo, resident_of_apr, corp_address_type, corp_addr_villa_number,corp_addr_villa_lane_no, corp_addr_villa_phase_no, corp_addr_tower_no, corp_addr_tower_block_no,corp_addr_tower_flat_no,corp_external_address,  city, state, country, zipcode, sponsorship_category,"+
                    " sponsorship_amount, number_of_passes,payment_ref_number, payment_ref_date,event_id_ref, corp_code, corporate_runner_count,created_by, sponsor_status) "+
                    "values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?,'active')"

const checkCorpCode="select corp_code from corporate_sponsor_info where corp_code=?";

module.exports = {
    getCorpRunner,
    getEvent,
    addSponsor,
    checkCorpCode
}