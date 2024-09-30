const registrantTypeId = "select type_id, type_name from registrant_type_info where type_name=?";

const registrantTypeInfo = " select * from registrant_type_info where type_id=?";

const getMinPrice = "select min(category_price) as min_price, registrant_type_id_ref from registrant_class_info where event_id_ref=? and"+
                      " registrant_type_id_ref=? GROUP BY registrant_type_id_ref "

const getRaceCategory ="SELECT * FROM race_category_info";
                    
const getAgeCategory = "SELECT * FROM age_category_info ";

const runnersCount =
  "SELECT COUNT(*) AS registrant_count FROM runner_info where registrant_event_id_ref = ? ";

const getRegistrantImage =
  "SELECT registrant_profile_image FROM registrant_info ORDER BY created_at DESC LIMIT 5";

const raceTiming = "SELECT age_type_id_ref,race_type_id_ref, event_id_ref, race_time FROM race_timing_info WHERE event_id_ref =?";

const getActiveEvetnInfo = "SELECT * FROM event_info WHERE event_status = 'active' ";

const registrantInfo ="select * from registrant_info where registrant_id=?";

const registrantClass = "SELECT registrant_type_id_ref, category_id,category_name FROM registrant_class_category_info WHERE registrant_type_id_ref =?";

const registrantSource = "SELECT source_id, source_name FROM registrant_source_info ";

const runCategory= "SELECT race_type_id, race_type_name FROM race_category_info";

const addCorpRegistrantInfo =
  "UPDATE registrant_info SET  address_type=?, addr_villa_number=?,addr_villa_lane_no=?,addr_villa_phase_no=?, addr_tower_no=?,addr_tower_block_no=?,addr_tower_flat_no=?, external_address=? ," +
  "city=?,state=?,  country=?,pin_code=?  WHERE registrant_id =?";

// const addCorpRunnerInfo =
//   "UPDATE runner_info SET  registrant_id_ref=?, runner_dob=? ,  runner_gender =?,  runner_phone_number=?, " +
//   " runner_emergency_contact_name =?, runner_emergency_contact_number=?, runner_address=?,runner_city=?, runner_state=?,runner_country=?,runner_pincode=?,"+
//   "tshirt_size=?,runner_blood_group=?,runner_age=?, age_type_id_ref=?, bib_number=?, run_category_id_ref=?,registrant_event_id_ref=?, runner_payment_status='paid by corporate'  where runner_email_id= ?";

const addCorpRunnerInfo =  "INSERT INTO runner_info (registrant_id_ref,  runner_first_name, runner_last_name, runner_dob, runner_gender, runner_email_id,  runner_phone_number, " +
"runner_emergency_contact_name, runner_emergency_contact_number,  runner_address, runner_city, runner_state,runner_country,runner_pincode,tshirt_size,runner_blood_group,runner_age, age_type_id_ref, run_category_id_ref,registrant_event_id_ref, role, bib_number, runner_payment_status, corporate_sponsor_id_ref)" +
"VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, 'corporate runner', ?, 'paid by corporate', ?)";

const ageCatId="SELECT age_type_id, age_type_name FROM age_category_info WHERE age_type_name=?";

const getCorpReg = "select * from registrant_info where registrant_id =?";

const corpName = "select * from corporate_sponsor_info where corporate_id = ?"

const raceCategory =  "SELECT race_type_name FROM race_category_info WHERE race_type_id =?";

//const runnerCountPerRace = "select count(*) from runner_info where registrant_event_id_ref=? and run_category_id_ref=? and (runner_payment_status='paid' or runner_payment_status='paid by corporate' or runner_payment_status='refunded')"


const runnerCountPerRace ="select MAX(bib_number) as max_bib_num from runner_info where registrant_event_id_ref=? and run_category_id_ref=?"+
                                "and (runner_payment_status='paid' or runner_payment_status='paid by corporate' or runner_payment_status='refunded')";
const getTowerData = "select tower_id, tower_number from tower_info where type='tower'";

const getBlockData = "select tower_id, block_number from tower_info where type='block'";

const corpRunner = "select * from runner_info where registrant_id_ref=? and runner_payment_status='paid by corporate'";
const runCat = "select race_type_id, race_type_name from race_category_info where race_type_id = ?"

const checkUnique = "select * from runner_info where bib_number=? and registrant_event_id_ref =?"
module.exports ={ 
  checkUnique,
  runCat,
  corpRunner,
    registrantTypeId,
    registrantTypeInfo,
    getMinPrice,
    getRaceCategory,
    getAgeCategory,
    raceTiming,
    runnersCount,
    getRegistrantImage,
    getActiveEvetnInfo,
    registrantInfo,
    registrantClass,
    registrantSource,
    runCategory,
    addCorpRegistrantInfo,
    addCorpRunnerInfo,
    ageCatId,
    getCorpReg,
    corpName,
    raceCategory,
    runnerCountPerRace,
    getTowerData,
    getBlockData
}