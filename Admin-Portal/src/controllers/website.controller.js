const db = require("../config/dbconfig");
const query = require("../models/website.model");
const { sequelize } = require("sequelize");
const { QueryTypes } = require("sequelize");
const mail = require("../middlewares/mail");

const eventDetails = async (req, res) => {
  try {
    const event = await db.sequelize.query(query.activeEvent, {
      type: QueryTypes.SELECT,
    });
    const event_id = event[0].event_id;
    const registrant = await db.sequelize.query(query.paidRegistrant, {
      replacements: [event_id],
      type: QueryTypes.SELECT,
    });

    const totalReg = registrant.length;
    console.log(totalReg);
    let run_count = 0;
    if (totalReg > 0) {
      for (let i = 0; i < registrant.length; i++) {

        // const villaCount = await db.sequelize.query(query.villaParticipant  , {replacements:[event_id], type:QueryTypes.SELECT});
        const result = await db.sequelize.query(query.runnerCountAsOfOrderId, {
          replacements: [registrant[i].booking_id_ref],
          type: QueryTypes.SELECT,
        });
        
        run_count += +result[0].runner_count;
        console.log(run_count);
      }
    }

    const corpRunCount = await db.sequelize.query(query.corpRunCount, {replacements:[event_id],
      type: QueryTypes.SELECT,
    });
    console.log("line51: ", corpRunCount);

    const totalParticipants =
      totalReg + run_count + Number(corpRunCount[0].runner_count);

    res.status(200).json({
      total_participants: totalParticipants,
    });
  } catch (error) {
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
};

const contactUs = async (req, res) => {
  try {
    const { full_name, street, city, post_code, phone_number, email_id } =
      req.body;

    const from = "laksh0762@gmail.com";
    const to="aprcharitabletrust@gmail.com";
    let subject = " Request from a user for join us or make a donation or contact us";
    let message = `User ${full_name} from ${street},${city},${post_code} , \n likes to contact us through mobile ${phone_number} or email  ${email_id}\n`;
    let obj = {
      from: from,
      to: to,
      subj: subject,
      msg: message,
    };

    let text = "Receiving a request from user!";
    let html = `<html><head><title>${text}</title></head>
    <body>${obj.msg}</body></html>`;
    let mailResponse = await mail.sendmail(
      obj.to,
  
      obj.subj,
  
      html
    );
    console.log("mailResponse", mailResponse);
    if (mailResponse == true) {
      res.status(200).json("Thank you for conatct us, Our team will get back to you soon...");
    }
  } catch (error) {
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
};

module.exports = {
  eventDetails,
  contactUs
};
