const db = require("../config/dbconfig");
const query = require("../models/corporate.model");
const { sequelize } = require("sequelize");
const { QueryTypes } = require("sequelize");
const mail = require("../middlewares/mail");
const crypt = require("../middlewares/crypt");

async function generatePassword() {
  return new Promise((resolve, reject) => {
    let length = 12,
      charset =
        "@#$&*0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$&*0123456789abcdefghijklmnopqrstuvwxyz",
      password = "";
    for (let j = 0, n = charset.length; j < length; ++j) {
      password += charset.charAt(Math.floor(Math.random() * n));
    }
    console.log("password:", password);
    return resolve(password);
  })
}

const corParticipantsList = async (req, res) => {
  try {
    const { event_id, corporate_id } = req.body;

    const participants = await db.sequelize.query(query.getCorpRunner, {
      replacements: [event_id, corporate_id],
      type: QueryTypes.SELECT,
    });
    res.status(200).json(participants);
  } catch (error) {
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
};

async function generatePassword() {
  return new Promise((resolve,reject)=>{
  let length = 12,
    charset =
      "@#$&*0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$&*0123456789abcdefghijklmnopqrstuvwxyz",
    password = "";
  for (let j = 0, n = charset.length; j < length; ++j) {
    password += charset.charAt(Math.floor(Math.random() * n));
  }
  console.log("password:", password);
  return resolve(password);
})
}

const addCorpSponsor = async (req, res) => {
  try {
    const {
      corp_registrant_firstname,
      corp_registrant_lastname,
      corp_registrant_mob_number,
      corp_company_name,
      corp_registrant_mailid,
      //corp_registrant_password,
      corp_company_description,
      corp_company_logo,
      resident_of_apr,
      corp_address_type,
      corp_addr_villa_number,
      corp_addr_villa_lane_no,
      corp_addr_villa_phase_no,
      corp_addr_tower_no,
      corp_addr_tower_block_no,
      corp_addr_tower_flat_no,
      corp_external_address,
      city,
      state,
      country,
      zipcode,
      sponsorship_category,
      sponsorship_amount,
      number_of_passes,
      payment_ref_number,
      payment_ref_date,
      corporate_code,
      created_by,
    } = req.body;

    let corporate_runner_count = 0;

    const getEvent = await db.sequelize.query(query.getEvent, {
      type: QueryTypes.SELECT,
    });

    console.log(getEvent)

    if(getEvent.length === 0){
      return res.status(400).send("Unable register a sponsor since there is no active event");
    }

    const password = await generatePassword();
    const hashedPassword = await crypt.encrypt(password);
    // const genCorpCode = code + "APR" + number_of_passes;
    // console.log(genCorpCode);

    const addSponsor = await db.sequelize.query(query.addSponsor, {
      replacements: [
        corp_registrant_firstname,
        corp_registrant_lastname,
        corp_registrant_mob_number,
        corp_company_name,
        corp_registrant_mailid,
        hashedPassword,
        corp_company_description,
        corp_company_logo,
        resident_of_apr,
        corp_address_type,
        corp_addr_villa_number,
        corp_addr_villa_lane_no,
        corp_addr_villa_phase_no,
        corp_addr_tower_no,
        corp_addr_tower_block_no,
        corp_addr_tower_flat_no,
        corp_external_address,
        city,
        state,
        country,
        zipcode,
        sponsorship_category,
        sponsorship_amount,
        number_of_passes,
        payment_ref_number,
        payment_ref_date,
        getEvent[0].event_id,
        corporate_code,
        corporate_runner_count,
        created_by,
      ],
      type: QueryTypes.INSERT
    });
    console.log(addSponsor);

    if (addSponsor[1] === 1) {
      //const from = "laksh0762@gmail.com";
      let subject = "Thank you for sponsoring our initiative.";

     // let message = `You can login to our app with Username: ${corp_registrant_mailid} and Password: ${password}  . You can share passcode: ${corporate_code} with your employees to participate in the event`;
      
     let message = `  To access our app, log in with Username: ${corp_registrant_mailid} and Password: ${password}. Your company has been allocated ${number_of_passes} passes in total. To register for the event, please visit our website at https://aprmarathon.org and use your exclusive corporate code during the signup process. The passcode for your employees to participate in the event is  ${corporate_code}. Feel free to share it with them. 
                     We appreciate your support and welcome you to the PUMA Nitro APR RUN 2023!`
     
     
     let obj = {
       // from: from,
        to: corp_registrant_mailid,
        subj: subject,
        msg: message,
      };

      let text = "Acknowledgment from ACT!";

      let html =  `<html><head><title>${text}</title></head>

                   <body><p>${obj.msg}</p></body></html>`;;
      let mailResponse = await mail.mail(
        obj.to,
        obj.subj,

         html

      );
      console.log("mailResponse", mailResponse);
      if (mailResponse == true) {
        res.status(200).json("corporate info created successfully");
      }
    }
  } catch (error) {
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
};


const corpCodeValidation = async (req, res) => {
  try {
    const { corporate_code } = req.body;

    const data = await db.sequelize.query(query.checkCorpCode, { replacements: [corporate_code], type: QueryTypes.SELECT })

    console.log(data[0]);

    if (data[0] === undefined) {
      res.status(200).json({
        "status": true,
        "msg": "code approved"
      })
    } else {
      res.status(200).json({
        "status": false,
        "msg": "Code already exist, Please enter another code"
      })
    }



  } catch (error) {
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }

}

module.exports = {
  corParticipantsList,
  addCorpSponsor,
  corpCodeValidation
};
