const getUserByMail ="SELECT * FROM registrant_info WHERE (LOWER(email_id) =? or mobile_number=?) and registrant_status='active'";
const addUser = "INSERT INTO registrant_info (first_name, middle_name,last_name, email_id,google_id, password, mobile_number, notif_token, registrant_status, otp_verification_status, role)"
                 +" VALUES (?, ?, ?, ?, ?,?, ?,?,'active', 'false', ?)";
const addCorpUser = "INSERT INTO registrant_info (first_name, middle_name,last_name, email_id, password, mobile_number, corporate_sponsor_id_ref, role, notif_token, registrant_status)"
                 +" VALUES (?, ?, ?, ?, ?,?,?,?, ?, 'active')";
//const addCorpRunner = "INSERT INTO runner_info (runner_first_name,runner_last_name, runner_email_id,runner_phone_number, role, registrant_event_id_ref)"
//+" VALUES (?, ?, ?, ?, ?,?)";
const addCorpRunner = "INSERT INTO runner_info (runner_first_name,runner_last_name, runner_email_id,runner_phone_number, role, registrant_event_id_ref,corporate_sponsor_id_ref )"
+" VALUES (?, ?, ?, ?, ?,?, ?)";
// email updated to phone_number -- Rishi
const updateReftoken = "UPDATE registrant_info SET refresh_token =? , notif_token=? WHERE mobile_number =?";
const checkReftoken = "SELECT * FROM registrant_info WHERE refresh_token =?";
const saveOtp = "INSERT INTO otp_info (email_id, phone_number, otp) VALUES (?,?,?)";
const getOtp = "SELECT otp,email_id FROM otp_info WHERE phone_number = ? and email_id=? ORDER BY created_at DESC LIMIT 1";
// email updated to phone_number -- Rishi
const getOtp1 ="SELECT otp,email_id,phone_number FROM otp_info WHERE phone_number = ? ORDER BY created_at DESC LIMIT 1";
const otpStatus =" update registrant_info set otp_verification_status = 'false' where LOWER(email_id)=?";
//Rishi
const otpResendStatus =" update registrant_info set otp_verification_status = 'false' where mobile_number=?";
const getUserByGoogleId = "SELECT * FROM registrant_info WHERE google_id = ?";
const addMobileToUser = "UPDATE registrant_info SET mobile_number=? , notif_token=? WHERE LOWER(email_id)=? ";
const addGoogleUsersLogin ="INSERT INTO google_users_login (google_id, display_name, email) VALUES (?, ?, ?) RETURNING *";
const addGoogleUsers = "INSERT INTO registrant_info ( first_name, email_id, google_id, registrant_status) VALUES (?, ?, ?, 'active') RETURNING *";
const getCorporateCode= "SELECT * FROM corporate_sponsor_info WHERE corp_code =? and event_id_ref=? and sponsor_status='active'"
const increaseRunnerCount = "UPDATE corporate_sponsor_info SET corporate_runner_count=? WHERE corporate_id=?";
const eventInfo = "select * from event_info where event_status = 'active'";
const regInfo = "select * from registrant_info where mobile_number=?";
const getCorp= "select corporate_id, corp_registrant_firstname, corp_registrant_lastname, corp_registrant_password, refresh_token, access_token, event_id_ref  from corporate_sponsor_info where LOWER(corp_registrant_mailid) =? and event_id_ref=? and sponsor_status='active'"
const updateCorpRefreshToken = "update corporate_sponsor_info set refresh_token = ? , corp_notif_token=? where corp_registrant_mailid =?";
const checkSponsorReftoken  = "select * from corporate_sponsor_info where refresh_token=? ";
const updateOtpStatus = " update registrant_info set otp_verification_status = 'true', notif_token=? where mobile_number=?";
const updatePassword =  "update registrant_info set password=? where LOWER(email_id)=?";
const getActiveEvent= "select * from event_info where event_status='active' ";
const updateUserId = "update registrant_info set reg_payment_user_id = ? where registrant_id=?"
const addExistingUser = "insert into registrant_info  (first_name, middle_name, last_name, email_id, password, mobile_number, registrant_status)  values(?, ?, ?, ?, ?, ?, 'active')"
const otpVerifyStatus = "select * from registrant_info where otp_verification_status = 'true' and LOWER(email_id)=? "
const updateImage= "update registrant_info set registrant_profile_image =? where registrant_id=?"
const getUser =  "select * from registrant_info where existing_user='true'";
const updateUserPassword = "update registrant_info set password=? , registrant_status='active' where registrant_id=?";
const getUserByMobile =  "select * from registrant_info where mobile_number=? and registrant_status='active'";
const deleteAccount = "update registrant_info set registrant_status ='deleted' where registrant_id =?";
const checkUser = "select * from registrant_info where email_id =? and registrant_status ='deleted'";
const noOtpAttempt = "select count(*) from otp_info where phone_number=?";
const checkOrder = "select * from order_info where order_status='success' and registrant_id_ref=? and event_id_ref=?";
const checkCorpOrder = "select * from runner_info where  ( runner_payment_status='paid' or runner_payment_status='paid by corporate') and registrant_id_ref=? and registrant_event_id_ref=?";
//added by Rishi

const checkEmandMob = "select * from registrant_info where LOWER(email_id)=? and mobile_number=?";
const checkNwMob = "select * from registrant_info where mobile_number=?";
const updateMobileNumber = 'update registrant_info set mobile_number=? where LOWER(email_id)=? and mobile_number=?';
module.exports = {
    checkOrder,
    checkCorpOrder,
    noOtpAttempt,
    checkUser,
    deleteAccount,
    getUserByMobile,
    updateUserPassword,
    getUser,
    otpVerifyStatus,
    getUserByMail,
    addUser,
    updateReftoken,
    checkReftoken,
    saveOtp,
    getOtp,
    getOtp1,
    getUserByGoogleId,
    addMobileToUser,
    addGoogleUsers,
    addGoogleUsersLogin,
    getCorporateCode,
    addCorpUser,
    addCorpRunner,
    increaseRunnerCount,
    eventInfo,
    regInfo,
    getCorp,
    updateCorpRefreshToken,
    checkSponsorReftoken,
    otpStatus,
    updateOtpStatus,
    updatePassword,
    updateUserId,
    addExistingUser,
    updateImage,
    //Rishi
    otpResendStatus,
    updateMobileNumber,
    checkEmandMob,
    checkNwMob
}
