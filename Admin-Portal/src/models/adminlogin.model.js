const adminTable = "CREATE TABLE  adminlogin_info (admin_id serial NOT NULL, admin_user_name character varying NOT NULL,"
   +" admin_firstname character varying , admin_lastname character varying, admin_password character varying,admin_location character varying , admin_gender character varying , refresh_token character varying, created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP, updated_at timestamp with time zone, role character varying ,"
   +" admin_status character varying, profile_image character varying , admin_phone character varying ,created_by character varying,CONSTRAINT adminsignup_info_pkey PRIMARY KEY (admin_id), CONSTRAINT adminsignup_info_ukey UNIQUE (admin_user_name))";

const runnerTable = "CREATE TABLE runner_info (runner_id serial NOT NULL, runner_first_name character varying, runner_last_name character varying,registrant_id_ref integer, runner_dob character varying, runner_gender character varying, runner_email_id character varying, runner_emergency_contact_number character varying, runner_emergency_contact_name character varying,"+
                      "runner_blood_group character varying,  runner_age_category character varying,  runner_age character varying,  runner_address_type character varying, runner_address character varying,  runner_city character varying,  runner_state character varying,  runner_pincode character varying,  runner_country character varying,"  +
                      "run_category character varying , tshirt_size character varying, need_runner_kit boolean,registrant_event_id integer, bib_number character varying, runner_payment_status character varying,  my_payment_id_ref integer, created_at timestamp without time zone,  updated_at timestamp with time zone, CONSTRAINT runner_info_pkey PRIMARY KEY (runner_id), CONSTRAINT runner_bibnumber_ukey UNIQUE (bib_number)"+
                   "INCLUDE(bib_number), CONSTRAINT runner_eventid_fkey FOREIGN KEY (registrant_event_id)  REFERENCES event_info (event_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE SET NULL NOT VALID,"+
                   "CONSTRAINT runner_registrantid_fkey FOREIGN KEY (registrant_id_ref) REFERENCES registrant_info (registrant_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE SET NULL NOT VALID)";

const registrantTable = "CREATE TABLE registrant_info ( registrant_id serial NOT NULL , registrant_type_ref integer,  first_name character varying ,  middle_name character varying ,last_name character varying,date_of_birth character varying , age_category character varying ,  age integer,  gender character varying , email_id character varying , google_id character varying, password character varying,mobile_number character varying ,"+

    "address_type character varying,    address character varying ,additional_email_id character varying , city character varying ,state character varying ,pin_code character varying , registrant_source_ref integer, registrant_class_ref integer,"+
    " emergency_contact_name character varying , emergency_contact_mobile_number character varying, need_80G_certificate boolean, pancard_number character varying ,certificate_80G_url character varying, blood_group character varying ,ticket_type_id_ref integer, card_detail_ref integer, created_at timestamp with time zone,  updated_at timestamp with time zone,"+
    "CONSTRAINT registrant_info_pkey PRIMARY KEY (registrant_id), CONSTRAINT registrant_classref_fkey FOREIGN KEY (registrant_class_ref) REFERENCES registrant_class_info (category_id) MATCH SIMPLE   ON UPDATE CASCADE ON DELETE SET NULL NOT VALID,"+
    "CONSTRAINT registrant_sourceref_fkey FOREIGN KEY (registrant_source_ref) REFERENCES registrant_source_info (source_id) MATCH SIMPLE   ON UPDATE CASCADE ON DELETE SET NULL NOT VALID,CONSTRAINT registrant_typeref_fkey FOREIGN KEY (registrant_type_ref) "+
    "REFERENCES registrant_type_info (type_id) MATCH SIMPLE   ON UPDATE CASCADE ON DELETE SET NULL NOT VALID) , CONSTRAINT registrant_card_detailsref_fkey FOREIGN KEY (card_detail_ref) REFERENCES card_details (card_det_id) MATCH SIMPLE   ON UPDATE CASCADE ON DELETE SET NULL NOT VALID,"+
    "CONSTRAINT registrant_ticket_typid_ref_fkey FOREIGN KEY (ticket_type_id_ref) REFERENCES ticket_type_info (ticket_type_id) MATCH SIMPLE   ON UPDATE CASCADE ON DELETE SET NULL NOT VALID)";

const paymentTable = "CREATE TABLE payment_info (payment_id serial NOT NULL , payment_type character varying ,payment_status integer, payment_amount float,payment_additional_amount integer,payment_date date,"+
    "receipt_date character varying , payment_reference_id character varying, payment_tax character varying , payment_fee integer, payment_details_id character varying ,   registrant_id_ref integer,runner_id_ref integer,card_id_ref integer, created_at timestamp with time zone, CONSTRAINT payment_info_pkey PRIMARY KEY (payment_id),"+
    " CONSTRAINT payment_registrantid_fkey FOREIGN KEY (registrant_id_ref) REFERENCES registrant_info (registrant_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE SET NULL NOT VALID,"+
    " CONSTRAINT payment_runnerid_fkey FOREIGN KEY (runner_id_ref) REFERENCES runner_info (runner_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE SET NULL  NOT VALID, CONSTRAINT payment_cardid_fkey FOREIGN KEY (card_id_ref) REFERENCES card_details (card_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE SET NULL  NOT VALID)";

const eventTable = "CREATE TABLE event_info (event_id serial NOT NULL, event_name character varying, event_year integer, event_date date, event_time time without time zone,event_description character varying, event_location character varying, expo_day timestamp with time zone, stalls_opening_time time without time zone,bib_collection_date timestamp with time zone,bib_collection_place character varying, created_by integer,   updated_by integer,created_at timestamp with time zone,"+
    "updated_at timestamp with time zone, CONSTRAINT event_info_pkey PRIMARY KEY (event_id), CONSTRAINT event_createdby_fkey FOREIGN KEY (created_by) REFERENCES adminlogin_info (admin_id) MATCH SIMPLE  ON UPDATE CASCADE ON DELETE SET NULL NOT VALID,  CONSTRAINT event_updatedby_fkey FOREIGN KEY (updated_by)"+
    "REFERENCES adminlogin_info (admin_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE SET NULL NOT VALID)" ;

const registrantClassTable = "CREATE TABLE  registrant_class_info (    category_id  serial NOT NULL ,    category_name character varying ,category_price character varying ,    category_ticket_count integer,    runners_allowed_count integer,    registrant_type_id_ref integer,    ticket_type_name character varying ,    ticket_type_price integer,"+  
    "registrant_source_id_ref integer,    created_by integer,    updated_by integer,    created_at timestamp with time zone,    updated_at timestamp with time zone,  CONSTRAINT registrant_class_info_pkey PRIMARY KEY (category_id), CONSTRAINT registrant_class_createdby_fkey FOREIGN KEY (created_by) REFERENCES  adminlogin_info (admin_id) MATCH SIMPLE  ON UPDATE CASCADE   ON DELETE SET NULL     NOT VALID,"+
    "CONSTRAINT registrant_class_sourceid_fkey FOREIGN KEY (registrant_source_id_ref)  REFERENCES registrant_source_info (source_id) MATCH SIMPLE  ON UPDATE CASCADE  ON DELETE SET NULL   NOT VALID, CONSTRAINT registrant_class_typeid_fkey FOREIGN KEY (registrant_type_id_ref)   REFERENCES registrant_type_info (type_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE SET NULL NOT VALID,"+
    "CONSTRAINT registrant_class_updatedby_fkey FOREIGN KEY (updated_by)  REFERENCES adminlogin_info (admin_id) MATCH SIMPLE ON UPDATE CASCADE  ON DELETE SET NULL   NOT VALID)";

const registrantSourceTable = "CREATE TABLE  registrant_source_info (  source_id serial NOT NULL ,    source_name character varying , created_by integer, updated_by integer, created_at timestamp with time zone, updated_at timestamp with time zone, CONSTRAINT registrant_source_info_pkey PRIMARY KEY (source_id),"+
    "CONSTRAINT registrant_source_createdby_fkey FOREIGN KEY (created_by)    REFERENCES adminlogin_info (admin_id) MATCH SIMPLE   ON UPDATE CASCADE  ON DELETE SET NULL   NOT VALID, CONSTRAINT registrant_source_updatedby_fkey FOREIGN KEY (updated_by) REFERENCES adminlogin_info (admin_id) MATCH SIMPLE ON UPDATE CASCADE  ON DELETE SET NULL  NOT VALID)";

const registrantTypeTable = "CREATE TABLE registrant_type_info (type_id serial NOT NULL, type_name character varying,"+
    " created_by integer, updated_by integer, created_at timestamp with time zone,  updated_at timestamp with time zone, CONSTRAINT registrant_type_info_pkey PRIMARY KEY (type_id),"+
    "CONSTRAINT registrant_type_createdby_fkey FOREIGN KEY (created_by) REFERENCES adminlogin_info (admin_id) MATCH SIMPLE   ON UPDATE CASCADE ON DELETE SET NULL NOT VALID, CONSTRAINT registrant_type_updatedby_fkey FOREIGN KEY (updated_by) REFERENCES adminlogin_info (admin_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE SET NULL  NOT VALID)"

const raceCategoryTable = "CREATE TABLE race_category_info (race_type_id serial NOT NULL, race_type_name character varying, age_category character varying, event_id_ref integer, created_by integer, updated_by integer, created_at timestamp with time zone, updated_at timestamp with time zone, "+
                           "CONSTRAINT racecategory_updatedby_fkey FOREIGN KEY (updated_by) REFERENCES adminlogin_info (admin_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE SET NULL  NOT VALID, CONSTRAINT racecategory_cretedby_fkey FOREIGN KEY (created_by) REFERENCES adminlogin_info (admin_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE SET NULL  NOT VALID, "+
                           "CONSTRAINT   racecategory_eventid_fkey FOREIGN KEY (event_id_ref) REFERENCES event_info (event_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE SET NULL  NOT VALID)"    

const  cardDetailsTable = "CREATE TABLE card_details (card_det_id serial NOT NULL, card_name character varying, registrant_id_ref integer, created_by integer, updated_by integer, created_at timestamp with time zone, updated_at timestamp with time zone, "+                           
                           "CONSTRAINT card_updatedby_fkey FOREIGN KEY (updated_by) REFERENCES adminlogin_info (admin_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE SET NULL  NOT VALID, CONSTRAINT card_createdby_fkey FOREIGN KEY (created_by) REFERENCES adminlogin_info (admin_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE SET NULL  NOT VALID,"+
                           "CONSTRAINT  card_registrantref_fkey FOREIGN KEY (registrant_id_ref) REFERENCES registrant_info (registrant_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE SET NULL  NOT VALID )";

const ticketTypeInfoTable = "CREATE TABLE ticket_type_info (ticket_type_id serial NOT NULL , ticket_type_name character varying, ticket_type_price float, created_by integer, updated_by integer, created_at timestamp with time zone, updated_at timestamp with time zone,"+
                            "CONSTRAINT tickettype_updatedby_fkey FOREIGN KEY (updated_by) REFERENCES adminlogin_info (admin_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE SET NULL  NOT VALID, CONSTRAINT tickettype_createdby_fkey FOREIGN KEY (created_by) REFERENCES adminlogin_info (admin_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE SET NULL  NOT VALID ) "                           

const otpTable ="CREATE TABLE otp_info (otp_id integer NOT NULL,phone_number character varying, otp integer,CONSTRAINT otps_pkey PRIMARY KEY (id))";

const ageCategoryTable = "CREATE TABLE age_category_info (age_type_id serial NOT NULL, age_type_name character varying, race_year character varying, event_id_ref integer, created_by integer, updated_by integer, created_at timestamp with time zone , updated_at timestamp with time zone,  "+
                       "CONSTRAINT agecategory_createdby_fkey FOREIGN KEY (created_by) REFERENCES adminlogin_info (admin_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE SET NULL  NOT VALID ,"+
                       "CONSTRAINT agecategory_updatedby_fkey FOREIGN KEY (updated_by) REFERENCES adminlogin_info (admin_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE SET NULL  NOT VALID,"+
                       "CONSTRAINT agecategory_eventidref_fkey FOREIGN KEY (event_id_ref) REFERENCES event_info (event_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE SET NULL  NOT VALID , CONSTRAINT agecategory_pkey PRIMARY KEY (age_type_id) )";

const getUserByMail = "SELECT * FROM adminlogin_info WHERE admin_user_name = ? AND admin_status ='active'";

const updateRefToken = "UPDATE adminlogin_info SET refresh_token = ? , notif_token=? WHERE admin_user_name = ? ";

const checkReftoken = "SELECT * FROM adminlogin_info WHERE refresh_token =? ";

const updateAdmin = "UPDATE adminlogin_info SET admin_firstname=?, admin_lastname = ?, admin_user_name=?, admin_phone=?, admin_password=?, profile_image = ?,role=?,admin_status=?, updated_at=? WHERE admin_id=?"

const addAdmin = "INSERT INTO adminlogin_info (admin_firstname,admin_middlename, admin_lastname, admin_user_name, admin_phone,admin_password, role, admin_status, created_by) VALUES (?,?,?,?,?,?,?,?,?)";

const getAdmin ="select * from adminlogin_info where admin_user_name=?";

const adminInfo  = "select * from adminlogin_info where admin_id=?";

const updateAdminStatus = "update adminlogin_info set admin_status=? where admin_id=?";

const updatePassword = "update adminlogin_info set admin_password=? where admin_user_name =? "

const dropAdmin = "update adminlogin_info set admin_status='drop' where admin_id=?";

const getAdminInfo = "select admin_id, admin_user_name, admin_firstname, admin_lastname, admin_phone, role, admin_status,profile_image, created_by from adminlogin_info where admin_id=? ";

const getAdmins = `select 
ab.admin_id, 
ab.admin_user_name, 
ab.admin_firstname, 
ab.admin_lastname, 
ab.admin_phone, ab.role, 
ab.admin_status, 
ab.profile_image, 
CONCAT(cd.admin_firstname, ' ', cd.admin_lastname) as created_by 
from adminlogin_info ab left join adminlogin_info cd 
on ab.created_by = cd.admin_id`;

const editPic= "update adminlogin_info set profile_image=? where admin_id=?"
const getActiveEvent = "select * from event_info where event_status='active'";
module.exports = {
    editPic,
    adminTable,
    runnerTable,
    registrantTable,
    paymentTable,
    eventTable,
    registrantClassTable,
    registrantSourceTable,
    registrantTypeTable,
    raceCategoryTable,
    cardDetailsTable,
    ticketTypeInfoTable,
    otpTable,
    ageCategoryTable,

    getUserByMail,
    updateRefToken,
    checkReftoken,
    updateAdmin,
    addAdmin,
    getAdmin,
    adminInfo,
    updateAdminStatus,
    updatePassword,
    dropAdmin,
    getAdminInfo,
    getAdmins,
    getActiveEvent
};