const corporateSponsor = "select corporate_id,corp_registrant_firstname, corp_registrant_lastname,corp_registrant_mob_number,corp_company_name,corp_registrant_mailid," +
    "corp_company_description, corp_company_logo,resident_of_apr,CONCAT_WS(corp_address_type,corp_addr_villa_number,corp_addr_villa_lane_no, corp_addr_villa_phase_no,corp_addr_tower_no," +
    "corp_addr_tower_block_no, corp_addr_tower_flat_no, corp_external_address,city,state,country,zipcode) as corp_address" +
    "sponsorship_category,sponsorship_amount,number_of_passes,payment_ref_number,payment_ref_date,corporate_runner_count, corp_code, created_by from corporate_sponsor_info where event_id_ref=?";

const regType = "select type_id, type_name from registrant_type_info where type_name=?";

const getRegList = "select registrant_id,first_name,middle_name, last_name,email_id, mobile_number, CONCAT_WS(',',address_type,addr_villa_number, addr_villa_lane_no, addr_villa_phase_no, addr_tower_no, addr_tower_block_no, addr_tower_flat_no,external_address,city,state,country,pin_code) as address, pancard_number," +
    "role from registrant_info where registrant_id =?";
//-- Removed by Rishi on 11/3/24

//Added by Rishi on 11/3/24 -- changed registrant data to runner data
const getRunners = "select rci.race_type_name, dii.* from race_category_info rci left join" + 
" (select ai.age_type_name, di.* from age_category_info ai left join" + 
" (select ri.* from runner_info ri right join (select oi.booking_id_ref, bi.registrant_type_ref from order_info oi left join" + 
" booking_info bi on oi.booking_id_ref=bi.booking_id where bi.registrant_type_ref=? and oi.order_status = 'success' and" + 
" oi.registrant_id_ref notnull and oi.event_id_ref=?) fi on ri.booking_id_ref=fi.booking_id_ref) di on ai.age_type_id" + 
" = di.age_type_id_ref) dii on rci.race_type_id = dii.run_category_id_ref"

const getOverAll = "select dii.*, rui.* from runner_info rui join" + 
" (select rei.*, di.booking_id_ref from registrant_info rei right join (select oi.registrant_id_ref," + 
" oi.booking_id_ref, bi.registrant_type_ref from order_info oi left join booking_info bi on oi.booking_id_ref="+
"bi.booking_id where oi.order_status = 'success' and oi.registrant_id_ref notnull and oi.event_id_ref=?) di on "+
"rei.registrant_id=di.registrant_id_ref) dii on rui.booking_id_ref=dii.booking_id_ref"
//const getRegList = "select * from runner_info where booking_id_ref=?"

const getDonorCount = "select ri.registrant_id,ri.first_name,ri.middle_name, ri.last_name,ri.email_id, ri.mobile_number, CONCAT_WS(',',ri.address_type,ri.addr_villa_number, ri.addr_villa_lane_no, ri.addr_villa_phase_no, ri.addr_tower_no, ri.addr_tower_block_no, ri.addr_tower_flat_no,ri.external_address,ri.city,ri.state,ri.country,ri.pin_code) as address, ri.pancard_number from registrant_info ri join (select bi.registrant_id_ref from order_info oi inner join booking_info bi on oi.booking_id_ref=bi.booking_id where bi.registrant_type_ref=3 and oi.order_status='success' and bi.event_id_ref=? and bi.registrant_id_ref notnull) di on ri.registrant_id=di.registrant_id_ref"

const getrunners = "select * from runner_info where registrant_event_id_ref=? and (runner_payment_status= 'paid' or runner_payment_status = 'paid by corporate')";

const paidRegId = "select * from order_info where order_status='success' and event_id_ref=?";

const bookingList = "select * from booking_info where booking_id=? and registrant_type_ref=?";

const getRegClass = "select category_id, category_name from registrant_class_category_info where category_id=? " 
//-- Removed by Rishi on 11/3/24
//Added by Rishi on 11/3/24 -- changed registrant data to runner data
const getRunClass = "select race_type_id, race_type_name from race_category_info where race_type_id=?"
const getRunAgeClass = "select age_type_id, age_type_name from age_category_info where age_type_id=?"

const getRunCat = "select race_type_id, race_type_name from race_category_info where race_type_id=?";

const runnerCount = "select * from runner_info where booking_id_ref=?";

const corpCount = "select *  from corporate_sponsor_info where event_id_ref=?";

const corpRunnerCount = "select * from runner_info where runner_payment_status ='paid by corporate' and registrant_event_id_ref=?";

const tshirtCount = "select * from runner_info where booking_id_ref=? and tshirt_size=?";

const corpTshirtCount = "select * from runner_info where runner_payment_status='paid by corporate' and registrant_event_id_ref=? and tshirt_size=?"

const runCat = "select race_type_id, race_type_name from race_category_info ";

const runCatCount = "select * from runner_info where booking_id_ref =? and run_category_id_ref=?";

const corpRunCatCount = "select * from runner_info where corporate_sponsor_id_ref=? and run_category_id_ref=?";

const regAddrType = "select * from registrant_info where registrant_id=? and address_type=?";

const villaRunners = "select * from runner_info where booking_id_ref=?";

const regAddrTower = "select * from registrant_info where registrant_id=? and address_type=? and addr_tower_no=?"

const addDownloadData = "insert into report_history (report_type, downloaded_by,download_date, event_id_ref) values(?, ?, ?, ?)";

const reportsHistory = "select * from report_history where event_id_ref=?";

const activeEvent = "select * from event_info where event_status='active'";
//------------------------------laksh---------------------
const registrantWithRunnerCount = "SELECT ri.registrant_id_ref, COUNT(ri.runner_id) AS runner_count FROM runner_info ri JOIN registrant_info ot ON ri.registrant_id_ref = ot.registrant_id WHERE ri.bib_number IS NOT NULL AND ri.runner_payment_status = 'paid' AND ot.registrant_status = 'active' AND ri.registrant_event_id_ref=3 AND ri.registrant_id_ref notnull GROUP BY ri.registrant_id_ref;"
// address added by suganthi
const registrantDetailsForReport = "SELECT registrant_id,CONCAT(first_name, ' ',middle_name,' ', last_name)as registrant_name,email_id,mobile_number,address_type,addr_villa_number, addr_villa_lane_no, addr_villa_phase_no, addr_tower_no, addr_tower_block_no, addr_tower_flat_no,external_address,city,state,country,pin_code  FROM registrant_info WHERE registrant_id=? AND registrant_status='active'";
//bib_number added by sugan
const getTshirtsizeForReport = "SELECT tshirt_size,registrant_id_ref,runner_id,CONCAT(runner_first_name, ' ', runner_last_name)as runner_name, bib_number FROM runner_info WHERE registrant_id_ref=? and runner_payment_status='paid' "
const getRunnerTypeBookingId = "select runner_id, registrant_id_ref, booking_id_ref from runner_info ri JOIN registrant_info ot ON ri.registrant_id_ref = ot.registrant_id WHERE ri.bib_number IS NOT NULL AND ri.runner_payment_status = 'paid' AND ot.registrant_status = 'active' AND ri.registrant_event_id_ref=3 AND ri.registrant_id_ref notnull ";
const getRunnerTypeValues = "select registrant_type_ref , ot.type_name ,ri.booking_id,ri.registrant_id_ref from booking_info ri join registrant_type_info ot on ri.registrant_type_ref = ot.type_id where ri.event_id_ref=3 and ri.booking_id=?"
//------------------------------laksh---------------------
//const paidRunner = "select runner_first_name, runner_last_name, run_category_id_ref, age_type_id_ref, runner_phone_number, runner_gender, bib_number, tshirt_size from runner_info where (runner_payment_status='paid' or runner_payment_status='paid by corporate') and registrant_event_id_ref=? "

const paidRunner = "select ri.runner_first_name, ri.runner_last_name,ri.registrant_id_ref, ri.run_category_id_ref, ri.age_type_id_ref," +
    "ri.runner_phone_number, ri.runner_gender, ri.bib_number, ri.tshirt_size,ri.runner_payment_status,ri.corporate_sponsor_id_ref, bi.registrant_type_ref from runner_info ri LEFT JOIN booking_info bi ON  " +
    "ri.booking_id_ref=bi.booking_id  where (ri.runner_payment_status='paid' or ri.runner_payment_status='paid by corporate') and ri.registrant_event_id_ref=?";

    const paidRunners = "select ri.runner_first_name, ri.runner_last_name,ri.registrant_id_ref, ri.run_category_id_ref, ri.age_type_id_ref," +
    "ri.runner_phone_number, ri.runner_gender, ri.bib_number, ri.tshirt_size,ri.runner_payment_status,ri.corporate_sponsor_id_ref, bi.registrant_type_ref, ri.runner_address from runner_info ri LEFT JOIN booking_info bi ON  " +
    "ri.booking_id_ref=bi.booking_id  where (ri.runner_payment_status='paid' or ri.runner_payment_status='paid by corporate') and ri.registrant_event_id_ref=?";


    const ageType = "select age_type_id, age_type_name from age_category_info ";

const runType = "select race_type_id, race_type_name from race_category_info";

const regTypes = "select type_id , type_name from registrant_type_info";

const corporateName = "select corp_company_name from corporate_sponsor_info where corporate_id=?";

const regName="select first_name as registrant_firstname, last_name as registrant_lastname, address_type, addr_villa_number,addr_villa_lane_no, addr_villa_phase_no, addr_tower_no, addr_tower_block_no, addr_tower_flat_no,city,state,country,pin_code,external_address from registrant_info where registrant_id=?";

//Rishi added on 11/3/24

const groupedCountSummary = "select rti.type_name as registrant_type, dii.* from registrant_type_info "+
"rti left join (select di.registrant_type_ref, count(ri.*), count(case when tshirt_size='xs' then 1 end) as xs_tshirt, count"+
"(case when tshirt_size='s' then 1 end) as s_tshirt, count(case when tshirt_size='m' then 1 end) as m_tshirt, count(case when "+
"tshirt_size='l' then 1 end) as l_tshirt, count(case when tshirt_size='xl' then 1 end) as xl_tshirt, count(case when tshirt_size='xxl' "
+"then 1 end) as xxl_tshirt, count(case when tshirt_size='xxxl' then 1 end) as xxxl_tshirt, count(case when run_category_id_ref=13 "+
"then 1 end) as race_category_1k, count(case when run_category_id_ref=14 then 1 end) as race_category_5k, "+
"count(case when run_category_id_ref=15 then 1 end) as race_category_10k, count(case when runner_address like 'Tower 1%' then 1 end) "+
"as tower_1, count(case when runner_address like 'Tower 2%' then 1 end) as tower_2, count(case when runner_address like 'Tower 3%' "+
"then 1 end) as tower_3, count(case when runner_address like 'Tower 4%' then 1 end) as tower_4, count(case when runner_address like "+
"'Tower 5%' then 1 end) as tower_5, count(case when runner_address like 'Tower 6%' then 1 end) as tower_6, count(case when "+
"runner_address like 'Tower 7%' then 1 end) as tower_7, count(case when runner_address like 'villa%' then 1 end) as villa "+
"from runner_info ri right join (select oi.booking_id_ref, bi.registrant_type_ref from order_info oi left join booking_info bi "+
"on oi.booking_id_ref=bi.booking_id where oi.order_status = 'success' and oi.registrant_id_ref notnull and oi.event_id_ref=?) di "+
"on ri.booking_id_ref=di.booking_id_ref group by di.registrant_type_ref) dii on rti.type_id=dii.registrant_type_ref";

const ungroupedCountSummary = `select 
count(ri.*), 
count(case when tshirt_size='xs' then 1 end) as xs_tshirt, 
count(case when tshirt_size='s' then 1 end) as s_tshirt, 
count(case when tshirt_size='m' then 1 end) as m_tshirt, 
count(case when tshirt_size='l' then 1 end) as l_tshirt, 
count(case when tshirt_size='xl' then 1 end) as xl_tshirt, 
count(case when tshirt_size='xxl' then 1 end) as xxl_tshirt, 
count(case when tshirt_size='xxxl' then 1 end) as xxxl_tshirt, 
count(case when run_category_id_ref=13 then 1 end) as race_category_1k, 
count(case when run_category_id_ref=14 then 1 end) as race_category_5k, 
count(case when run_category_id_ref=15 then 1 end) as race_category_10k, 
count(case when tower_number like 'Tower 1%' then 1 end) as tower_1, 
count(case when tower_number like 'Tower 2%' then 1 end) as tower_2, 
count(case when tower_number like 'Tower 3%' then 1 end) as tower_3, 
count(case when tower_number like 'Tower 4%' then 1 end) as tower_4, 
count(case when tower_number like 'Tower 5%' then 1 end) as tower_5, 
count(case when tower_number like 'Tower 6%' then 1 end) as tower_6, 
count(case when tower_number like 'Tower 7%' then 1 end) as tower_7, 
count(case when runner_address_type like 'villa%' then 1 end) as villa 
from runner_info ri right join (select oi.booking_id_ref, bi.registrant_type_ref from order_info oi left join booking_info bi on oi.booking_id_ref=bi.booking_id where oi.order_status = 'success' and oi.registrant_id_ref notnull and oi.event_id_ref=?) di on ri.booking_id_ref=di.booking_id_ref`;

const corpRunnerCountSummary = "select count(ri.*), count(case when tshirt_size='xs' then 1 end) as xs_tshirt, count(case when tshirt_size='s' then 1 end) as s_tshirt, count(case when tshirt_size='m' then 1 end) as m_tshirt, count(case when tshirt_size='l' then 1 end) as l_tshirt, count(case when tshirt_size='xl' then 1 end) as xl_tshirt, count(case when tshirt_size='xxl' then 1 end) as xxl_tshirt, count(case when tshirt_size='xxxl' then 1 end) as xxxl_tshirt, count(case when run_category_id_ref=13 then 1 end) as race_category_1k, count(case when run_category_id_ref=14 then 1 end) as race_category_5k, count(case when run_category_id_ref=15 then 1 end) as race_category_10k, count(case when runner_address like 'Tower 1%' then 1 end) as tower_1, count(case when runner_address like 'Tower 2%' then 1 end) as tower_2, count(case when runner_address like 'Tower 3%' then 1 end) as tower_3, count(case when runner_address like 'Tower 4%' then 1 end) as tower_4, count(case when runner_address like 'Tower 5%' then 1 end) as tower_5, count(case when runner_address like 'Tower 6%' then 1 end) as tower_6, count(case when runner_address like 'Tower 7%' then 1 end) as tower_7, count(case when runner_address like 'villa%' then 1 end) as villa from runner_info ri where runner_payment_status != 'paid' and runner_payment_status notnull and registrant_event_id_ref=?";
const bib_v1 = "select diiii.*, rt.type_name from (select diii.*, rc.race_type_name from (select dii.*,ai.age_type_name from (select di.*, bi.registrant_type_ref from (select ru.runner_first_name, ru.runner_last_name, ru.registrant_id_ref, ru.run_category_id_ref, ru.age_type_id_ref, ru.runner_phone_number, ru.runner_gender, ru.bib_number, ru.tshirt_size, ru.runner_payment_status, ru.corporate_sponsor_id_ref, ru.booking_id_ref, ri.first_name as registrant_firstname, ri.last_name as registrant_lastname, ri.address_type, ri.addr_villa_number, ri.addr_villa_lane_no, ri.addr_villa_phase_no, ri.addr_tower_no, ri.addr_tower_block_no, ri.addr_tower_flat_no, ri.city, ri.state, ri.country, ri.pin_code, ri.external_address from runner_info ru left join registrant_info ri on ru.registrant_id_ref=ri.registrant_id where ru.runner_payment_status='paid' and ri.registrant_status='active' and ru.registrant_event_id_ref=?) di left join booking_info bi on bi.booking_id = di.booking_id_ref) dii left join age_category_info ai on dii.age_type_id_ref = ai.age_type_id) diii left join race_category_info rc on diii.run_category_id_ref = rc.race_type_id) diiii left join registrant_type_info rt on diiii.registrant_type_ref = rt.type_id;";


module.exports = {
    paidRunners,
    regName,
    corporateName,
    regTypes,
    ageType,
    runType,
    paidRunner,
    activeEvent,
    reportsHistory,
    addDownloadData,
    corporateSponsor,
    paidRegId,
    getRegList,
    getrunners,
    bookingList,
    getRegClass,
    regType,
    getRunCat,
    runnerCount,
    corpCount,
    corpRunnerCount,
    tshirtCount,
    corpTshirtCount,
    runCat,
    runCatCount,
    corpRunCatCount,
    regAddrType,
    villaRunners,
    regAddrTower,
    //laksh
    registrantWithRunnerCount,
    registrantDetailsForReport,
    getTshirtsizeForReport,
    getRunnerTypeBookingId,
    getRunnerTypeValues,
    //laksh

    //Rishi
    getRunAgeClass,
    getRunners,
    getOverAll,
    groupedCountSummary,
    ungroupedCountSummary,
    corpRunnerCountSummary,
    getDonorCount,
    bib_v1
}                          