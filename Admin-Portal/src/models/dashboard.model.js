const sponsorlist = "select corporate_id, corp_registrant_firstname, corp_registrant_lastname, corp_company_name, sponsorship_category, sponsorship_amount," +
    "corp_company_description, corp_company_logo from corporate_sponsor_info where event_id_ref=?";

const sponsorCount = "select count(*) from corporate_sponsor_info where event_id_ref=?";


const paidRegistrant = "select * from order_info where order_status='success' and registrant_id_ref NOTNULL and event_id_ref=?";

const runnerCountAsOfOrderId = " select count(*) as runner_count from runner_info where booking_id_ref =?";

const runnerCount = "select count(*) as villa_runner from runner_info where booking_id_ref=? "

const corpRunCount = "select count(*) as toal_corp_runner_count from runner_info where runner_payment_status ='paid by corporate' and registrant_event_id_ref=?";

const villaReg = "select * from registrant_info where address_type='villa' and registrant_id =?";

const towerReg = "select * from registrant_info where address_type='tower' and registrant_id =?";

const totalRunner = "select count(*) as run_count from runner_info where (runner_payment_status = 'paid' or runner_payment_status='paid by corporate') and registrant_event_id_ref =?";

const runTypeInfo = "select race_type_id, race_type_name from race_category_info ";

const raceRunCount = "select count(*) as run_count from runner_info where run_category_id_ref =? and (runner_payment_status='paid' or runner_payment_status ='paid by corporate') and registrant_event_id_ref=? and registrant_id_ref notnull";

const tshirtCount = "select count(*) as shirt_count from runner_info where registrant_event_id_ref=? and tshirt_size =? and (runner_payment_status ='paid' or runner_payment_status='paid by corporate') and registrant_id_ref notnull";

const genderCount = "select count(*) as gen_count from runner_info where runner_gender=? and registrant_event_id_ref=? and (runner_payment_status ='paid' or runner_payment_status='paid by corporate') and registrant_id_ref notnull";

const ageCat = "select age_type_id, age_type_name from age_category_info ";

const ageRunCount = "select count(*) as run_count from runner_info where registrant_event_id_ref =? and registrant_id_ref notnull and age_type_id_ref=? and (runner_payment_status ='paid' or runner_payment_status='paid by corporate')"

const villaPhaseReg = "select * from registrant_info where address_type='villa' and registrant_id =? and addr_villa_phase_no=?"

const towerRegInfo = "select * from registrant_info where address_type='tower' and registrant_id =? and addr_tower_no=?";

const villaRunner = "select count(*) as villa_runner from runner_info where booking_id_ref=?";

const towerRunner = "select count(*) as tower_runner from runner_info where booking_id_ref=?";

const registrantType = "select type_id , type_name from registrant_type_info ";

const regDetails = "select registrant_id, registrant_type_ref from registrant_info where registrant_id=?";

const typeInBooking = "select registrant_type_ref from booking_info where booking_id=?";

const runCount = "select count(*) as runner_count from runner_info  where booking_id_ref=?";

const corpRunnerCount = "select count(*) as corp_runner from runner_info where registrant_event_id_ref=?  and runner_payment_status='paid by corporate'";

const totalAmount = "select sum(total_amount) from order_info where order_status='success'  and event_id_ref=?";

const totalSponsorAmount = "select sum(sponsorship_amount)::int as total_sponsor_amount from corporate_sponsor_info where event_id_ref=?";

const registrant = "select count(*) as registrant_count from registrant_info";
//-------------------------------laksh-----------------------------
const totalWholeRegistrantCountbyAddressType = "SELECT COUNT(registrant_id) AS total_registrant_count,SUM(CASE WHEN address_type = 'villa' THEN 1 ELSE 0 END) AS total_villa_registrant_count,SUM(CASE WHEN address_type = 'tower' THEN 1 ELSE 0 END) AS total_tower_registrant_count,SUM(CASE WHEN address_type = 'others' THEN 1 ELSE 0 END) AS total_other_registrant_count FROM registrant_info WHERE registrant_status = 'active' and role='registrant';"



const totalRunnerCountbyAddressType = "SELECT total_runner_count,total_villa_runner_count,total_tower_runner_count,total_other_runner_count FROM (SELECT COUNT(ot.runner_id) AS total_runner_count,COUNT(CASE WHEN ri.address_type = 'villa' THEN 1 END) AS total_villa_runner_count,COUNT(CASE WHEN ri.address_type = 'tower' THEN 1 END) AS total_tower_runner_count,COUNT(CASE WHEN ri.address_type = 'others' THEN 1 END) AS total_other_runner_count FROM registrant_info ri LEFT JOIN runner_info ot ON ri.registrant_id = ot.registrant_id_ref WHERE ot.runner_payment_status = 'paid' AND ot.registrant_id_ref IS NOT NULL AND ot.registrant_event_id_ref = ? ) AS combined_counts";

const towerBlocksCount = "SELECT addr_tower_no, addr_tower_block_no, COUNT(*) AS towers_block_count FROM registrant_info ri join runner_info ot ON ot.registrant_id_ref=ri.registrant_id WHERE ri.address_type = 'tower' AND ri.registrant_status = 'active'and ot.runner_payment_status='paid'and ot.registrant_id_ref notnull and ot.registrant_event_id_ref=? GROUP BY ri.addr_tower_no, ri.addr_tower_block_no";
const totalTowerBlockDetails = "SELECT DISTINCT t.block_number,v.tower_name FROM tower_info t JOIN LATERAL (VALUES ('tower_1', t.tower_1),('tower_2', t.tower_2),('tower_3', t.tower_3),('tower_4', t.tower_4),('tower_5', t.tower_5),('tower_6', t.tower_6),('tower_7', t.tower_7)) v(tower_name, tower_value) ON v.tower_value = true ORDER BY tower_name, block_number";
//-------------------------------laksh--------------------------

const getCorporateRegistrantCount = "select count(registrant_id) as corporateregistrant_count from registrant_info where registrant_status='active' and role='corporate registrant'";

const paymentStatus ="select * from order_info where order_status ='success' and registrant_id_ref=? and event_id_ref=? limit 1";

const getRegistrants= "select registrant_id,address_type from registrant_info  ";

const orderInfo = "select order_id from order_info where event_id_ref=?";

const paymentAmount="select payment_amount, payment_status from payment_info where payment_status='success' and order_id_ref=? limit 1";

//Rishi added these on 13/3/24
const corporateRunnersCount = "select count(*) as corporateregistrant_count from runner_info where runner_payment_status='paid by corporate' and registrant_event_id_ref=?"
const runnerCoutCategorical = "select count(case when fi.registrant_type_ref=1 then 1 end) as marathon_runner,count(case when fi.registrant_type_ref=2 then 1 end) as donor_with_runner from runner_info ri left join (select oi.booking_id_ref, bi.registrant_type_ref from order_info oi left join booking_info bi on oi.booking_id_ref=bi.booking_id where oi.order_status = 'success' and oi.registrant_id_ref notnull and oi.event_id_ref=?) fi on ri.booking_id_ref=fi.booking_id_ref"
const donateRunner = "select count(case when bi.registrant_type_ref=3 then 1 end)::int as donate from order_info oi left join booking_info bi on oi.booking_id_ref=bi.booking_id where oi.order_status = 'success' and oi.registrant_id_ref notnull and oi.event_id_ref=?";

// addded by ramanan
const getActiveEventId = "select event_id from event_info where event_status='active'";

const getRunnerOneKCount = "select count(*) as run_count from runner_info where run_category_id_ref = 13 and (runner_payment_status='paid' or runner_payment_status ='paid by corporate') and registrant_event_id_ref=? and registrant_id_ref notnull"
const getRunnerFiveKCount = "select count(*) as run_count from runner_info where run_category_id_ref = 14 and (runner_payment_status='paid' or runner_payment_status ='paid by corporate') and registrant_event_id_ref=? and registrant_id_ref notnull"
const getRunnerTenKCount = "select count(*) as run_count from runner_info where run_category_id_ref = 15 and (runner_payment_status='paid' or runner_payment_status ='paid by corporate') and registrant_event_id_ref=? and registrant_id_ref notnull"

const getTshirtCountByEventId = `select 
sum(case when tshirt_size ='xs' then 1 else 0 end)::int as xs_shirt_count,
sum(case when tshirt_size ='s' then 1 else 0 end)::int as s_shirt_count,
sum(case when tshirt_size ='m' then 1 else 0 end)::int as m_shirt_count,
sum(case when tshirt_size ='l' then 1 else 0 end)::int as l_shirt_count,
sum(case when tshirt_size ='xl' then 1 else 0 end)::int as xl_shirt_count,
sum(case when tshirt_size ='xxl' then 1 else 0 end)::int as xxl_shirt_count,
sum(case when tshirt_size ='xxxl' then 1 else 0 end)::int as xxxl_shirt_count,
sum(case when run_category_id_ref = 13 then 1 else 0 end)::int as runner_1k_count,
sum(case when run_category_id_ref = 14 then 1 else 0 end)::int as runner_5k_count,
sum(case when run_category_id_ref = 15 then 1 else 0 end)::int as runner_10k_count,
sum(case when runner_gender ='male' then 1 else 0 end)::int as male_runner_count,
sum(case when runner_gender ='female' then 1 else 0 end)::int as female_runner_count
from runner_info where registrant_event_id_ref=? and (runner_payment_status ='paid' or runner_payment_status='paid by corporate') and registrant_id_ref notnull`

const getRunnerCountByAge = `select 
age_type_id, age_type_name, (case when t2.runner_count is null then 0 else t2.runner_count end)::int as run_count,
(select count(*) from runner_info 
where registrant_event_id_ref=? and age_type_id_ref notnull and registrant_id_ref notnull and (runner_payment_status ='paid' or runner_payment_status='paid by corporate'))::int as total 
from age_category_info left join 
(select age_type_id_ref, count(*) as runner_count from runner_info where registrant_event_id_ref=? and registrant_id_ref notnull and (runner_payment_status ='paid' or runner_payment_status='paid by corporate') group by age_type_id_ref) as t2 
on age_category_info.age_type_id=t2.age_type_id_ref`;

const overAllRegistrantsCount = `select 
count(*)::int as total_registrant_count, 
count(case when address_type='villa' then 1 end)::int as total_villa_registrant_count, 
count(case when address_type='tower' then 1 end)::int as total_tower_registrant_count, 
count(case when address_type='others' then 1 end)::int as total_other_registrant_count,
count(case when registrant_status='active' and role='corporate registrant' then 1 end)::int as corporate_registrant_count 
from registrant_info`

const overAllPaidRegistrantCount = `select 
count(ri.*)::int as total_paid_registrant_count, 
count(case when ri.address_type='villa' then 1 end)::int as total_paid_villa_registrant_count, 
count(case when ri.address_type='tower' then 1 end)::int as total_paid_tower_registrant_count, 
count(case when ri.address_type='others' then 1 end)::int as total_paid_other_registrant_count 
from registrant_info ri join (select bi.registrant_id_ref from order_info oi inner join booking_info bi on oi.booking_id_ref=bi.booking_id where oi.order_status='success' and bi.event_id_ref=? and bi.registrant_id_ref notnull) di on ri.registrant_id=di.registrant_id_ref`

const getRunnerCountByCategory = `select
sum(case when bi.registrant_type_ref=1 and ri.runner_payment_status='paid' then 1 else 0 end)::int as marathon_runners,
sum(case when bi.registrant_type_ref=2 and ri.runner_payment_status='paid' then 1 else 0 end)::int as donor_with_runners,
sum(case when ri.runner_payment_status='paid by corporate' then 1 else 0 end)::int as corporate_runners
from runner_info ri 
LEFT JOIN booking_info bi ON ri.booking_id_ref=bi.booking_id 
where ri.registrant_event_id_ref=?`

const getTotalAmountFromRegistration = `select sum(payment_amount)::int as total_amount from payment_info where event_id_ref=? and payment_status='success'`

const totalRunnerCount = `select
sum(case when runner_payment_status='paid' or runner_payment_status='paid by corporate' then 1 else 0 end)::int as total_runner_count,
sum(case when runner_payment_status='paid by corporate' then 1 else 0 end)::int as total_corp_runner_count,
sum(case when runner_address_type='tower' and (runner_payment_status='paid' or runner_payment_status='paid by corporate') then 1 else 0 end)::int as total_tower_runner_count,
sum(case when runner_address_type='villa' and (runner_payment_status='paid' or runner_payment_status='paid by corporate') then 1 else 0 end)::int as total_villa_runner_count,
sum(case when runner_address_type='others' and (runner_payment_status='paid' or runner_payment_status='paid by corporate') then 1 else 0 end)::int as total_other_runner_count
from runner_info
where registrant_event_id_ref=?`

const getVillaCountGraph = `SELECT
sum(case when runner_address_type='villa' and phase_number='1' then 1 else 0 end)::int as phase1_count,
sum(case when runner_address_type='villa' and phase_number='2' then 1 else 0 end)::int as phase2_count,
sum(case when runner_address_type='villa' and phase_number='3' then 1 else 0 end)::int as phase3_count,
sum(case when runner_address_type='villa' then 1 else 0 end)::int as total_villa_count
from runner_info where registrant_event_id_ref=? and (runner_payment_status ='paid' or runner_payment_status='paid by corporate') and registrant_id_ref notnull`

const getTowerBlockCount = `SELECT tower_number, block_number, COUNT(*) AS block_count
FROM runner_info
WHERE runner_address_type = 'tower' and (runner_payment_status='paid' or runner_payment_status='paid by corporate') and registrant_id_ref notnull and registrant_event_id_ref=?
GROUP BY tower_number, block_number
ORDER BY tower_number, block_number;`

module.exports = {
    paymentAmount,
    orderInfo,
    getRegistrants,
    paymentStatus,
    getCorporateRegistrantCount,
    registrant,

    totalSponsorAmount,
    totalAmount,
    sponsorlist,
    paidRegistrant,
    runnerCountAsOfOrderId,
    corpRunCount,
    villaReg,
    runnerCount,
    towerReg,
    totalRunner,
    runTypeInfo,
    raceRunCount,
    tshirtCount,
    genderCount,
    ageCat,
    ageRunCount,
    villaPhaseReg,
    towerRegInfo,
    villaRunner,
    towerRunner,
    registrantType,
    regDetails,
    typeInBooking,
    runCount,
    corpRunnerCount,
    //laksh
    totalRunnerCountbyAddressType,
    totalWholeRegistrantCountbyAddressType,
    towerBlocksCount,
    totalTowerBlockDetails,
    //laksh

    //Rishi
    overAllPaidRegistrantCount,
    overAllRegistrantsCount,
    corporateRunnersCount,
    runnerCoutCategorical,
    donateRunner,

    //ram
    getActiveEventId,
    getRunnerOneKCount,
    getRunnerFiveKCount,
    getRunnerTenKCount,
    getTshirtCountByEventId,
    getRunnerCountByAge,
    getRunnerCountByCategory,
    getTotalAmountFromRegistration,
    sponsorCount,
    totalRunnerCount,
    getVillaCountGraph,
    getTowerBlockCount
}