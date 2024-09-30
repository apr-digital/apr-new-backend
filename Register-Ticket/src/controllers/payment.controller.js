const db = require("../config/dbconfig");
const query = require("../models/payment.model");
const { sequelize } = require("sequelize");
const { QueryTypes } = require("sequelize");
const crypt = require("../middlewares/crypt");
var unirest = require("unirest");
const mail = require("../middlewares/mail");
const axios = require("axios");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const pushNotif = require("../middlewares/pushnotification");
const { log } = require("console");
const PDFDocument = require("pdfkit");

/*test keys */
// const merchant_id = "PGTESTPAYUAT93";
// // const re_directUrl = `http://localhost:3002/api/payment/redirect-url`;
// // const call_backUrl = `http://localhost:3002/api/payment/callback-url`;
// const base_url = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";
// const salt_key = "875126e4-5a13-4dae-ad60-5b8c8b629035"; // Replace with your salt key
// const check_status = `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/`;

// test env render
// const merchant_id = process.env.MERCHANT_ID;
// const re_directUrl = process.env.REDIRECT_URL;
// const re_directUrlForAdmin = process.env.REDIRECT_URL_ADMIN;
// const call_backUrl = process.env.CALLBACK_URL;
// const base_url = process.env.BASE_URL;
// const salt_key = process.env.SALT_KEY
// const check_status = process.env.CHECK_STATUS_API_URL;
// test env render
// const merchant_id = "PGTESTPAYUAT93";
// const re_directUrl = "https://testapr.netlify.app/#/home/booking/";
// const re_directUrlForAdmin = "https://testapradmin.netlify.app/#/admin/spot-registration";
// const call_backUrl = `https://test-apr-registerticket.onrender.com/api/payment/callback-url`;
// const base_url = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";
// const salt_key = "875126e4-5a13-4dae-ad60-5b8c8b629035"; // Replace with your salt key
// const check_status = `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/`;

// staging render
const merchant_id = "PGTESTPAYUAT93";
const re_directUrl = "https://staging.aprmarathon.org/#/home/booking/";
// https://testapr.netlify.app/#/home/booking/ --> test redirecturl
const re_directUrlForAdmin =
  "https://stagingadmin.aprmarathon.org/#/admin/spot-registration";
const call_backUrl = `https://apr-marathon-registerticket-render.onrender.com/api/payment/callback-url`;
const base_url = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";
const salt_key = "875126e4-5a13-4dae-ad60-5b8c8b629035"; // Replace with your salt key
const check_status = `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/`;

/* production keys */
//  const salt_key = "a1fe6f89-a831-41ee-b8b4-219660fba3f9"; //production key
//  const merchant_id = "APRCHARITABLEONLINE"
//  const re_directUrl = "https://aprmarathon.org/#/home/booking/";
//  const call_backUrl = "https://stagingapi.aprmarathon.org/registerticket/api/payment/callback-url";
//  const base_url = "https://api.phonepe.com/apis/hermes/pg/v1/pay";
//  const check_status = "https://api.phonepe.com/apis/hermes/pg/v1/status/";

/* production keys */
// const salt_key = "a1fe6f89-a831-41ee-b8b4-219660fba3f9"   ; //production key
//  const merchant_id = "APRCHARITABLEONLINE"
//  const re_directUrl = "https://staging.aprmarathon.org/#/home/booking/";
//const re_directUrl = "http://localhost:5137/#/home/booking/";
//const call_backUrl= "https://aprapi.aprmarathon.org/registerticket/api/payment/callback-url";

// const base_url="https://api.phonepe.com/apis/hermes/pg/v1/pay";
// const check_status = "https://api.phonepe.com/apis/hermes/pg/v1/status/";

async function key() {
  return new Promise((resolve, reject) => {
    let length = 3,
      charset =
        "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz",
      password = "";
    for (let j = 0, n = charset.length; j < length; ++j) {
      password += charset.charAt(Math.floor(Math.random() * n));
    }
    console.log("password:", password);
    return resolve(password);
  });
}

async function generateToken() {
  return new Promise((resolve, reject) => {
    let length = 16,
      charset =
        "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz",
      password = "";
    for (let j = 0, n = charset.length; j < length; ++j) {
      password += charset.charAt(Math.floor(Math.random() * n));
    }
    console.log("password:", password);
    return resolve(password);
  });
}

const payment = async (req, res) => {
  try {
    const { registrant_id, order_id, amount, registrant_class, payment_date } =
      req.body;

    //generate merchant transaction id

    const regInfo = await db.sequelize.query(query.getRegistrant, {
      replacements: [registrant_id],
      type: QueryTypes.SELECT,
    });

    const eventInfo = await db.sequelize.query(query.activeEvent, {
      type: QueryTypes.SELECT,
    });

    const paymentCount = await db.sequelize.query(query.paymentCount, {
      type: QueryTypes.SELECT,
    });

    const merchantUserId = regInfo[0].reg_payment_user_id;

    // console.log("testtttt 34: ", regInfo[0].reg_payment_user_id);

    var randomThreeDigitNumber = Math.floor(Math.random() * 900) + 100;

    //console.log(randomThreeDigitNumber);

    const merchantTransactionId =
      "MT" +
      eventInfo[0].event_year +
      "00" +
      Number(paymentCount[0].payment_count) +
      randomThreeDigitNumber;

    // console.log(" merchant transact id line 46 : ", merchantTransactionId);

    const payment_token = await generateToken();

    const jsonObject = {
      //merchantId: "PGTESTPAYUAT93",
      //merchantId: "APRCHARITABLEONLINE",
      merchantId: merchant_id,
      merchantTransactionId: merchantTransactionId,
      merchantUserId: merchantUserId,

      amount: Number(amount) * 100,

      redirectUrl: `${re_directUrl}${payment_token}`,
      //"https://stagingapi.aprmarathon.org/registerticket/api/payment/redirect-url",
      // "https://aprapi.aprmarathon.org/registerticket/api/payment/redirect-url",
      // `https://apr-marathon-registerticket-render.onrender.com/api/payment/redirect-url`,

      //`http://localhost:4002/api/payment/redirect-url`,
      redirectMode: "POST",
      callbackUrl: call_backUrl,
      // "https://stagingapi.aprmarathon.org/registerticket/api/payment/callback-url",
      //  "https://aprapi.aprmarathon.org/registerticket/api/payment/callback-url",

      //`https://apr-marathon-registerticket-render.onrender.com/api/payment/callback-url`,

      //`http://localhost:4002/api/payment/callback-url`,
      //mobileNumber: "9360759463",
      //redirectMode: "POST",
      mobileNumber: regInfo[0].mobile_number,
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };

    const jsonString = JSON.stringify(jsonObject);
    const base64String = Buffer.from(jsonString).toString("base64");

    //const base64String = btoa(jsonString);
    //console.log("base64", base64String);

    const paymentObj = {
      baseUrl: base_url,
      //baseUrl: "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay",
      // baseUrl: "https://api.phonepe.com/apis/hermes/pg/v1/pay",
      payload: base64String,
      //  saltKey: "875126e4-5a13-4dae-ad60-5b8c8b629035", // Replace with your salt key
      //saltKey: "a1fe6f89-a831-41ee-b8b4-219660fba3f9",//this is production key

      saltKey: salt_key,
      saltIndex: "1", // Replace with your salt index
    };

    const requestData = base64String;

    const xVerify = await generateXVerify(
      paymentObj.payload,
      paymentObj.saltKey,
      paymentObj.saltIndex,
      requestData
    );

    const response = await axios.post(
      paymentObj.baseUrl,
      { request: requestData },
      {
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": xVerify, // Replace with your actual API key

          "X-CALLBACK-URL": call_backUrl,
          // "https://stagingapi.aprmarathon.org/registerticket/api/payment/redirect-url",

          //"https://aprapi.aprmarathon.org/registerticket/api/payment/redirect-url",
          // `https://apr-marathon-registerticket-render.onrender.com/api/payment/redirect-url`,

          // `http://localhost:4002/api/payment/redirect-url`,
        },
      }
    );

    const getOrderInfo = await db.sequelize.query(query.orderInfo, {
      replacements: [order_id, registrant_id],
      type: QueryTypes.SELECT,
    });

    const getBookingInfo = await db.sequelize.query(query.bookingInfo, {
      replacements: [getOrderInfo[0].booking_id_ref, registrant_id],
      type: QueryTypes.SELECT,
    });

    const regType = await registrantType(getBookingInfo[0].registrant_type_ref);

    const runnerInfo = await db.sequelize.query(query.runnerDetails, {
      replacements: [getOrderInfo[0].booking_id_ref],
      type: QueryTypes.SELECT,
    });

    if (response.data.success === true) {
      let obj = {
        registrant_id: registrant_id,

        event_id: eventInfo[0].event_id,
        registrant_class_id: getBookingInfo[0].registrant_class_ref,
        order_id: order_id,
        ticket_status: "processing",
        payment_type: "phone pe",
        payment_status: "PAYMENT_INITIATED",
        payment_amount: amount,
        payment_additional_amount: null,
        payment_date: payment_date,
        payment_reference_id: response.data.data.merchantTransactionId,
        order_status: "payment initiated",
        runner_payment_status: "pending",
        merchant_id: response.data.data.merchantId,
        merchant_transaction_id: response.data.data.merchantTransactionId,
        reg_payment_user_id: merchantUserId,
      };
      //insert into ticket info and payment info   and update in order and runner table
      //1--> ticket info table
      if (runnerInfo.length > 0) {
        console.log("payment success 1");

        let count = 0;

        for (let i = 0; i < runnerInfo.length; i++) {
          // const getRunCat = await db.sequelize.query(query.runCat, {
          //   replacements: [runnerInfo[i].run_category_id_ref],
          //   type: QueryTypes.SELECT,
          // });

          // let year = eventInfo[0].event_year;

          let runner_id = runnerInfo[i].runner_id;

          const addPayment = await createPayment(obj, runner_id, payment_token);

          if (addPayment === 1) {
            //const addTicket = await createTicket(obj, ticket_id);

            //update order_info and runner_ifo table
            const updateOrder = await updateOrderStatus(
              getOrderInfo[0].booking_id_ref,
              order_id,
              obj.order_status
            );

            if (updateOrder === 1) {
              count++;
            }
          }
        }
        console.log("count:", count);
        console.log(runnerInfo.length);

        if (count === runnerInfo.length) {
          res.status(200).json({
            msg: "Your payment is initiated",
            status: response.data,
            details: {
              registrant_id: registrant_id,
              order_id: order_id,
              booking_id: getOrderInfo[0].booking_id_ref,
              event_id: eventInfo[0].event_id,
              registrant_class: registrant_class,
              //reg_user_id: merchantUserId
            },
          });
        }
      } else {
        //donate category have no runners
        let runner_id = null;
        const addPayment = await createPayment(obj, runner_id, payment_token);

        if (addPayment === 1) {
          res.status(200).json({
            msg: "Your payment is initiated",
            status: response.data,
            details: {
              registrant_id: registrant_id,
              order_id: order_id,
              booking_id: getOrderInfo[0].booking_id_ref,
              event_id: eventInfo[0].event_id,
              registrant_class: registrant_class,
              //reg_user_id:
            },
          });
        }
      }
    } else {
      if (response.data.success === false) {
        console.log("payment failed");
        //insert into ticket info and payment info and update in order and runner table

        for (let i = 0; i < runnerInfo.length; i++) {
          let obj1 = {
            registrant_id: registrant_id,
            runner_id: runnerInfo[i].runner_id,
            event_id: eventInfo[0].event_id,
            registrant_class_id: getBookingInfo[0].registrant_class_ref,
            order_id: order_id,
            // ticket_status: '',
            payment_type: "phone pe",
            payment_status: "PAYMENT_FAILED",
            payment_amount: amount,
            payment_additional_amount: null,
            payment_date: payment_date,
            order_status: "failed",
            runner_payment_status: "unpaid",
            payment_reference_id: null,
            merchant_id: null,
            merchant_transaction_id: null,
            reg_payment_user_id: merchantUserId,
          };
          // const getRunCat = await db.sequelize.query(query.runCat, {
          //   replacements: [runnerInfo[i].run_category_id_ref],
          //   type: QueryTypes.SELECT,
          // });

          // let year = eventInfo[0].event_year;

          let runner_id = runnerInfo[i].runner_id;

          const addPayment = awaitcreatePayment(obj, runner_id, payment_token);

          if (addPayment === 1) {
            //const addTicket = await createTicket(obj, ticket_id);

            //update order_info and runner_ifo table
            const updateOrder = await updateOrderStatus(
              getOrderInfo[0].booking_id_ref,
              order_id,
              obj1.order_status
            );

            if (updateOrder[1] === 1) {
              count++;
            }
          }
        }
        res.status(201).json({
          status: response.data,
          details: {
            registrant_id: registrant_id,
            order_id: order_id,
            booking_id: getOrderInfo[0].booking_id_ref,
            event_id: eventInfo[0].event_id,
            registrant_class: registrant_class,
          },
          msg: "your payment failed, please try again",
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
};

const paymentByAdmin = async (req, res) => {
  try {
    const { registrant_id, order_id, amount, registrant_class, payment_date } =
      req.body;

    //generate merchant transaction id

    const regInfo = await db.sequelize.query(query.getRegistrant, {
      replacements: [registrant_id],
      type: QueryTypes.SELECT,
    });

    const eventInfo = await db.sequelize.query(query.activeEvent, {
      type: QueryTypes.SELECT,
    });

    const paymentCount = await db.sequelize.query(query.paymentCount, {
      type: QueryTypes.SELECT,
    });

    const merchantUserId = regInfo[0].reg_payment_user_id;

    // console.log("testtttt 34: ", regInfo[0].reg_payment_user_id);

    var randomThreeDigitNumber = Math.floor(Math.random() * 900) + 100;

    //console.log(randomThreeDigitNumber);

    const merchantTransactionId =
      "MT" +
      eventInfo[0].event_year +
      "00" +
      Number(paymentCount[0].payment_count) +
      randomThreeDigitNumber;

    // console.log(" merchant transact id line 46 : ", merchantTransactionId);

    const payment_token = await generateToken();

    const jsonObject = {
      //merchantId: "PGTESTPAYUAT93",
      //merchantId: "APRCHARITABLEONLINE",
      merchantId: merchant_id,
      merchantTransactionId: merchantTransactionId,
      merchantUserId: merchantUserId,

      amount: Number(amount) * 100,

      redirectUrl: `${re_directUrlForAdmin}`,
      //"https://stagingapi.aprmarathon.org/registerticket/api/payment/redirect-url",
      // "https://aprapi.aprmarathon.org/registerticket/api/payment/redirect-url",
      // `https://apr-marathon-registerticket-render.onrender.com/api/payment/redirect-url`,

      //`http://localhost:4002/api/payment/redirect-url`,
      redirectMode: "POST",
      callbackUrl: call_backUrl,
      // "https://stagingapi.aprmarathon.org/registerticket/api/payment/callback-url",
      //  "https://aprapi.aprmarathon.org/registerticket/api/payment/callback-url",

      //`https://apr-marathon-registerticket-render.onrender.com/api/payment/callback-url`,

      //`http://localhost:4002/api/payment/callback-url`,
      //mobileNumber: "9360759463",
      //redirectMode: "POST",
      mobileNumber: regInfo[0].mobile_number,
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };

    const jsonString = JSON.stringify(jsonObject);
    const base64String = Buffer.from(jsonString).toString("base64");

    //const base64String = btoa(jsonString);
    //console.log("base64", base64String);

    const paymentObj = {
      baseUrl: base_url,
      //baseUrl: "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay",
      // baseUrl: "https://api.phonepe.com/apis/hermes/pg/v1/pay",
      payload: base64String,
      //  saltKey: "875126e4-5a13-4dae-ad60-5b8c8b629035", // Replace with your salt key
      //saltKey: "a1fe6f89-a831-41ee-b8b4-219660fba3f9",//this is production key

      saltKey: salt_key,
      saltIndex: "1", // Replace with your salt index
    };

    const requestData = base64String;

    const xVerify = await generateXVerify(
      paymentObj.payload,
      paymentObj.saltKey,
      paymentObj.saltIndex,
      requestData
    );

    const response = await axios.post(
      paymentObj.baseUrl,
      { request: requestData },
      {
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": xVerify, // Replace with your actual API key

          "X-CALLBACK-URL": call_backUrl,
          // "https://stagingapi.aprmarathon.org/registerticket/api/payment/redirect-url",

          //"https://aprapi.aprmarathon.org/registerticket/api/payment/redirect-url",
          // `https://apr-marathon-registerticket-render.onrender.com/api/payment/redirect-url`,

          // `http://localhost:4002/api/payment/redirect-url`,
        },
      }
    );

    console.log("line 165: ", response.data);

    const getOrderInfo = await db.sequelize.query(query.orderInfo, {
      replacements: [order_id, registrant_id],
      type: QueryTypes.SELECT,
    });

    const getBookingInfo = await db.sequelize.query(query.bookingInfo, {
      replacements: [getOrderInfo[0].booking_id_ref, registrant_id],
      type: QueryTypes.SELECT,
    });

    const regType = await registrantType(getBookingInfo[0].registrant_type_ref);
    console.log("line 1721: ", regType);

    const runnerInfo = await db.sequelize.query(query.runnerDetails, {
      replacements: [getOrderInfo[0].booking_id_ref],
      type: QueryTypes.SELECT,
    });

    if (response.data.success === true) {
      let obj = {
        registrant_id: registrant_id,

        event_id: eventInfo[0].event_id,
        registrant_class_id: getBookingInfo[0].registrant_class_ref,
        order_id: order_id,
        ticket_status: "processing",
        payment_type: "phone pe",
        payment_status: "PAYMENT_INITIATED",
        payment_amount: amount,
        payment_additional_amount: null,
        payment_date: payment_date,
        payment_reference_id: response.data.data.merchantTransactionId,
        order_status: "payment initiated",
        runner_payment_status: "pending",
        merchant_id: response.data.data.merchantId,
        merchant_transaction_id: response.data.data.merchantTransactionId,
        reg_payment_user_id: merchantUserId,
      };
      //insert into ticket info and payment info   and update in order and runner table
      //1--> ticket info table
      if (runnerInfo.length > 0) {
        console.log("payment success 1");

        let count = 0;

        for (let i = 0; i < runnerInfo.length; i++) {
          // const getRunCat = await db.sequelize.query(query.runCat, {
          //   replacements: [runnerInfo[i].run_category_id_ref],
          //   type: QueryTypes.SELECT,
          // });

          // let year = eventInfo[0].event_year;

          let runner_id = runnerInfo[i].runner_id;

          const addPayment = await createPayment(obj, runner_id, payment_token);

          if (addPayment === 1) {
            //const addTicket = await createTicket(obj, ticket_id);

            //update order_info and runner_ifo table
            const updateOrder = await updateOrderStatus(
              getOrderInfo[0].booking_id_ref,
              order_id,
              obj.order_status
            );

            if (updateOrder === 1) {
              count++;
            }
          }
        }
        console.log("count:", count);
        console.log(runnerInfo.length);

        if (count === runnerInfo.length) {
          res.status(200).json({
            msg: "Your payment is initiated",
            status: response.data,
            details: {
              registrant_id: registrant_id,
              order_id: order_id,
              booking_id: getOrderInfo[0].booking_id_ref,
              event_id: eventInfo[0].event_id,
              registrant_class: registrant_class,
              //reg_user_id: merchantUserId
            },
          });
        }
      } else {
        //donate category have no runners
        let runner_id = null;
        const addPayment = await createPayment(obj, runner_id, payment_token);

        if (addPayment === 1) {
          res.status(200).json({
            msg: "Your payment is initiated",
            status: response.data,
            details: {
              registrant_id: registrant_id,
              order_id: order_id,
              booking_id: getOrderInfo[0].booking_id_ref,
              event_id: eventInfo[0].event_id,
              registrant_class: registrant_class,
              //reg_user_id:
            },
          });
        }
      }
    } else {
      if (response.data.success === false) {
        console.log("payment failed");
        //insert into ticket info and payment info and update in order and runner table

        for (let i = 0; i < runnerInfo.length; i++) {
          let obj1 = {
            registrant_id: registrant_id,
            runner_id: runnerInfo[i].runner_id,
            event_id: eventInfo[0].event_id,
            registrant_class_id: getBookingInfo[0].registrant_class_ref,
            order_id: order_id,
            // ticket_status: '',
            payment_type: "phone pe",
            payment_status: "PAYMENT_FAILED",
            payment_amount: amount,
            payment_additional_amount: null,
            payment_date: payment_date,
            order_status: "failed",
            runner_payment_status: "unpaid",
            payment_reference_id: null,
            merchant_id: null,
            merchant_transaction_id: null,
            reg_payment_user_id: merchantUserId,
          };
          // const getRunCat = await db.sequelize.query(query.runCat, {
          //   replacements: [runnerInfo[i].run_category_id_ref],
          //   type: QueryTypes.SELECT,
          // });

          // let year = eventInfo[0].event_year;

          let runner_id = runnerInfo[i].runner_id;

          const addPayment = awaitcreatePayment(obj, runner_id, payment_token);

          if (addPayment === 1) {
            //const addTicket = await createTicket(obj, ticket_id);

            //update order_info and runner_ifo table
            const updateOrder = await updateOrderStatus(
              getOrderInfo[0].booking_id_ref,
              order_id,
              obj1.order_status
            );

            if (updateOrder[1] === 1) {
              count++;
            }
          }
        }
        res.status(201).json({
          status: response.data,
          details: {
            registrant_id: registrant_id,
            order_id: order_id,
            booking_id: getOrderInfo[0].booking_id_ref,
            event_id: eventInfo[0].event_id,
            registrant_class: registrant_class,
          },
          msg: "your payment failed, please try again",
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
};

async function generateXVerify(payload, saltKey, saltIndex, requestData) {
  return new Promise(async (resolve, reject) => {
    const message = payload + "/pg/v1/pay" + saltKey;
    const sha256Hash = crypto
      .createHash("sha256")
      .update(message)
      .digest("hex");
    const xVerify = sha256Hash + "###" + saltIndex;

    console.log("x verify : ", xVerify);
    console.log("req data: ", requestData);

    return resolve(xVerify);
  });
}

const registrantType = async (type_id) => {
  return new Promise(async (resolve, reject) => {
    const type = await db.sequelize.query(query.regType, {
      replacements: [type_id],
      type: QueryTypes.SELECT,
    });
    return resolve(type[0]);
  });
};

const updateOrderStatus = async (booking_id, order_id, order_status) => {
  return new Promise(async (resolve, reject) => {
    const data = await db.sequelize.query(query.updateOrderStatus, {
      replacements: [order_status, order_id, booking_id],
      type: QueryTypes.UPDATE,
    });
    console.log("line 287: ", data[1]);
    // if (data[1] === 1) {
    return resolve(1);
    // } else {
    //   return reject(error);
    // }
  });
};

const updateRunnerPayment = async (
  runner_payment_status,
  bib_number,
  booking_id,
  runner_id,
  typeName,
  typeid,
  eventid
) => {
  return new Promise(async (resolve, reject) => {
    console.log("line 2118");
    try {
      ///// checking the uniqueness of bib number

      const unique_bib = await bibUniqueness(
        bib_number,
        typeName,
        typeid,
        eventid
      );

      console.log("line 437 unique bib: ", unique_bib);
      const data = await db.sequelize.query(query.updateRunnerPaymentStatus, {
        replacements: [
          runner_payment_status,
          //bib_number,
          unique_bib,
          booking_id,
          runner_id,
        ],
        type: QueryTypes.UPDATE,
      });
      console.log("line 2119", data);
      if (data[1] === 1) {
        return resolve(1);
      }
    } catch (err) {
      console.log(err);
    }
    //else {
    //   return reject(error);
    // }
  });
};

const bibUniqueness = async (bib_number, typeName, typeid, eventid) => {
  return new Promise(async (resolve, reject) => {
    let count = 0;
    // const bib_number = await generateBib(typeName,typeid, eventid);

    //   console.log("line 465 bibnumber:", bib_number);
    const type_name = typeName;
    const type_id = typeid;
    const event_id = eventid;
    const check_unique = await db.sequelize.query(query.checkUnique, {
      replacements: [`${bib_number}`],
      type: QueryTypes.SELECT,
    });
    console.log("bib already ecxist ", check_unique.length);
    if (check_unique.length === 0) {
      console.log("line 474,test", bib_number);

      return resolve(bib_number);
    } else {
      const bib = Number(bib_number) + 1;
      console.log("line 473, bib", bib);
      const result = await bibUniqueness(bib, type_name, type_id, event_id);
      console.log("line 484: result", result);
      if (result) {
        console.log("line 486 testing return");
        return resolve(result);
      }
    }
  });
};

const createTicket = async (obj, ticket_id) => {
  return new Promise(async (resolve, reject) => {
    const data = await db.sequelize.query(query.createTicket, {
      replacements: [
        ticket_id,
        obj.registrant_class_id,
        obj.runner_id,
        obj.registrant_id,
        obj.event_id,
        obj.order_id,
        obj.ticket_status,
      ],
      type: QueryTypes.INSERT,
    });

    if (data[1] === 1) {
      return resolve(1);
    } else {
      return reject(error);
    }
  });
};

const createPayment = async (obj, runner_id, token) => {
  return new Promise(async (resolve, reject) => {
    console.log("test line 358; ", obj.reg_payment_user_id);
    try {
      const data = await db.sequelize.query(query.createPayment, {
        replacements: [
          obj.payment_type,
          obj.payment_status,
          obj.payment_amount,
          obj.payment_additional_amount,
          obj.payment_date,
          obj.payment_reference_id,
          obj.registrant_id,
          runner_id,
          obj.event_id,
          obj.order_id,
          obj.merchant_id,
          obj.merchant_transaction_id,
          obj.reg_payment_user_id,
          token,
        ],
        type: QueryTypes.INSERT,
      });
      if (data[1] > 0) {
        return resolve(1);
      }
    } catch (error) {
      console.log(error);
    }
    // if (data[1] === 1) {
    //   return resolve(1);
    // } else {
    //   return reject(error);
    // }
  });
};

const runnerCount = async (run_type_id, event_id) => {
  return new Promise(async (resolve, reject) => {
    let data = await db.sequelize.query(query.runnerCount, {
      replacements: [run_type_id, event_id],
      type: QueryTypes.SELECT,
    });
    console.log("line 1777: ", data);
    if (data.length > 0) {
      return resolve(data[0].runner_count);
    }
  });
};

const generateBib = async (race_type_name, race_type_id, event_id) => {
  return new Promise(async (resolve, reject) => {
    if (race_type_name === "1k") {
      const count = await db.sequelize.query(query.runnerCount, {
        replacements: [race_type_id, event_id],
        type: QueryTypes.SELECT,
      });
      console.log(count);
      const generateBib = Number(1000) + Number(count[0].runner_count);
      //console.log(generateBib);
      return resolve(generateBib);
    } else {
      if (race_type_name === "5k") {
        const count = await db.sequelize.query(query.runnerCount, {
          replacements: [race_type_id, event_id],
          type: QueryTypes.SELECT,
        });
        const generateBib = Number(50000) + Number(count[0].runner_count);

        return resolve(generateBib);
        //console.log(generateBib);
      } else {
        if (race_type_name === "10k") {
          const count = await db.sequelize.query(query.runnerCount, {
            replacements: [race_type_id, event_id],
            type: QueryTypes.SELECT,
          });
          const generateBib = Number(10000) + Number(count[0].runner_count);
          return resolve(generateBib);
        }
      }
    }
  });
};

const redirectUrl = async (req, res) => {
  try {
    // console.log("line 530: ", req.body);

    // ////////////////////////////////////////////////new code
    // const response = req.body;

    res.status(200).send("check your payment details in website");

    // const merchant_transaction_id = response.transactionId;

    // // registrant id, order_id from payment table

    // const payInfo = await db.sequelize.query(query.paymentInfo, {
    //   replacements: [merchant_transaction_id],
    //   type: QueryTypes.SELECT,
    // });

    // const regInfo = await db.sequelize.query(query.getRegistrant, {
    //   replacements: [payInfo[0].registrant_id_ref],
    //   type: QueryTypes.SELECT,
    // });

    // const eventInfo = await db.sequelize.query(query.activeEvent, {
    //   type: QueryTypes.SELECT,
    // });

    // const getOrderInfo = await db.sequelize.query(query.orderInfo, {
    //   replacements: [payInfo[0].order_id_ref, payInfo[0].registrant_id_ref],
    //   type: QueryTypes.SELECT,
    // });

    // const getBookingInfo = await db.sequelize.query(query.bookingInfo, {
    //   replacements: [
    //     getOrderInfo[0].booking_id_ref,
    //     payInfo[0].registrant_id_ref,
    //   ],
    //   type: QueryTypes.SELECT,
    // });

    // const classAmount = await db.sequelize.query(query.getPrice, {
    //   replacements: [getBookingInfo[0].registrant_class_ref],
    //   thype: QueryTypes.SELECT,
    // });
    // const registrantClass = await db.sequelize.query(query.regClass, {
    //   replacements: [getBookingInfo[0].registrant_class_ref],
    //   thype: QueryTypes.SELECT,
    // });

    // const regClass = registrantClass[0];

    // let class_amount = classAmount[0].category_price;

    // const regType = await registrantType(getBookingInfo[0].registrant_type_ref);
    // console.log("line 1721: ", regType);

    // const runnerInfo = await db.sequelize.query(query.runnerDetails, {
    //   replacements: [getOrderInfo[0].booking_id_ref],
    //   type: QueryTypes.SELECT,
    // });

    // let payObj = response;

    // //console.log("line 828:", payObj);

    // let year = eventInfo[0].event_year;

    // if (response.code === "PAYMENT_SUCCESS") {
    //   //insert into ticket info then update in order and runner table and payment info
    //   //1--> ticket info table
    //   if (runnerInfo.length > 0) {
    //     console.log("payment success 1");

    //     for (let i = 0; i < runnerInfo.length; i++) {
    //       const getRunCat = await db.sequelize.query(query.runCat, {
    //         replacements: [runnerInfo[i].run_category_id_ref],
    //         type: QueryTypes.SELECT,
    //       });

    //       let obj = {
    //         registrant_id: payInfo[0].registrant_id_ref,
    //         runner_id: runnerInfo[i].runner_id,
    //         event_id: eventInfo[0].event_id,
    //         registrant_class_id: getBookingInfo[0].registrant_class_ref,
    //         order_id: payInfo[0].order_id_ref,
    //         ticket_status: "issued",
    //         payment_type: "phone pe",
    //         payment_status: "success",
    //         payment_amount: response.amount,
    //         payment_additional_amount: null,
    //         //payment_date: payment_date,
    //         payment_reference_id: response.providerReferenceId,
    //         order_status: "success",
    //         runner_payment_status: "paid",
    //         merchant_id: response.merchantId,
    //         merchant_transaction_id: response.transactionId,
    //         provider_reference_id: response.providerReferenceId,
    //         reg_payment_user_id: regInfo[0].reg_payment_user_id,
    //       };
    //       let bib_number = await generateBib(
    //         getRunCat[0].race_type_name,
    //         getRunCat[0].race_type_id,
    //         obj.event_id
    //       );

    //       if (regType.type_name == "marathon runners") {
    //         console.log("test");

    //         if (getRunCat[0].race_type_name === "1k") {
    //           let runner = await runnerCount(
    //             getRunCat[0].race_type_id,
    //             eventInfo[0].event_id
    //           );

    //           const salt = await key();
    //           let ticket_id =
    //             year + "100" + (Number(1000) + Number(runner)) + salt;

    //           console.log("ticket_id ", payObj.code);

    //           const update_payment = await updatePayment(
    //             payInfo[0].order_id_ref,
    //             payInfo[0].registrant_id_ref,
    //             payObj,
    //             obj.provider_reference_id
    //           );
    //           if (update_payment === 1) {
    //             const addTicket = await createTicket(obj, ticket_id);

    //             //update order_info and runner_ifo table

    //             if (addTicket === 1) {
    //               const updateOrder = await updateOrderStatus(
    //                 getOrderInfo[0].booking_id_ref,
    //                 payInfo[0].order_id_ref,
    //                 obj.order_status
    //               );
    //               if (updateOrder === 1) {
    //                 const updateRunner = await updateRunnerPayment(
    //                   obj.runner_payment_status,
    //                   bib_number,
    //                   getOrderInfo[0].booking_id_ref,
    //                   runnerInfo[i].runner_id
    //                 );

    //                 if (updateRunner == 1) {
    //                   console.log("runner info updated");
    //                 }
    //               } else {
    //                 console.log({ err: "create ticket error" });
    //               }
    //             } else {
    //               console.log({ err: "update order error" });
    //             }
    //           }
    //         } else {
    //           if (getRunCat[0].race_type_name === "5k") {
    //             let runner = await runnerCount(
    //               getRunCat[0].race_type_id,
    //               eventInfo[0].event_id
    //             );

    //             const salt = await key();
    //             let ticket_id =
    //               year + "100" + (Number(5000) + Number(runner)) + salt;

    //             console.log("ticket_id ", ticket_id);

    //             // const update_payment = await updatePayment(
    //             //   payInfo[0].order_id_ref,
    //             //   payInfo[0].registrant_id_ref,
    //             //   payObj,
    //             //   obj.provider_reference_id
    //             // );
    //             // if (update_payment === 1) {
    //             //   const addTicket = await createTicket(obj, ticket_id);

    //             //   //update order_info and runner_ifo table
    //             //   const updateOrder = await updateOrderStatus(
    //             //     getOrderInfo[0].booking_id_ref,
    //             //     payInfo[0].order_id_ref,
    //             //     obj.order_status
    //             //   );
    //             //   const updateRunner = await updateRunnerPayment(
    //             //     obj.runner_payment_status,
    //             //     bib_number,
    //             //     getOrderInfo[0].booking_id_ref,
    //             //     runnerInfo[i].runner_id
    //             //   );
    //             // }

    //             const update_payment = await updatePayment(
    //               payInfo[0].order_id_ref,
    //               payInfo[0].registrant_id_ref,
    //               payObj,
    //               obj.provider_reference_id
    //             );
    //             if (update_payment === 1) {
    //               const addTicket = await createTicket(obj, ticket_id);

    //               //update order_info and runner_ifo table

    //               if (addTicket === 1) {
    //                 const updateOrder = await updateOrderStatus(
    //                   getOrderInfo[0].booking_id_ref,
    //                   payInfo[0].order_id_ref,
    //                   obj.order_status
    //                 );
    //                 if (updateOrder === 1) {
    //                   const updateRunner = await updateRunnerPayment(
    //                     obj.runner_payment_status,
    //                     bib_number,
    //                     getOrderInfo[0].booking_id_ref,
    //                     runnerInfo[i].runner_id
    //                   );

    //                   if (updateRunner == 1) {
    //                     console.log("runner info updated");
    //                   }
    //                 } else {
    //                   console.log({ err: "create ticket error" });
    //                 }
    //               } else {
    //                 console.log({ err: "update order error" });
    //               }
    //             }
    //           } else {
    //             if (getRunCat[0].race_type_name === "10k") {
    //               let runner = await runnerCount(
    //                 getRunCat[0].race_type_id,
    //                 eventInfo[0].event_id
    //               );

    //               const salt = await key();
    //               let ticket_id =
    //                 year + "100" + (Number(10000) + Number(runner)) + salt;

    //               console.log("ticket_id ", ticket_id);

    //               const update_payment = await updatePayment(
    //                 payInfo[0].order_id_ref,
    //                 payInfo[0].registrant_id_ref,
    //                 payObj,
    //                 obj.provider_reference_id
    //               );
    //               if (update_payment === 1) {
    //                 //const addTicket = await createTicket(obj, ticket_id);

    //                 //update order_info and runner_ifo table
    //                 const updateOrder = await updateOrderStatus(
    //                   getOrderInfo[0].booking_id_ref,
    //                   payInfo[0].order_id_ref,
    //                   obj.order_status
    //                 );
    //                 if (updateOrder == 1) {
    //                   const updateRunner = await updateRunnerPayment(
    //                     obj.runner_payment_status,
    //                     bib_number,
    //                     getOrderInfo[0].booking_id_ref,
    //                     runnerInfo[i].runner_id
    //                   );

    //                   if (updateRunner == 1) {
    //                     console.log("Runner info updated");
    //                   }
    //                 } else {
    //                   console.log("order updated");
    //                 }
    //               } else {
    //                 console.log("payment updated");
    //               }
    //             }
    //           }
    //         }
    //       } else {
    //         if (regType.type_name == "donors with runners") {
    //           console.log("test1");

    //           if (getRunCat[0].race_type_name === "1k") {
    //             let runner = await runnerCount(
    //               getRunCat[0].race_type_id,
    //               eventInfo[0].event_id
    //             );

    //             const salt = await key();
    //             let ticket_id =
    //               year + "010" + (Number(1000) + Number(runner)) + salt;

    //             console.log("ticket_id ", payObj.code);

    //             const update_payment = await updatePayment(
    //               payInfo[0].order_id_ref,
    //               payInfo[0].registrant_id_ref,
    //               payObj,
    //               obj.provider_reference_id
    //             );
    //             console.log(update_payment);
    //             if (update_payment === 1) {
    //               const addTicket = await createTicket(obj, ticket_id);
    //               if (addTicket == 1) {
    //                 //update order_info and runner_ifo table
    //                 const updateOrder = await updateOrderStatus(
    //                   getOrderInfo[0].booking_id_ref,
    //                   payInfo[0].order_id_ref,
    //                   obj.order_status
    //                 );
    //                 if (updateOrder == 1) {
    //                   console.log("line 1870");
    //                   const updateRunner = await updateRunnerPayment(
    //                     obj.runner_payment_status,
    //                     bib_number,
    //                     getOrderInfo[0].booking_id_ref,
    //                     runnerInfo[i].runner_id
    //                   );

    //                   if (updateRunner === 1) {
    //                     console.log("runner info updated");
    //                   }
    //                 } else {
    //                   console.log("order update failed");
    //                 }
    //               } else {
    //                 console.log("order update failed");
    //               }
    //             } else {
    //               console.log("payment update failed");
    //             }
    //           } else {
    //             if (getRunCat[0].race_type_name === "5k") {
    //               let runner = await runnerCount(
    //                 getRunCat[0].race_type_id,
    //                 eventInfo[0].event_id
    //               );
    //               const salt = await key();
    //               let ticket_id =
    //                 year + "010" + (Number(5000) + Number(runner)) + salt;

    //               console.log("ticket_id ", ticket_id);
    //               const update_payment = await updatePayment(
    //                 payInfo[0].order_id_ref,
    //                 payInfo[0].registrant_id_ref,
    //                 payObj,
    //                 obj.provider_reference_id
    //               );
    //               console.log(update_payment);
    //               if (update_payment === 1) {
    //                 const addTicket = await createTicket(obj, ticket_id);
    //                 if (addTicket == 1) {
    //                   //update order_info and runner_ifo table
    //                   const updateOrder = await updateOrderStatus(
    //                     getOrderInfo[0].booking_id_ref,
    //                     payInfo[0].order_id_ref,
    //                     obj.order_status
    //                   );
    //                   if (updateOrder == 1) {
    //                     console.log("line 1870");
    //                     const updateRunner = await updateRunnerPayment(
    //                       obj.runner_payment_status,
    //                       bib_number,
    //                       getOrderInfo[0].booking_id_ref,
    //                       runnerInfo[i].runner_id
    //                     );

    //                     if (updateRunner === 1) {
    //                       console.log("runner info updated");
    //                     }
    //                   } else {
    //                     console.log("order update failed");
    //                   }
    //                 } else {
    //                   console.log("order update failed");
    //                 }
    //               } else {
    //                 console.log("payment update failed");
    //               }
    //             } else {
    //               if (getRunCat[0].race_type_name === "10k") {
    //                 let runner = await runnerCount(
    //                   getRunCat[0].race_type_id,
    //                   eventInfo[0].event_id
    //                 );

    //                 console.log("line 1908: ", runner);
    //                 const salt = await key();
    //                 let ticket_id =
    //                   year + "010" + (Number(10000) + Number(runner)) + salt;

    //                 console.log("ticket_id ", ticket_id);

    //                 const update_payment = await updatePayment(
    //                   payInfo[0].order_id_ref,
    //                   payInfo[0].registrant_id_ref,
    //                   payObj,
    //                   obj.provider_reference_id
    //                 );
    //                 console.log(update_payment);
    //                 if (update_payment === 1) {
    //                   const addTicket = await createTicket(obj, ticket_id);
    //                   if (addTicket == 1) {
    //                     //update order_info and runner_ifo table
    //                     const updateOrder = await updateOrderStatus(
    //                       getOrderInfo[0].booking_id_ref,
    //                       payInfo[0].order_id_ref,
    //                       obj.order_status
    //                     );
    //                     if (updateOrder == 1) {
    //                       console.log("line 1929");

    //                       console.log(bib_number);
    //                       const updateRunner = await updateRunnerPayment(
    //                         obj.runner_payment_status,
    //                         bib_number,
    //                         getOrderInfo[0].booking_id_ref,
    //                         runnerInfo[i].runner_id
    //                       );

    //                       if (updateRunner == 1) {
    //                         console.log("runner info updated");
    //                       }
    //                     } else {
    //                       console.log("order update failed");
    //                     }
    //                   } else {
    //                     console.log("ticket update failed");
    //                   }
    //                 } else {
    //                   console.log("payment updated failed");
    //                 }
    //               }
    //             }
    //           }
    //         }
    //       }
    //     }

    //     let subject = `Registration confirmation mail`;
    //     let message = `Hai, ${regInfo[0].first_name} ${regInfo[0].last_name} you are successfully registered for APR marathon under the class ${regClass[0].category_name}. To know your runner details, please visit the website https://aprmarathon.org `;
    //     //console.log("line309:",count);
    //     // if (count === 1) {
    //     let obj = {
    //       ///from: "laksh0762@gmail.com",
    //       to: regInfo[0].email_id,
    //       subj: subject,
    //       msg: message,
    //     };

    //     let text = "Announcement from ACT!";
    //     let html =
    //       //  `<html>
    //       //                <title> ${text}</title>
    //       //                <body><p>${obj.msg}</p></body>
    //       //                </html>`;

    //       ` <html>  <p>Dear${regInfo[0].first_name} ${regInfo[0].last_name}</p>
    //                   <p> Thank you for registering for the APR Run scheduled for 10th December 2023. Your registration has been successful under the  ${regClass[0].category_name} category.</p>
    //                   <p> The receipt for the payment and registration details are find below links.</p>
    //                   <p> For registration details, please refer https://aprmarathon.org/#/home/registration-details</p>
    //                   <p> For payment details, please refer https://aprmarathon.org/#/home/payment-history.</p>
    //                   <p> Thank you,</p>
    //                   <p> APR Charitable Trust (ACT)</p>
    //                   <p></p> APR Run team</p></html> `;

    //     let mailResponse = await mail.mail(obj.to, obj.subj, html);
    //     console.log("mailResponse", mailResponse);
    //     if (mailResponse == true) {
    //       //insert into notification table
    //       let notifObj = {
    //         registratn_id: payInfo[0].registrant_id_ref,
    //         notification_type: "notification",
    //         message: `You have successfully registered for marathon under the category ${regClass[0].category_name}`,
    //         subject: "payment success!",
    //         event_id: eventInfo[0].event_id,

    //         created_by: null,
    //       };

    //       const notifiication = await db.sequelize.query(
    //         query.createNotification,
    //         {
    //           replacements: [
    //             notifObj.notification_type,
    //             notifObj.subject,
    //             notifObj.message,
    //             "registrant",
    //             notifObj.registratn_id,
    //             notifObj.event_id,
    //             notifObj.created_by,
    //           ],
    //           type: QueryTypes.INSERT,
    //         }
    //       );

    //       //push notification
    //       // let title = notifObj.subject;
    //       // let body =  notifObj.message;
    //       // let token = regInfo[0].notif_token;
    //       // const sendNotif = await pushNotif.notification(title,body,token);

    //       res.status(200).send(
    //         // registrant_id: payInfo[0].registrant_id_ref,
    //         // order_id: payInfo[0].order_id_ref,
    //         // booking_id: getOrderInfo[0].booking_id_ref,
    //         // event_id: eventInfo[0].event_id,
    //         //status: response,

    //         "Payment success...!, check your mail for more details"
    //       );

    //       // } else {
    //       //   res.status(201).json("error occured, Please check the data");
    //       // }
    //     }
    //   } else {
    //     console.log("payment   success 2");

    //     let obj = {
    //       registrant_id: payInfo[0].registrant_id_ref,
    //       runner_id: null,
    //       event_id: eventInfo[0].event_id,
    //       registrant_class_id: getBookingInfo[0].registrant_class_ref,
    //       order_id: payInfo[0].order_id_ref,
    //       ticket_status: "issued",
    //       payment_type: "phone pe",
    //       payment_status: "success",
    //       payment_amount: response.amount,
    //       payment_additional_amount: null,
    //       // payment_date: payment_date,
    //       payment_reference_id: null,
    //       order_status: "success",
    //       runner_payment_status: "paid",
    //       merchant_id: response.merchantId,
    //       merchant_transaction_id: response.transactionId,
    //       provider_reference_id: response.providerReferenceId,
    //       reg_payment_user_id: regInfo[0].reg_payment_user_id,
    //     };

    //     // donor have no runners, so update the stauts in booking_info and ordr_info table, pyment table
    //     ///changes done by sugan 1/11/2023
    //     const regCount = await db.sequelize.query(query.regCount, {
    //       replacements: [eventInfo[0].event_id],
    //       type: QueryTypes.SELECT,
    //     });
    //     const salt = await key();
    //     //let yera = eventInfo[0].event_year;
    //     let ticket_id = year + "001" + regCount.length + salt;
    //     const update_payment = await updatePayment(
    //       payInfo[0].order_id_ref,
    //       payInfo[0].registrant_id_ref,
    //       payObj,
    //       obj.provider_reference_id
    //     );

    //     let count = 0;

    //     if (update_payment === 1) {
    //       const addTicket = await createTicket(obj, ticket_id);

    //       //update order_info and runner_ifo table

    //       const updateOrder = await updateOrderStatus(
    //         getOrderInfo[0].booking_id_ref,
    //         payInfo[0].order_id_ref,
    //         obj.order_status
    //       );

    //       if (addTicket == 1 && updateOrder == 1) {
    //         count++;
    //       }
    //     }

    //     if (count === 1) {
    //       let subject = `Registration confirmation mail`;
    //       let message = `Hai, ${regInfo[0].first_name} ${regInfo[0].last_name} you are successfully registered for APR marathon under the class ${regClass[0].category_name}. To know your runner details, please visit the website https://aprmarathon.org `;
    //       //console.log("line309:",count);
    //       // if (count === 1) {
    //       let obj = {
    //         // from: "laksh0762@gmail.com",
    //         to: regInfo[0].email_id,
    //         subj: subject,
    //         msg: message,
    //       };

    //       let text = "Announcement from ACT!";
    //       let html = ` <html>  <p>Dear${regInfo[0].first_name} ${regInfo[0].last_name},</p>
    //                   <p> Thank you for registering for the APR Run scheduled for 10th December 2023. Your registration has been successful under the ${regClass[0].category_name} category.</p>
    //                   <p> The receipt for the payment and registration details are find below links.</p>
    //                   <p> For registration details, please refer  https://aprmarathon.org/#/home/registration-details </p>
    //                   <p> For payment details, please refer https://aprmarathon.org/#/home/payment-history.</p>
    //                   <p> Thank you,</p>
    //                   <p> APR Charitable Trust (ACT)</p>
    //                   <p></p> APR Run team</p></html> `;

    //       let mailResponse = await mail.mail(obj.to, obj.subj, html);
    //       console.log("mailResponse", mailResponse);
    //       if (mailResponse == true) {
    //         //insert into notification table
    //         let notifObj = {
    //           registratn_id: payInfo[0].registrant_id_ref,
    //           notification_type: "notification",
    //           message: `You have successfully registered for marathon under the category ${regClass[0].category_name}`,
    //           subject: "payment success!",
    //           event_id: eventInfo[0].event_id,

    //           created_by: null,
    //         };

    //         const notifiication = await db.sequelize.query(
    //           query.createNotification,
    //           {
    //             replacements: [
    //               notifObj.notification_type,
    //               notifObj.subject,
    //               notifObj.message,
    //               "registrant",
    //               notifObj.registratn_id,
    //               notifObj.event_id,
    //               notifObj.created_by,
    //             ],
    //             type: QueryTypes.INSERT,
    //           }
    //         );

    //         console.log("line 1726 : notification");

    //         //push notification
    //         // let title = notifObj.subject;
    //         // let body =  notifObj.message;
    //         // let token = regInfo[0].notif_token;
    //         // const sendNotif = await pushNotif.notification(title,body,token);
    //         res.status(200).send(
    //           // registrant_id: payInfo[0].registrant_id_ref,
    //           // order_id: payInfo[0].order_id_ref,
    //           // booking_id: getOrderInfo[0].booking_id_ref,
    //           // event_id: eventInfo[0].event_id,
    //           // status: response,

    //           "Payment success...!. Check your mail for more details"
    //         );
    //       }
    //     } else {
    //       res.status(201).json("error occured, Please check the data");
    //     }
    //   }
    // } else {
    //   if (
    //     response.code === "PAYMENT_ERROR" ||
    //     response.code === "INTERNAL_SERVER_ERROR"
    //   ) {
    //     let payObj = response;

    //     console.log("payment failed", response);
    //     //insert into ticket info and payment info and update in order and runner table
    //     let obj1 = {
    //       registrant_id: payInfo[0].registrant_id_ref,
    //       //runner_id: runnerInfo[i].runner_id,
    //       event_id: eventInfo[0].event_id,
    //       registrant_class_id: getBookingInfo[0].registrant_class_ref,
    //       order_id: payInfo[0].order_id_ref,
    //       // ticket_status: '',
    //       payment_type: "phone pe",
    //       payment_status: "failed",
    //       // payment_amount: amount,
    //       payment_additional_amount: null,
    //       //payment_date: payment_date,
    //       order_status: "failed",
    //       runner_payment_status: "unpaid",
    //       payment_reference_id: null,
    //       merchant_id: null,
    //       merchant_transaction_id: null,
    //       provider_reference_id: null,
    //       reg_payment_user_id: regInfo[0].reg_payment_user_id,
    //     };

    //     const update_payment = await updatePayment(
    //       payInfo[0].order_id_ref,
    //       payInfo[0].registrant_id_ref,
    //       payObj,
    //       obj1.provider_reference_id
    //     );
    //     if (update_payment === 1) {
    //       //const addTicket = await createTicket(obj, ticket_id);

    //       //update order_info and runner_ifo table
    //       const updateOrder = await updateOrderStatus(
    //         getOrderInfo[0].booking_id_ref,
    //         payInfo[0].order_id_ref,
    //         obj1.order_status
    //       );
    //       // const updateRunner = await updateRunnerPayment(
    //       //   obj1.runner_payment_status,
    //       //   getOrderInfo[0].booking_id_ref,
    //       //   runnerInfo[i].runner_id
    //       // );
    //     }

    //     //insert into notification table
    //     let notifObj = {
    //       registratn_id: payInfo[0].registrant_id_ref,
    //       notification_type: "notification",
    //       message: `Your registraion for APR-marathon under the category ${regClass[0].category_name} is failed. Please retry`,
    //       subject: "payment failed!",
    //       event_id: eventInfo[0].event_id,

    //       created_by: null,
    //     };

    //     const notifiication = await db.sequelize.query(query.createNotification, {
    //       replacements: [
    //         notifObj.notification_type,
    //         notifObj.subject,
    //         notifObj.message,
    //         "registrant",
    //         notifObj.registratn_id,
    //         notifObj.event_id,
    //         notifObj.created_by,
    //       ],
    //       type: QueryTypes.INSERT,
    //     });

    //     // //push notification
    //     // let title = notifObj.subject;
    //     // let body =  notifObj.message;
    //     // let token = regInfo[0].notif_token;
    //     // const sendNotif = await pushNotif.notification(title,body,token);

    //     res.status(201).send(
    //       // registrant_id: payInfo[0].registrant_id_ref,
    //       // order_id: payInfo[0].order_id_ref,
    //       // booking_id: getOrderInfo[0].booking_id_ref,
    //       // event_id: eventInfo[0].event_id,
    //       //status: response,
    //       "your payment failed, please try again"
    //     );
    //   } else {
    //     if (response.code === "PAYMENT_PENDING") {
    //       let payObj = response;

    //       console.log("pending");

    //       let providerReferenceId = null;
    //       const update_payment = await updatePayment(
    //         payInfo[0].order_id_ref,
    //         payInfo[0].registrant_id_ref,
    //         payObj,
    //         providerReferenceId
    //       );
    //       if (update_payment === 1) {
    //         //update order table
    //         let order_status = "pending";
    //         const updateOrder = await updateOrderStatus(
    //           getOrderInfo[0].booking_id_ref,
    //           payInfo[0].order_id_ref,
    //           order_status
    //         );
    //         //should check

    //         if (updateOrder == 1) {
    //           res.status(200).send(
    //             // registrant_id: payInfo[0].registrant_id_ref,
    //             // order_id: payInfo[0].order_id_ref,
    //             // booking_id: getOrderInfo[0].booking_id_ref,
    //             // event_id: eventInfo[0].event_id,
    //             // status: response,
    //             "your payment is pending, please visit the registration details page"
    //           );
    //         } else {
    //           console.log("oder update failed");
    //         }

    //       }
    //     }
    //   }
    // }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
};

const callBackUrl = async (req, res) => {
  try {
    console.log("call back url testing:");
    console.log(req.body);
    //const jsonString = atob(req.body.response);
    let base64String = req.body.response;
    const binaryBuffer = Buffer.from(base64String, "base64");

    const binaryString = binaryBuffer.toString("binary");
    const response = JSON.parse(binaryString);

    console.log(
      "merchant_transaction_id  1370: ",
      response.data.merchantTransactionId
    );
    console.log("merchant_transaction_id 1371", response.data);

    const merchant_transaction_id = response.data.merchantTransactionId;

    const payInfo = await db.sequelize.query(query.paymentInfo, {
      replacements: [merchant_transaction_id],
      type: QueryTypes.SELECT,
    });

    const regInfo = await db.sequelize.query(query.getRegistrant, {
      replacements: [payInfo[0].registrant_id_ref],
      type: QueryTypes.SELECT,
    });

    const eventInfo = await db.sequelize.query(query.activeEvent, {
      type: QueryTypes.SELECT,
    });

    const getOrderInfo = await db.sequelize.query(query.orderInfo, {
      replacements: [payInfo[0].order_id_ref, payInfo[0].registrant_id_ref],
      type: QueryTypes.SELECT,
    });

    const getBookingInfo = await db.sequelize.query(query.bookingInfo, {
      replacements: [
        getOrderInfo[0].booking_id_ref,
        payInfo[0].registrant_id_ref,
      ],
      type: QueryTypes.SELECT,
    });

    const classAmount = await db.sequelize.query(query.getPrice, {
      replacements: [getBookingInfo[0].registrant_class_ref],
      thype: QueryTypes.SELECT,
    });
    const registrantClass = await db.sequelize.query(query.regClass, {
      replacements: [getBookingInfo[0].registrant_class_ref],
      thype: QueryTypes.SELECT,
    });

    const regClass = registrantClass[0];

    let class_amount = classAmount[0].category_price;

    const regType = await registrantType(getBookingInfo[0].registrant_type_ref);
    console.log("line 1721: ", regType);

    const runnerInfo = await db.sequelize.query(query.runnerDetails, {
      replacements: [getOrderInfo[0].booking_id_ref],
      type: QueryTypes.SELECT,
    });

    let payObj = response;

    //console.log("line 828:", payObj);

    let year = eventInfo[0].event_year;

    let amount = Number(response.data.amount) / 100;

    console.log("line 1398: ", amount);

    if (response.code === "PAYMENT_SUCCESS") {
      //insert into ticket info then update in order and runner table and payment info
      //1--> ticket info table
      if (runnerInfo.length > 0) {
        console.log("line 1399: payment success 1");

        for (let i = 0; i < runnerInfo.length; i++) {
          const getRunCat = await db.sequelize.query(query.runCat, {
            replacements: [runnerInfo[i].run_category_id_ref],
            type: QueryTypes.SELECT,
          });

          let obj = {
            registrant_id: payInfo[0].registrant_id_ref,
            runner_id: runnerInfo[i].runner_id,
            event_id: eventInfo[0].event_id,
            registrant_class_id: getBookingInfo[0].registrant_class_ref,
            order_id: payInfo[0].order_id_ref,
            ticket_status: "issued",
            payment_type: "phone pe",
            payment_status: "success",
            payment_amount: amount,
            payment_additional_amount: null,
            //payment_date: payment_date,
            payment_reference_id: response.data.transactionId,
            order_status: "success",
            runner_payment_status: "paid",
            merchant_id: response.merchantId,
            merchant_transaction_id: response.merchantTransactionId,
            provider_reference_id: response.data.transactionId,
            reg_payment_user_id: regInfo[0].reg_payment_user_id,
          };
          // let bib_number = await generateBib(
          //   getRunCat[0].race_type_name,
          //   getRunCat[0].race_type_id,
          //   obj.event_id
          // );

          console.log("runner count 1461", i);
          //console.log("line 1433 bib_number:", bib_number);

          if (regType.type_name == "marathon runners") {
            console.log("test");

            if (getRunCat[0].race_type_name === "1k") {
              let runner = await runnerCount(
                getRunCat[0].race_type_id,
                eventInfo[0].event_id
              );

              const salt = await key();
              let ticket_id =
                year + "100" + (Number(1000) + Number(runner)) + salt;

              console.log("ticket_id  line 1448 ", payObj.code);

              const update_payment = await updatePaymentStatus(
                payInfo[0].order_id_ref,
                payInfo[0].registrant_id_ref,
                payObj,
                obj.provider_reference_id
              );
              if (update_payment === 1) {
                const addTicket = await createTicket(obj, ticket_id);

                //update order_info and runner_ifo table

                if (addTicket === 1) {
                  const updateOrder = await updateOrderStatus(
                    getOrderInfo[0].booking_id_ref,
                    payInfo[0].order_id_ref,
                    obj.order_status
                  );
                  if (updateOrder === 1) {
                    let bib_number = await generateBib(
                      getRunCat[0].race_type_name,
                      getRunCat[0].race_type_id,
                      obj.event_id
                    );
                    const updateRunner = await updateRunnerPayment(
                      obj.runner_payment_status,
                      bib_number,
                      getOrderInfo[0].booking_id_ref,
                      //  changes on 25-11-23
                      runnerInfo[i].runner_id,
                      getRunCat[0].race_type_name,
                      getRunCat[0].race_type_id,
                      obj.event_id
                    );

                    if (updateRunner == 1) {
                      console.log("runner info updated line 1476");
                    }
                  } else {
                    console.log({ err: "create ticket error" });
                  }
                } else {
                  console.log({ err: "update order error" });
                }
              }
            } else {
              if (getRunCat[0].race_type_name === "5k") {
                let runner = await runnerCount(
                  getRunCat[0].race_type_id,
                  eventInfo[0].event_id
                );

                const salt = await key();
                let ticket_id =
                  year + "100" + (Number(5000) + Number(runner)) + salt;

                console.log("ticket_id 1496 ", ticket_id);

                // const update_payment = await updatePayment(
                //   payInfo[0].order_id_ref,
                //   payInfo[0].registrant_id_ref,
                //   payObj,
                //   obj.provider_reference_id
                // );
                // if (update_payment === 1) {
                //   const addTicket = await createTicket(obj, ticket_id);

                //   //update order_info and runner_ifo table
                //   const updateOrder = await updateOrderStatus(
                //     getOrderInfo[0].booking_id_ref,
                //     payInfo[0].order_id_ref,
                //     obj.order_status
                //   );
                //   const updateRunner = await updateRunnerPayment(
                //     obj.runner_payment_status,
                //     bib_number,
                //     getOrderInfo[0].booking_id_ref,
                //     runnerInfo[i].runner_id
                //   );
                // }

                const update_payment = await updatePaymentStatus(
                  payInfo[0].order_id_ref,
                  payInfo[0].registrant_id_ref,
                  payObj,
                  obj.provider_reference_id
                );
                if (update_payment === 1) {
                  const addTicket = await createTicket(obj, ticket_id);

                  //update order_info and runner_ifo table

                  if (addTicket === 1) {
                    const updateOrder = await updateOrderStatus(
                      getOrderInfo[0].booking_id_ref,
                      payInfo[0].order_id_ref,
                      obj.order_status
                    );
                    if (updateOrder === 1) {
                      let bib_number = await generateBib(
                        getRunCat[0].race_type_name,
                        getRunCat[0].race_type_id,
                        obj.event_id
                      );
                      const updateRunner = await updateRunnerPayment(
                        obj.runner_payment_status,
                        bib_number,
                        getOrderInfo[0].booking_id_ref,
                        runnerInfo[i].runner_id,
                        //  changes on 25-11-23
                        //runnerInfo[i].runner_id,
                        getRunCat[0].race_type_name,
                        getRunCat[0].race_type_id,
                        obj.event_id
                      );

                      if (updateRunner == 1) {
                        console.log("runner info updated 1547");
                      }
                    } else {
                      console.log({ err: "create ticket error" });
                    }
                  } else {
                    console.log({ err: "update order error" });
                  }
                }
              } else {
                if (getRunCat[0].race_type_name === "10k") {
                  let runner = await runnerCount(
                    getRunCat[0].race_type_id,
                    eventInfo[0].event_id
                  );

                  const salt = await key();
                  let ticket_id =
                    year + "100" + (Number(10000) + Number(runner)) + salt;

                  console.log("ticket_id ", ticket_id);

                  const update_payment = await updatePaymentStatus(
                    payInfo[0].order_id_ref,
                    payInfo[0].registrant_id_ref,
                    payObj,
                    obj.provider_reference_id
                  );
                  if (update_payment === 1) {
                    //const addTicket = await createTicket(obj, ticket_id);

                    //update order_info and runner_ifo table
                    const updateOrder = await updateOrderStatus(
                      getOrderInfo[0].booking_id_ref,
                      payInfo[0].order_id_ref,
                      obj.order_status
                    );
                    if (updateOrder == 1) {
                      let bib_number = await generateBib(
                        getRunCat[0].race_type_name,
                        getRunCat[0].race_type_id,
                        obj.event_id
                      );
                      const updateRunner = await updateRunnerPayment(
                        obj.runner_payment_status,
                        bib_number,
                        getOrderInfo[0].booking_id_ref,
                        runnerInfo[i].runner_id,
                        //  changes on 25-11-23
                        //  runnerInfo[i].runner_id,
                        getRunCat[0].race_type_name,
                        getRunCat[0].race_type_id,
                        obj.event_id
                      );

                      if (updateRunner == 1) {
                        console.log("Runner info updated 1593");
                      }
                    } else {
                      console.log("order updated failed");
                    }
                  } else {
                    console.log("payment updated failed");
                  }
                }
              }
            }
          } else {
            if (regType.type_name == "donors with runners") {
              console.log("test1");

              if (getRunCat[0].race_type_name === "1k") {
                let runner = await runnerCount(
                  getRunCat[0].race_type_id,
                  eventInfo[0].event_id
                );

                const salt = await key();
                let ticket_id =
                  year + "010" + (Number(1000) + Number(runner)) + salt;

                console.log("ticket_id 1618", payObj.code);

                const update_payment = await updatePaymentStatus(
                  payInfo[0].order_id_ref,
                  payInfo[0].registrant_id_ref,
                  payObj,
                  obj.provider_reference_id
                );
                console.log(update_payment);
                if (update_payment === 1) {
                  const addTicket = await createTicket(obj, ticket_id);
                  if (addTicket == 1) {
                    //update order_info and runner_ifo table
                    const updateOrder = await updateOrderStatus(
                      getOrderInfo[0].booking_id_ref,
                      payInfo[0].order_id_ref,
                      obj.order_status
                    );
                    if (updateOrder == 1) {
                      console.log("line 1870");

                      let bib_number = await generateBib(
                        getRunCat[0].race_type_name,
                        getRunCat[0].race_type_id,
                        obj.event_id
                      );
                      const updateRunner = await updateRunnerPayment(
                        obj.runner_payment_status,
                        bib_number,
                        getOrderInfo[0].booking_id_ref,
                        runnerInfo[i].runner_id,
                        //  changes on 25-11-23
                        // runnerInfo[i].runner_id,
                        getRunCat[0].race_type_name,
                        getRunCat[0].race_type_id,
                        obj.event_id
                      );

                      if (updateRunner === 1) {
                        console.log("runner info updated 1646");
                      }
                    } else {
                      console.log("order update failed");
                    }
                  } else {
                    console.log("order update failed");
                  }
                } else {
                  console.log("payment update failed");
                }
              } else {
                if (getRunCat[0].race_type_name === "5k") {
                  let runner = await runnerCount(
                    getRunCat[0].race_type_id,
                    eventInfo[0].event_id
                  );
                  const salt = await key();
                  let ticket_id =
                    year + "010" + (Number(5000) + Number(runner)) + salt;

                  console.log("ticket_id   1667", ticket_id);
                  const update_payment = await updatePaymentStatus(
                    payInfo[0].order_id_ref,
                    payInfo[0].registrant_id_ref,
                    payObj,
                    obj.provider_reference_id
                  );
                  console.log(update_payment);
                  if (update_payment === 1) {
                    const addTicket = await createTicket(obj, ticket_id);
                    if (addTicket == 1) {
                      //update order_info and runner_ifo table
                      const updateOrder = await updateOrderStatus(
                        getOrderInfo[0].booking_id_ref,
                        payInfo[0].order_id_ref,
                        obj.order_status
                      );
                      if (updateOrder == 1) {
                        console.log("line 1685");
                        let bib_number = await generateBib(
                          getRunCat[0].race_type_name,
                          getRunCat[0].race_type_id,
                          obj.event_id
                        );
                        const updateRunner = await updateRunnerPayment(
                          obj.runner_payment_status,
                          bib_number,
                          getOrderInfo[0].booking_id_ref,
                          runnerInfo[i].runner_id,
                          //  changes on 25-11-23
                          // runnerInfo[i].runner_id,
                          getRunCat[0].race_type_name,
                          getRunCat[0].race_type_id,
                          obj.event_id
                        );

                        if (updateRunner === 1) {
                          console.log("runner info updated 1694");
                        }
                      } else {
                        console.log("order update failed");
                      }
                    } else {
                      console.log("order update failed");
                    }
                  } else {
                    console.log("payment update failed");
                  }
                } else {
                  if (getRunCat[0].race_type_name === "10k") {
                    let runner = await runnerCount(
                      getRunCat[0].race_type_id,
                      eventInfo[0].event_id
                    );

                    console.log("line 1908: ", runner);
                    const salt = await key();
                    let ticket_id =
                      year + "010" + (Number(10000) + Number(runner)) + salt;

                    console.log("ticket_id 1717 ", ticket_id);

                    const update_payment = await updatePaymentStatus(
                      payInfo[0].order_id_ref,
                      payInfo[0].registrant_id_ref,
                      payObj,
                      obj.provider_reference_id
                    );
                    console.log(update_payment);
                    if (update_payment === 1) {
                      const addTicket = await createTicket(obj, ticket_id);
                      if (addTicket == 1) {
                        //update order_info and runner_ifo table
                        const updateOrder = await updateOrderStatus(
                          getOrderInfo[0].booking_id_ref,
                          payInfo[0].order_id_ref,
                          obj.order_status
                        );
                        if (updateOrder == 1) {
                          console.log("line 1736");
                          let bib_number = await generateBib(
                            getRunCat[0].race_type_name,
                            getRunCat[0].race_type_id,
                            obj.event_id
                          );

                          console.log(bib_number);
                          const updateRunner = await updateRunnerPayment(
                            obj.runner_payment_status,
                            bib_number,
                            getOrderInfo[0].booking_id_ref,
                            runnerInfo[i].runner_id,
                            //  changes on 25-11-23
                            // runnerInfo[i].runner_id,
                            getRunCat[0].race_type_name,
                            getRunCat[0].race_type_id,
                            obj.event_id
                          );

                          if (updateRunner == 1) {
                            console.log("runner info updated  1747");
                          }
                        } else {
                          console.log("order update failed");
                        }
                      } else {
                        console.log("ticket update failed");
                      }
                    } else {
                      console.log("payment updated failed");
                    }
                  }
                }
              }
            }
          }
        }

        let subject = `Registration confirmation mail`;
        let message = `Hai, ${regInfo[0].first_name} ${regInfo[0].last_name} you are successfully registered for APR marathon under the class ${regClass[0].category_name}. To know your runner details, please visit the website https://aprmarathon.org `;
        //console.log("line309:",count);
        // if (count === 1) {
        let obj = {
          ///from: "laksh0762@gmail.com",
          to: regInfo[0].email_id,
          subj: subject,
          msg: message,
        };

        let text = "Announcement from ACT!";
        let html =
          //  `<html>
          //                <title> ${text}</title>
          //                <body><p>${obj.msg}</p></body>
          //                </html>`;

          ` <html>  <p>Dear${regInfo[0].first_name} ${regInfo[0].last_name}</p>
                    <p> Thank you for registering for the APR Run scheduled for 10th December 2023. Your registration has been successful under the  ${regClass[0].category_name} category.</p>
                    <p> The receipt for the payment and registration details are find below links.</p>
                    <p> For registration details, please refer https://aprmarathon.org/#/home/registration-details</p>
                    <p> For payment details, please refer https://aprmarathon.org/#/home/payment-history.</p>
                    <p> Thank you,</p>
                    <p> APR Charitable Trust (ACT)</p>
                    <p></p> APR Run team</p></html> `;

        let mailResponse = await mail.mail(obj.to, obj.subj, html);
        console.log("mailResponse   1793", mailResponse);
        if (mailResponse == true) {
          //insert into notification table
          let notifObj = {
            registratn_id: payInfo[0].registrant_id_ref,
            notification_type: "notification",
            message: `You have successfully registered for marathon under the category ${regClass[0].category_name}`,
            subject: "payment success!",
            event_id: eventInfo[0].event_id,

            created_by: null,
          };

          const notifiication = await db.sequelize.query(
            query.createNotification,
            {
              replacements: [
                notifObj.notification_type,
                notifObj.subject,
                notifObj.message,
                "registrant",
                notifObj.registratn_id,
                notifObj.event_id,
                notifObj.created_by,
              ],
              type: QueryTypes.INSERT,
            }
          );

          //push notification
          // let title = notifObj.subject;
          // let body =  notifObj.message;
          // let token = regInfo[0].notif_token;
          // const sendNotif = await pushNotif.notification(title,body,token);

          res.status(200).send(
            // registrant_id: payInfo[0].registrant_id_ref,
            // order_id: payInfo[0].order_id_ref,
            // booking_id: getOrderInfo[0].booking_id_ref,
            // event_id: eventInfo[0].event_id,
            //status: response,

            "Payment success...!, check your mail for more details"
          );

          // } else {
          //   res.status(201).json("error occured, Please check the data");
          // }
        }
      } else {
        console.log(" 1843: payment   success 2");

        let obj = {
          registrant_id: payInfo[0].registrant_id_ref,
          runner_id: null,
          event_id: eventInfo[0].event_id,
          registrant_class_id: getBookingInfo[0].registrant_class_ref,
          order_id: payInfo[0].order_id_ref,
          ticket_status: "issued",
          payment_type: "phone pe",
          payment_status: "success",
          payment_amount: amount,
          payment_additional_amount: null,
          // payment_date: payment_date,
          payment_reference_id: null,
          order_status: "success",
          runner_payment_status: "paid",
          merchant_id: response.data.merchantId,
          merchant_transaction_id: response.data.merchantTransactionId,
          provider_reference_id: response.data.transactionId,
          reg_payment_user_id: regInfo[0].reg_payment_user_id,
        };

        // donor have no runners, so update the stauts in booking_info and ordr_info table, pyment table
        ///changes done by sugan 1/11/2023
        const regCount = await db.sequelize.query(query.regCount, {
          replacements: [eventInfo[0].event_id],
          type: QueryTypes.SELECT,
        });
        const salt = await key();
        //let yera = eventInfo[0].event_year;
        let ticket_id = year + "001" + regCount.length + salt;
        const update_payment = await updatePaymentStatus(
          payInfo[0].order_id_ref,
          payInfo[0].registrant_id_ref,
          payObj,
          obj.provider_reference_id
        );

        let count = 0;

        if (update_payment === 1) {
          const addTicket = await createTicket(obj, ticket_id);

          //update order_info and runner_ifo table

          const updateOrder = await updateOrderStatus(
            getOrderInfo[0].booking_id_ref,
            payInfo[0].order_id_ref,
            obj.order_status
          );

          if (addTicket == 1 && updateOrder == 1) {
            count++;
          }
        }

        if (count === 1) {
          let subject = `Registration confirmation mail`;
          let message = `Hai, ${regInfo[0].first_name} ${regInfo[0].last_name} you are successfully registered for APR marathon under the class ${regClass[0].category_name}. To know your runner details, please visit the website https://aprmarathon.org `;
          //console.log("line309:",count);
          // if (count === 1) {
          let obj = {
            // from: "laksh0762@gmail.com",
            to: regInfo[0].email_id,
            subj: subject,
            msg: message,
          };

          let text = "Announcement from ACT!";
          let html = ` <html>  <p>Dear${regInfo[0].first_name} ${regInfo[0].last_name},</p>
                    <p> Thank you for registering for the APR Run scheduled for 10th December 2023. Your registration has been successful under the ${regClass[0].category_name} category.</p>
                    <p> The receipt for the payment and registration details are find below links.</p>
                    <p> For registration details, please refer  https://aprmarathon.org/#/home/registration-details </p>
                    <p> For payment details, please refer https://aprmarathon.org/#/home/payment-history.</p>
                    <p> Thank you,</p>
                    <p> APR Charitable Trust (ACT)</p>
                    <p></p> APR Run team</p></html> `;

          let mailResponse = await mail.mail(obj.to, obj.subj, html);
          console.log("mailResponse   1923", mailResponse);
          if (mailResponse == true) {
            //insert into notification table
            let notifObj = {
              registratn_id: payInfo[0].registrant_id_ref,
              notification_type: "notification",
              message: `You have successfully registered for marathon under the category ${regClass[0].category_name}`,
              subject: "payment success!",
              event_id: eventInfo[0].event_id,

              created_by: null,
            };

            const notifiication = await db.sequelize.query(
              query.createNotification,
              {
                replacements: [
                  notifObj.notification_type,
                  notifObj.subject,
                  notifObj.message,
                  "registrant",
                  notifObj.registratn_id,
                  notifObj.event_id,
                  notifObj.created_by,
                ],
                type: QueryTypes.INSERT,
              }
            );

            console.log("line 1952 : notification");

            //push notification
            // let title = notifObj.subject;
            // let body =  notifObj.message;
            // let token = regInfo[0].notif_token;
            // const sendNotif = await pushNotif.notification(title,body,token);
            res.status(200).send(
              // registrant_id: payInfo[0].registrant_id_ref,
              // order_id: payInfo[0].order_id_ref,
              // booking_id: getOrderInfo[0].booking_id_ref,
              // event_id: eventInfo[0].event_id,
              // status: response,

              "Payment success...!. Check your mail for more details"
            );
          }
        } else {
          res.status(201).json("error occured, Please check the data");
        }
      }
    } else {
      if (
        response.code === "PAYMENT_ERROR" ||
        response.code === "INTERNAL_SERVER_ERROR"
      ) {
        let payObj = response;

        console.log("payment failed 1980", response);
        //insert into ticket info and payment info and update in order and runner table
        let obj1 = {
          registrant_id: payInfo[0].registrant_id_ref,
          //runner_id: runnerInfo[i].runner_id,
          event_id: eventInfo[0].event_id,
          registrant_class_id: getBookingInfo[0].registrant_class_ref,
          order_id: payInfo[0].order_id_ref,
          // ticket_status: '',
          payment_type: "phone pe",
          payment_status: "failed",
          // payment_amount: amount,
          payment_additional_amount: null,
          //payment_date: payment_date,
          order_status: "failed",
          runner_payment_status: "unpaid",
          payment_reference_id: response.data.transactionId,
          merchant_id: response.data.merchantId,
          merchant_transaction_id: response.data.merchantTransactionId,
          provider_reference_id: response.data.transactionId,
          reg_payment_user_id: regInfo[0].reg_payment_user_id,
        };

        const update_payment = await updatePaymentStatus(
          payInfo[0].order_id_ref,
          payInfo[0].registrant_id_ref,
          payObj,
          obj1.provider_reference_id
        );
        if (update_payment === 1) {
          //const addTicket = await createTicket(obj, ticket_id);

          //update order_info and runner_ifo table
          const updateOrder = await updateOrderStatus(
            getOrderInfo[0].booking_id_ref,
            payInfo[0].order_id_ref,
            obj1.order_status
          );
          // const updateRunner = await updateRunnerPayment(
          //   obj1.runner_payment_status,
          //   getOrderInfo[0].booking_id_ref,
          //   runnerInfo[i].runner_id
          // );
        }

        //insert into notification table
        let notifObj = {
          registratn_id: payInfo[0].registrant_id_ref,
          notification_type: "notification",
          message: `Your registraion for APR-marathon under the category ${regClass[0].category_name} is failed. Please retry`,
          subject: "payment failed!",
          event_id: eventInfo[0].event_id,

          created_by: null,
        };

        const notifiication = await db.sequelize.query(
          query.createNotification,
          {
            replacements: [
              notifObj.notification_type,
              notifObj.subject,
              notifObj.message,
              "registrant",
              notifObj.registratn_id,
              notifObj.event_id,
              notifObj.created_by,
            ],
            type: QueryTypes.INSERT,
          }
        );

        // //push notification
        // let title = notifObj.subject;
        // let body =  notifObj.message;
        // let token = regInfo[0].notif_token;
        // const sendNotif = await pushNotif.notification(title,body,token);

        res.status(201).send(
          // registrant_id: payInfo[0].registrant_id_ref,
          // order_id: payInfo[0].order_id_ref,
          // booking_id: getOrderInfo[0].booking_id_ref,
          // event_id: eventInfo[0].event_id,
          //status: response,
          "your payment failed, please try again"
        );
      } else {
        if (response.code === "PAYMENT_PENDING") {
          let payObj = response;

          console.log(" payment pending   2070");

          let providerReferenceId = null;
          const update_payment = await updatePaymentStatus(
            payInfo[0].order_id_ref,
            payInfo[0].registrant_id_ref,
            payObj,
            providerReferenceId
          );
          if (update_payment === 1) {
            //update order table
            let order_status = "pending";
            const updateOrder = await updateOrderStatus(
              getOrderInfo[0].booking_id_ref,
              payInfo[0].order_id_ref,
              order_status
            );
            //should check

            if (updateOrder == 1) {
              res.status(200).send(
                // registrant_id: payInfo[0].registrant_id_ref,
                // order_id: payInfo[0].order_id_ref,
                // booking_id: getOrderInfo[0].booking_id_ref,
                // event_id: eventInfo[0].event_id,
                // status: response,
                "your payment is pending, please visit the registration details page"
              );
            } else {
              console.log("oder update failed");
            }
          }
        }
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
};

const updatePayment = async (
  order_id,
  registrant_id,
  payObj,
  provider_reference_id
) => {
  return new Promise(async (resolve, reject) => {
    let count = 0;

    console.log("line 1258", payObj);

    console.log("line 1260: ", provider_reference_id);

    if (payObj.code === "PAYMENT_SUCCESS") {
      let obj = {
        merchant_id: payObj.merchantId,
        provider_reference_id: payObj.transactionId,
        merchant_transaction_id: payObj.transactionId,
        payment_instrument_type: null,
        upi_utr: null,
        code: payObj.code,
        message: "payment is success",
        response_code: null,
        success_state: true,
        payment_state: "success",
        response_code_description: null,
        netbanking_pgtransaction_id: null,
        netbanking_servicetransaction_id: null,
        netbanking_banktransaction_id: null,
        netbanking_bank_id: null,
        card_cardtype: null,
        card_pgtransaction_id: null,
        card_banktransaction_id: null,
        card_pgauthorization_code: null,
        card_arn: null,
        card_bank_id: null,
        card_brn: null,
      };

      // console.log("line 1260:", obj.provider_reference_id);

      const data = await db.sequelize.query(query.updatePayment, {
        replacements: [
          "success",
          obj.code,
          obj.message,
          obj.response_code,
          obj.success_state,
          obj.payment_state,
          obj.payment_instrument_type,
          obj.upi_utr,
          obj.card_cardtype,
          obj.card_pgtransaction_id,
          obj.card_banktransaction_id,
          obj.card_pgauthorization_code,
          obj.card_arn,
          obj.card_bank_id,
          obj.card_brn,
          obj.netbanking_pgtransaction_id,
          obj.netbanking_servicetransaction_id,
          obj.netbanking_banktransaction_id,
          obj.netbanking_bank_id,
          obj.provider_reference_id,
          obj.response_code_description,
          order_id,
          registrant_id,
          obj.merchant_transaction_id,
        ],
        type: QueryTypes.UPDATE,
      });

      if (data[1] > 0) {
        count++;
        console.log("line 1416: ", data);
      }
      console.log(count);
    } else {
      if (payObj.code === "PAYMENT_ERROR") {
        let obj = {
          merchant_id: payObj.merchantId,
          provider_reference_id: payObj.transactionId,
          merchant_transaction_id: payObj.transactionId,
          payment_instrument_type: null,
          upi_utr: null,
          code: payObj.code,
          message: "payment failed",
          response_code: null,
          success_state: false,
          payment_state: "failed",
          response_code_description: null,
          netbanking_pgtransaction_id: null,
          netbanking_servicetransaction_id: null,
          netbanking_banktransaction_id: null,
          netbanking_bank_id: null,
          card_cardtype: null,
          card_pgtransaction_id: null,
          card_banktransaction_id: null,
          card_pgauthorization_code: null,
          card_arn: null,
          card_bank_id: null,
          card_brn: null,
        };

        const data = await db.sequelize.query(query.updatePayment, {
          replacements: [
            "failed",
            obj.code,
            obj.message,
            obj.response_code,
            obj.success_state,
            obj.payment_state,
            obj.payment_instrument_type,
            obj.upi_utr,
            obj.card_cardtype,
            obj.card_pgtransaction_id,
            obj.card_banktransaction_id,
            obj.card_pgauthorization_code,
            obj.card_arn,
            obj.card_bank_id,
            obj.card_brn,
            obj.netbanking_pgtransaction_id,
            obj.netbanking_servicetransaction_id,
            obj.netbanking_banktransaction_id,
            obj.netbanking_bank_id,
            obj.provider_reference_id,
            obj.response_code_description,
            order_id,
            registrant_id,
            obj.merchant_transaction_id,
          ],
          type: QueryTypes.UPDATE,
        });

        if (data[1] > 0) {
          count++;
          console.log("line 1416: ", data);
        }
      } else {
        if (payObj.code === "PAYMENT_PENDING") {
          let obj = {
            merchant_id: payObj.merchantId,
            provider_reference_id: null,
            merchant_transaction_id: payObj.transactionId,
            payment_instrument_type: null,
            upi_utr: null,
            code: false,
            message: "payment is pending",
            response_code: null,
            success_state: true,
            payment_state: "success",
            response_code_description: null,
            netbanking_pgtransaction_id: null,
            netbanking_servicetransaction_id: null,
            netbanking_banktransaction_id: null,
            netbanking_bank_id: null,
            card_cardtype: null,
            card_pgtransaction_id: null,
            card_banktransaction_id: null,
            card_pgauthorization_code: null,
            card_arn: null,
            card_bank_id: null,
            card_brn: null,
          };

          const data = await db.sequelize.query(query.updatePayment, {
            replacements: [
              "pending",
              obj.code,
              obj.message,
              obj.response_code,
              obj.success_state,
              obj.payment_state,
              obj.payment_instrument_type,
              obj.upi_utr,
              obj.card_cardtype,
              obj.card_pgtransaction_id,
              obj.card_banktransaction_id,
              obj.card_pgauthorization_code,
              obj.card_arn,
              obj.card_bank_id,
              obj.card_brn,
              obj.netbanking_pgtransaction_id,
              obj.netbanking_servicetransaction_id,
              obj.netbanking_banktransaction_id,
              obj.netbanking_bank_id,
              obj.provider_reference_id,
              obj.response_code_description,
              order_id,
              registrant_id,
              obj.merchant_transaction_id,
            ],
            type: QueryTypes.UPDATE,
          });

          if (data[1] > 0) {
            count++;
            console.log("line 1416: ", data);
          }
        }
      }
    }

    if (count === 1) {
      return resolve(1);
    }
  });
};

const checkPaymentStatus = async (req, res) => {
  const {
    registrant_id,
    order_id,
    booking_id,
    event_id,
    registrant_class,
    merchant_transaction_id,
    provider_reference_id,
  } = req.body;

  const regInfo = await db.sequelize.query(query.getRegistrant, {
    replacements: [registrant_id],
    type: QueryTypes.SELECT,
  });

  const eventInfo = await db.sequelize.query(query.activeEvent, {
    type: QueryTypes.SELECT,
  });

  const getOrderInfo = await db.sequelize.query(query.orderInfo, {
    replacements: [order_id, registrant_id],
    type: QueryTypes.SELECT,
  });

  const getBookingInfo = await db.sequelize.query(query.bookingInfo, {
    replacements: [getOrderInfo[0].booking_id_ref, registrant_id],
    type: QueryTypes.SELECT,
  });

  const classAmount = await db.sequelize.query(query.getPrice, {
    replacements: [getBookingInfo[0].registrant_class_ref],
    thype: QueryTypes.SELECT,
  });

  let class_amount = getOrderInfo[0].total_amount;

  const jsonObject = {
    //merchantId: "PGTESTPAYUAT93",
    //merchantId: "APRCHARITABLEONLINE",
    merchantId: merchant_id,
    merchantTransactionId: merchant_transaction_id,
    merchantUserId: regInfo[0].reg_user_id,

    amount: Number(class_amount) * 100,
    redirectUrl: re_directUrl,
    // "https://stagingapi.aprmarathon.org/registerticket/api/payment/redirect-url",
    // `https://apr-marathon-registerticket-render.onrender.com/api/payment/redirect-url`,
    //`http://localhost:4002/api/payment/redirect-url`,
    redirectMode: "POST",
    callbackUrl: call_backUrl,
    // "https://stagingapi.aprmarathon.org/registerticket/api/payment/callback-url",
    //`https://apr-marathon-registerticket-render.onrender.com/api/payment/callback-url`,
    //`http://localhost:4002/api/payment/callback-url`,

    //mobileNumber: "9360759463",
    mobileNumber: regInfo[0].mobile_number,
    paymentInstrument: {
      type: "PAY_PAGE",
    },
  };
  console.log("line 971 in payment controller: ", jsonObject.redirectUrl);
  const jsonString = JSON.stringify(jsonObject);

  const base64String = Buffer.from(jsonString).toString("base64");
  //const base64String = btoa(jsonString);
  console.log("base64", base64String);

  const paymentObj = {
    // baseUrl: "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay",
    // baseUrl: "https://api.phonepe.com/apis/hermes/pg/v1/pay",
    baseUrl: base_url,
    payload: base64String,
    //saltKey: "875126e4-5a13-4dae-ad60-5b8c8b629035", // Replace with your salt key
    // saltKey: "a1fe6f89-a831-41ee-b8b4-219660fba3f9",
    saltKey: salt_key,
    saltIndex: "1", // Replace with your salt index
  };

  const requestData = base64String;

  function generateXVerify(payload, saltKey, saltIndex) {
    const message =
      `/pg/v1/status/${jsonObject.merchantId}/${jsonObject.merchantTransactionId}` +
      saltKey;
    const sha256Hash = crypto
      .createHash("sha256")
      .update(message)
      .digest("hex");
    const xVerify = sha256Hash + "###" + saltIndex;
    console.log("sha: ", sha256Hash);
    //console.log("salt: ", salt);
    console.log("x verify : ", xVerify);
    console.log("req data: ", requestData);

    return xVerify;
  }
  const xVerify = generateXVerify(
    paymentObj.payload,
    paymentObj.saltKey,
    paymentObj.saltIndex
  );

  try {
    const response = await axios.get(
      // `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${jsonObject.merchantId}/${jsonObject.merchantTransactionId}`,
      // `https://api.phonepe.com/apis/hermes/pg/v1/status/${jsonObject.merchantId}/${jsonObject.merchantTransactionId}`,
      `${check_status}${jsonObject.merchantId}/${jsonObject.merchantTransactionId}`,

      {
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": xVerify, // Replace with your actual API key
          "X-MERCHANT-ID": jsonObject.merchantId,
        },
      }
    );

    console.log("testing 429 error", response);

    const regType = await registrantType(getBookingInfo[0].registrant_type_ref);
    console.log("line 1721: ", regType);

    const runnerInfo = await db.sequelize.query(query.runnerDetails, {
      replacements: [getOrderInfo[0].booking_id_ref],
      type: QueryTypes.SELECT,
    });

    let payObj = response.data;
    console.log("line 1667", payObj);

    //if(payObj.data.providerReferenceId == undefined){
    //console.log("line 828:", payObj);

    //let providerReferenceId =null;

    let year = eventInfo[0].event_year;

    if (
      response.data.success === true &&
      response.data.code === "PAYMENT_SUCCESS"
    ) {
      //insert into ticket info then update in order and runner table and payment info
      //1--> ticket info table
      if (runnerInfo.length > 0) {
        console.log("payment success 1");

        for (let i = 0; i < runnerInfo.length; i++) {
          const getRunCat = await db.sequelize.query(query.runCat, {
            replacements: [runnerInfo[i].run_category_id_ref],
            type: QueryTypes.SELECT,
          });

          let obj = {
            registrant_id: registrant_id,
            runner_id: runnerInfo[i].runner_id,
            event_id: eventInfo[0].event_id,
            registrant_class_id: getBookingInfo[0].registrant_class_ref,
            order_id: order_id,
            ticket_status: "issued",
            payment_type: "phone pe",
            payment_status: "success",
            payment_amount: class_amount,
            payment_additional_amount: null,
            //payment_date: payment_date,
            payment_reference_id: response.data.data.merchantTransactionId,
            order_status: "success",
            runner_payment_status: "paid",
            merchant_id: response.data.data.merchantId,
            merchant_transaction_id: response.data.data.merchantTransactionId,
            provider_reference_id: response.data.data.transactionId,
            reg_payment_user_id: regInfo[0].reg_payment_user_id,
          };
          // let bib_number = await generateBib(
          //   getRunCat[0].race_type_name,
          //   getRunCat[0].race_type_id,
          //   obj.event_id
          // );

          if (regType.type_name == "marathon runners") {
            console.log("test");

            if (getRunCat[0].race_type_name === "1k") {
              let runner = await runnerCount(
                getRunCat[0].race_type_id,
                eventInfo[0].event_id
              );
              const salt = await key();
              let ticket_id =
                year + "100" + (Number(1000) + Number(runner)) + salt;

              // console.log("ticket_id ", payObj.success);

              const update_payment = await updatePaymentStatus(
                order_id,
                registrant_id,
                payObj,
                obj.provider_reference_id
              );
              if (update_payment === 1) {
                const addTicket = await createTicket(obj, ticket_id);
                if (addTicket == 1) {
                  //update order_info and runner_ifo table
                  const updateOrder = await updateOrderStatus(
                    getOrderInfo[0].booking_id_ref,
                    order_id,
                    obj.order_status
                  );

                  if (updateOrder == 1) {
                    let bib_number = await generateBib(
                      getRunCat[0].race_type_name,
                      getRunCat[0].race_type_id,
                      obj.event_id
                    );
                    const updateRunner = await updateRunnerPayment(
                      obj.runner_payment_status,
                      bib_number,
                      getOrderInfo[0].booking_id_ref,
                      runnerInfo[i].runner_id,
                      getRunCat[0].race_type_name,
                      getRunCat[0].race_type_id,
                      obj.event_id
                    );
                    if (updateRunner == 1) {
                      console.log("update runer success");
                    } else {
                      console.log("runner update failed");
                    }
                  } else {
                    console.log("order update failed");
                  }
                } else {
                  console.log("ticket failed");
                }
                // }
              } else {
                console.log("payment update failed");
              }
            } else {
              if (getRunCat[0].race_type_name === "5k") {
                let runner = await runnerCount(
                  getRunCat[0].race_type_id,
                  eventInfo[0].event_id
                );

                const salt = await key();
                let ticket_id =
                  year + "100" + (Number(5000) + Number(runner)) + salt;

                console.log("ticket_id ", ticket_id);

                const update_payment = await updatePaymentStatus(
                  order_id,
                  registrant_id,
                  payObj,
                  obj.provider_reference_id
                );
                if (update_payment === 1) {
                  const addTicket = await createTicket(obj, ticket_id);
                  if (addTicket == 1) {
                    //update order_info and runner_ifo table
                    const updateOrder = await updateOrderStatus(
                      getOrderInfo[0].booking_id_ref,
                      order_id,
                      obj.order_status
                    );

                    if (updateOrder == 1) {
                      let bib_number = await generateBib(
                        getRunCat[0].race_type_name,
                        getRunCat[0].race_type_id,
                        obj.event_id
                      );
                      const updateRunner = await updateRunnerPayment(
                        obj.runner_payment_status,
                        bib_number,
                        getOrderInfo[0].booking_id_ref,
                        runnerInfo[i].runner_id,
                        getRunCat[0].race_type_name,
                        getRunCat[0].race_type_id,
                        obj.event_id
                      );
                      if (updateRunner == 1) {
                        console.log("update runer success");
                      } else {
                        console.log("runner update failed");
                      }
                    } else {
                      console.log("order update failed");
                    }
                  } else {
                    console.log("ticket failed");
                  }
                  // }
                } else {
                  console.log("payment update failed");
                }
              } else {
                if (getRunCat[0].race_type_name === "10k") {
                  let runner = await runnerCount(
                    getRunCat[0].race_type_id,
                    eventInfo[0].event_id
                  );

                  const salt = await key();

                  let ticket_id =
                    year + "100" + (Number(10000) + Number(runner)) + salt;

                  console.log("ticket_id ", ticket_id);

                  console.log(order_id);
                  console.log(registrant_id);
                  console.log(payObj.data);
                  console.log(obj.provider_reference_id);
                  const update_payment = await updatePaymentStatus(
                    order_id,
                    registrant_id,
                    payObj,
                    obj.provider_reference_id
                  );
                  if (update_payment === 1) {
                    //const addTicket = await createTicket(obj, ticket_id);

                    //update order_info and runner_ifo table
                    const updateOrder = await updateOrderStatus(
                      getOrderInfo[0].booking_id_ref,
                      order_id,
                      obj.order_status
                    );
                    if (updateOrder == 1) {
                      let bib_number = await generateBib(
                        getRunCat[0].race_type_name,
                        getRunCat[0].race_type_id,
                        obj.event_id
                      );
                      const updateRunner = await updateRunnerPayment(
                        obj.runner_payment_status,
                        bib_number,
                        getOrderInfo[0].booking_id_ref,
                        runnerInfo[i].runner_id,
                        getRunCat[0].race_type_name,
                        getRunCat[0].race_type_id,
                        obj.event_id
                      );

                      if (updateRunner == 1) {
                        console.log("update runer success");
                      } else {
                        console.log("runner update failed");
                      }
                    } else {
                      console.log("order update failed");
                    }
                  } else {
                    console.log("payment update failed");
                  }
                }
              }
            }
          } else {
            if (regType.type_name == "donors with runners") {
              console.log("test1");

              if (getRunCat[0].race_type_name === "1k") {
                let runner = await runnerCount(
                  getRunCat[0].race_type_id,
                  eventInfo[0].event_id
                );

                const salt = await key();
                let ticket_id =
                  year + "010" + (Number(1000) + Number(runner)) + salt;

                console.log("ticket_id ", payObj.success);

                const update_payment = await updatePaymentStatus(
                  order_id,
                  registrant_id,
                  payObj,
                  obj.provider_reference_id
                );
                if (update_payment === 1) {
                  const addTicket = await createTicket(obj, ticket_id);
                  if (addTicket == 1) {
                    //update order_info and runner_ifo table
                    const updateOrder = await updateOrderStatus(
                      getOrderInfo[0].booking_id_ref,
                      order_id,
                      obj.order_status
                    );

                    if (updateOrder == 1) {
                      let bib_number = await generateBib(
                        getRunCat[0].race_type_name,
                        getRunCat[0].race_type_id,
                        obj.event_id
                      );
                      const updateRunner = await updateRunnerPayment(
                        obj.runner_payment_status,
                        bib_number,
                        getOrderInfo[0].booking_id_ref,
                        runnerInfo[i].runner_id,
                        getRunCat[0].race_type_name,
                        getRunCat[0].race_type_id,
                        obj.event_id
                      );
                      if (updateRunner == 1) {
                        console.log("update runer success");
                      } else {
                        console.log("runner update failed");
                      }
                    } else {
                      console.log("order update failed");
                    }
                  } else {
                    console.log("ticket failed");
                  }
                  // }
                } else {
                  console.log("payment update failed");
                }
              } else {
                if (getRunCat[0].race_type_name === "5k") {
                  let runner = await runnerCount(
                    getRunCat[0].race_type_id,
                    eventInfo[0].event_id
                  );

                  const salt = await key();
                  let ticket_id =
                    year + "010" + (Number(5000) + Number(runner)) + salt;

                  console.log("ticket_id ", ticket_id);
                  const update_payment = await updatePaymentStatus(
                    order_id,
                    registrant_id,
                    payObj,
                    obj.provider_reference_id
                  );
                  if (update_payment === 1) {
                    const addTicket = await createTicket(obj, ticket_id);
                    if (addTicket == 1) {
                      //update order_info and runner_ifo table
                      const updateOrder = await updateOrderStatus(
                        getOrderInfo[0].booking_id_ref,
                        order_id,
                        obj.order_status
                      );

                      if (updateOrder == 1) {
                        let bib_number = await generateBib(
                          getRunCat[0].race_type_name,
                          getRunCat[0].race_type_id,
                          obj.event_id
                        );
                        const updateRunner = await updateRunnerPayment(
                          obj.runner_payment_status,
                          bib_number,
                          getOrderInfo[0].booking_id_ref,
                          runnerInfo[i].runner_id,
                          getRunCat[0].race_type_name,
                          getRunCat[0].race_type_id,
                          obj.event_id
                        );
                        if (updateRunner == 1) {
                          console.log("update runer success");
                        } else {
                          console.log("runner update failed");
                        }
                      } else {
                        console.log("order update failed");
                      }
                    } else {
                      console.log("ticket failed");
                    }
                    // }
                  } else {
                    console.log("payment update failed");
                  }
                } else {
                  if (getRunCat[0].race_type_name === "10k") {
                    let runner = await runnerCount(
                      getRunCat[0].race_type_id,
                      eventInfo[0].event_id
                    );

                    console.log("line 1908: ", runner);
                    const salt = await key();
                    let ticket_id =
                      year + "010" + (Number(10000) + Number(runner)) + salt;

                    console.log("ticket_id ", ticket_id);

                    const update_payment = await updatePaymentStatus(
                      order_id,
                      registrant_id,
                      payObj,
                      obj.provider_reference_id
                    );
                    if (update_payment === 1) {
                      const addTicket = await createTicket(obj, ticket_id);
                      if (addTicket == 1) {
                        //update order_info and runner_ifo table
                        const updateOrder = await updateOrderStatus(
                          getOrderInfo[0].booking_id_ref,
                          order_id,
                          obj.order_status
                        );

                        if (updateOrder == 1) {
                          let bib_number = await generateBib(
                            getRunCat[0].race_type_name,
                            getRunCat[0].race_type_id,
                            obj.event_id
                          );
                          const updateRunner = await updateRunnerPayment(
                            obj.runner_payment_status,
                            bib_number,
                            getOrderInfo[0].booking_id_ref,
                            runnerInfo[i].runner_id,
                            getRunCat[0].race_type_name,
                            getRunCat[0].race_type_id,
                            obj.event_id
                          );
                          if (updateRunner == 1) {
                            console.log("update runer success");
                          } else {
                            console.log("runner update failed");
                          }
                        } else {
                          console.log("order update failed");
                        }
                      } else {
                        console.log("ticket failed");
                      }
                      // }
                    } else {
                      console.log("payment update failed");
                    }
                  }
                }
              }
            }
          }
        }

        let subject = `Registration confirmation mail`;
        let message = `Hai, ${regInfo[0].first_name} ${regInfo[0].last_name} you are successfully registered for APR marathon under the class ${registrant_class}. To know your runner details, please visit the website https://aprmarathon.org `;
        //console.log("line309:",count);
        // if (count === 1) {
        let obj = {
          ///from: "laksh0762@gmail.com",
          to: regInfo[0].email_id,
          subj: subject,
          msg: message,
        };

        let text = "Announcement from ACT!";
        let html =
          //  `<html>
          //                <title> ${text}</title>
          //                <body><p>${obj.msg}</p></body>
          //                </html>`;

          ` <html>  <p>Dear${regInfo[0].first_name} ${regInfo[0].last_name}</p>
                      <p> Thank you for registering for the APR Run scheduled for 10th December 2023. Your registration has been successful under the  ${registrant_class} category.</p>
                      <p> The receipt for the payment and registration details are find below links.</p>
                      <p> For registration details, please refer  https://aprmarathon.org/#/home/registration-details </p>
                      <p> For payment details, please refer https://aprmarathon.org/#/home/payment-history.</p>
                      <p> Thank you,</p>
                      <p> APR Charitable Trust (ACT)</p>
                      <p></p> APR Run team</p></html> `;

        let mailResponse = await mail.mail(obj.to, obj.subj, html);
        console.log("mailResponse", mailResponse);
        if (mailResponse == true) {
          //insert into notification table
          let notifObj = {
            registratn_id: regInfo[0].registrant_id,
            notification_type: "notification",
            message: `You have successfully registered for marathon under the category ${registrant_class}`,
            subject: "payment success!",
            event_id: event_id,

            created_by: null,
          };

          const notifiication = await db.sequelize.query(
            query.createNotification,
            {
              replacements: [
                notifObj.notification_type,
                notifObj.subject,
                notifObj.message,
                "registrant",
                notifObj.registratn_id,
                notifObj.event_id,
                notifObj.created_by,
              ],
              type: QueryTypes.INSERT,
            }
          );

          //push notification
          // let title = notifObj.subject;
          // let body =  notifObj.message;
          // let token = regInfo[0].notif_token;
          // const sendNotif = await pushNotif.notification(title,body,token);

          res.status(200).json({
            registrant_id: registrant_id,
            order_id: order_id,
            booking_id: booking_id,
            event_id: event_id,
            status: response.data,
            msg: "Payment success...!, check your mail for more details",
          });
          // } else {
          //   res.status(201).json("error occured, Please check the data");
          // }
        }
      } else {
        console.log("payment   success 2");

        let obj = {
          registrant_id: registrant_id,
          runner_id: null,
          event_id: eventInfo[0].event_id,
          registrant_class_id: getBookingInfo[0].registrant_class_ref,
          order_id: order_id,
          ticket_status: "issued",
          payment_type: "phone pe",
          payment_status: "success",
          payment_amount: class_amount,
          payment_additional_amount: null,
          // payment_date: payment_date,
          payment_reference_id: null,
          order_status: "success",
          runner_payment_status: "paid",
          merchant_id: response.data.data.merchantId,
          merchant_transaction_id: response.data.data.merchantTransactionId,
          provider_reference_id: response.data.data.transactionId,
          reg_payment_user_id: regInfo[0].reg_payment_user_id,
        };

        // donor have no runners, so update the stauts in booking_info and ordr_info table, pyment table
        ///changes done by sugan 1/11/2023
        const regCount = await db.sequelize.query(query.regCount, {
          replacements: [eventInfo[0].event_id],
          type: QueryTypes.SELECT,
        });

        //let yera = eventInfo[0].event_year;
        const salt = await key();
        let ticket_id = year + "001" + regCount.length + salt;
        const update_payment = await updatePaymentStatus(
          order_id,
          registrant_id,
          payObj,
          obj.provider_reference_id
        );

        let count = 0;

        if (update_payment === 1) {
          const addTicket = await createTicket(obj, ticket_id);

          //update order_info and runner_ifo table
          const updateOrder = await updateOrderStatus(
            getOrderInfo[0].booking_id_ref,
            order_id,
            obj.order_status
          );

          if (addTicket == 1 && updateOrder == 1) {
            count++;
          }
        }

        if (count === 1) {
          let subject = `Registration confirmation mail`;
          let message = `Hai, ${regInfo[0].first_name} ${regInfo[0].last_name} you are successfully registered for APR marathon under the class ${registrant_class}. To know your runner details, please visit the website https://aprmarathon.org `;
          //console.log("line309:",count);
          // if (count === 1) {
          let obj = {
            // from: "laksh0762@gmail.com",
            to: regInfo[0].email_id,
            subj: subject,
            msg: message,
          };

          let text = "Announcement from ACT!";
          let html = ` <html>  <p>Dear${regInfo[0].first_name} ${regInfo[0].last_name},</p>
                      <p> Thank you for registering for the APR Run scheduled for 10th December 2023. Your registration has been successful under the ${registrant_class} category.</p>
                      <p> The receipt for the payment and registration details are find below links.</p>
                      <p> For registration details, please refer  https://aprmarathon.org/#/home/registration-details</p>
                      <p> For payment details, please refer https://aprmarathon.org/#/home/payment-history.</p>
                      <p> Thank you,</p>
                      <p> APR Charitable Trust (ACT)</p>
                      <p></p> APR Run team</p></html> `;

          let mailResponse = await mail.mail(obj.to, obj.subj, html);
          console.log("mailResponse", mailResponse);
          if (mailResponse == true) {
            //insert into notification table
            let notifObj = {
              registratn_id: regInfo[0].registrant_id,
              notification_type: "notification",
              message: `You have successfully registered for marathon under the category ${registrant_class}`,
              subject: "payment success!",
              event_id: event_id,

              created_by: null,
            };

            const notifiication = await db.sequelize.query(
              query.createNotification,
              {
                replacements: [
                  notifObj.notification_type,
                  notifObj.subject,
                  notifObj.message,
                  "registrant",
                  notifObj.registratn_id,
                  notifObj.event_id,
                  notifObj.created_by,
                ],
                type: QueryTypes.INSERT,
              }
            );

            console.log("line 1726 : notification");

            //push notification
            // let title = notifObj.subject;
            // let body =  notifObj.message;
            // let token = regInfo[0].notif_token;
            // const sendNotif = await pushNotif.notification(title,body,token);
            res.status(200).json({
              registrant_id: registrant_id,
              order_id: order_id,
              booking_id: booking_id,
              event_id: event_id,
              status: response.data,
              msg: "Payment success...!. Check your mail for more details",
            });
          }
        } else {
          res.status(201).json("error occured, Please check the data");
        }
      }
    } else {
      if (
        response.data.success === false &&
        (response.data.code === "PAYMENT_ERROR" ||
          response.data.code === "INTERNAL_SERVER_ERROR")
      ) {
        let payObj = response.data;

        console.log("payment failed");
        //insert into ticket info and payment info and update in order and runner table
        let obj1 = {
          registrant_id: registrant_id,
          //runner_id: runnerInfo[i].runner_id,
          event_id: eventInfo[0].event_id,
          registrant_class_id: getBookingInfo[0].registrant_class_ref,
          order_id: order_id,
          // ticket_status: '',
          payment_type: "phone pe",
          payment_status: "failed",
          // payment_amount: amount,
          payment_additional_amount: null,
          //payment_date: payment_date,
          order_status: "failed",
          runner_payment_status: "unpaid",
          payment_reference_id: null,
          merchant_id: null,
          merchant_transaction_id: null,
          provider_reference_id: null,
          reg_payment_user_id: regInfo[0].reg_payment_user_id,
        };

        const update_payment = await updatePaymentStatus(
          order_id,
          registrant_id,
          payObj,
          obj1.provider_reference_id
        );
        if (update_payment === 1) {
          //const addTicket = await createTicket(obj, ticket_id);

          //update order_info and runner_ifo table
          const updateOrder = await updateOrderStatus(
            getOrderInfo[0].booking_id_ref,
            order_id,
            obj1.order_status
          );
          // const updateRunner = await updateRunnerPayment(
          //   obj1.runner_payment_status,
          //   getOrderInfo[0].booking_id_ref,
          //   runnerInfo[i].runner_id
          // );
        }

        //insert into notification table
        let notifObj = {
          registratn_id: regInfo[0].registrant_id,
          notification_type: "notification",
          message: `Your registraion for APR-marathon under the category ${registrant_class} is failed. Please retry`,
          subject: "payment failed!",
          event_id: event_id,

          created_by: null,
        };

        const notifiication = await db.sequelize.query(
          query.createNotification,
          {
            replacements: [
              notifObj.notification_type,
              notifObj.subject,
              notifObj.message,
              "registrant",
              notifObj.registratn_id,
              notifObj.event_id,
              notifObj.created_by,
            ],
            type: QueryTypes.INSERT,
          }
        );

        // //push notification
        // let title = notifObj.subject;
        // let body =  notifObj.message;
        // let token = regInfo[0].notif_token;
        // const sendNotif = await pushNotif.notification(title,body,token);

        res.status(201).json({
          registrant_id: registrant_id,
          order_id: order_id,
          booking_id: booking_id,
          event_id: event_id,
          status: response.data,
          status: response.data,
          msg: "your payment failed, please try again",
        });
      } else {
        if (response.data.code === "PAYMENT_PENDING") {
          //update order table
          let order_status = "pending";
          const updateOrder = await updateOrderStatus(
            getOrderInfo[0].booking_id_ref,
            order_id,
            order_status
          );
          //should check
          if (updateOrder == 1) {
            res.status(200).json({
              registrant_id: registrant_id,
              order_id: order_id,
              booking_id: booking_id,
              event_id: event_id,
              status: response.data,
              msg: "your payment is pending, please wait",
            });
          } else {
            console.log("updateOrder failed");
          }
        }
      }
    }
    // }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
};

const paymentHistory = async (req, res) => {
  try {
    const registrant_id = req.params.registrant_id;

    const eventInfo = await db.sequelize.query(query.activeEvent, {
      type: QueryTypes.SELECT,
    });

    if (!eventInfo[0]?.event_id) {
      return res
        .status(400)
        .send("No payment details found since there is no ongoing event");
    }

    console.log("line1841: ", registrant_id);

    //registrant details
    const registrant = await db.sequelize.query(query.getRegistrant, {
      replacements: [registrant_id],
      typee: QueryTypes.SELECT,
    });

    //get payment success order_id from order info teable
    const orderDetails = await db.sequelize.query(query.orderDetail, {
      replacements: [registrant_id, eventInfo[0].event_id],
      type: QueryTypes.SELECT,
    });

    //console.log(orderDetails);

    const getFullData = await orderData(orderDetails, registrant[0]);

    //console.log(getFullData);

    // const data = await db.sequelize.query(query.paymentDetails, {
    //   replacements: [registrant_id, eventInfo[0].event_id],
    //   type: QueryTypes.SELECT,
    // });

    return res.status(200).json(getFullData);
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
};

const updatePaymentStatus = async (
  order_id,
  registrant_id,
  payObj,
  provider_reference_id
) => {
  return new Promise(async (resolve, reject) => {
    let count = 0;

    console.log("line 1258", payObj);

    console.log("line 1260: ", provider_reference_id);

    if (payObj.code === "PAYMENT_SUCCESS") {
      let obj = {
        merchant_id: payObj.data.merchantId,
        provider_reference_id: payObj.data.transactionId,
        merchant_transaction_id: payObj.data.merchantTransactionId,
        payment_instrument_type: null,
        upi_utr: null,
        code: payObj.code,
        message: "payment is success",
        response_code: null,
        success_state: true,
        payment_state: "success",
        response_code_description: null,
        netbanking_pgtransaction_id: null,
        netbanking_servicetransaction_id: null,
        netbanking_banktransaction_id: null,
        netbanking_bank_id: null,
        card_cardtype: null,
        card_pgtransaction_id: null,
        card_banktransaction_id: null,
        card_pgauthorization_code: null,
        card_arn: null,
        card_bank_id: null,
        card_brn: null,
      };

      // console.log("line 1260:", obj.provider_reference_id);

      const data = await db.sequelize.query(query.updatePayment, {
        replacements: [
          "success",
          obj.code,
          obj.message,
          obj.response_code,
          obj.success_state,
          obj.payment_state,
          obj.payment_instrument_type,
          obj.upi_utr,
          obj.card_cardtype,
          obj.card_pgtransaction_id,
          obj.card_banktransaction_id,
          obj.card_pgauthorization_code,
          obj.card_arn,
          obj.card_bank_id,
          obj.card_brn,
          obj.netbanking_pgtransaction_id,
          obj.netbanking_servicetransaction_id,
          obj.netbanking_banktransaction_id,
          obj.netbanking_bank_id,
          obj.provider_reference_id,
          obj.response_code_description,
          order_id,
          registrant_id,
          obj.merchant_transaction_id,
        ],
        type: QueryTypes.UPDATE,
      });

      if (data[1] > 0) {
        count++;
        console.log("line 2530: ", data);
      }
    } else {
      if (payObj.code === "PAYMENT_ERROR") {
        let obj = {
          merchant_id: payObj.data.merchantId,
          provider_reference_id: payObj.data.transactionId,
          merchant_transaction_id: payObj.data.merchantTransactionId,
          payment_instrument_type: null,
          upi_utr: null,
          code: payObj.code,
          message: "payment failed",
          response_code: null,
          success_state: false,
          payment_state: "failed",
          response_code_description: null,
          netbanking_pgtransaction_id: null,
          netbanking_servicetransaction_id: null,
          netbanking_banktransaction_id: null,
          netbanking_bank_id: null,
          card_cardtype: null,
          card_pgtransaction_id: null,
          card_banktransaction_id: null,
          card_pgauthorization_code: null,
          card_arn: null,
          card_bank_id: null,
          card_brn: null,
        };

        const data = await db.sequelize.query(query.updatePayment, {
          replacements: [
            "failed",
            obj.code,
            obj.message,
            obj.response_code,
            obj.success_state,
            obj.payment_state,
            obj.payment_instrument_type,
            obj.upi_utr,
            obj.card_cardtype,
            obj.card_pgtransaction_id,
            obj.card_banktransaction_id,
            obj.card_pgauthorization_code,
            obj.card_arn,
            obj.card_bank_id,
            obj.card_brn,
            obj.netbanking_pgtransaction_id,
            obj.netbanking_servicetransaction_id,
            obj.netbanking_banktransaction_id,
            obj.netbanking_bank_id,
            obj.provider_reference_id,
            obj.response_code_description,
            order_id,
            registrant_id,
            obj.merchant_transaction_id,
          ],
          type: QueryTypes.UPDATE,
        });

        if (data[1] > 0) {
          count++;
          console.log("line 2591: ", data);
        }
      } else {
        if (payObj.code === "PAYMENT_PENDING") {
          let obj = {
            merchant_id: payObj.data.merchantId,
            provider_reference_id: null,
            merchant_transaction_id: payObj.data.merchantTransactionId,
            payment_instrument_type: null,
            upi_utr: null,
            code: false,
            message: "payment is pending",
            response_code: null,
            success_state: true,
            payment_state: "success",
            response_code_description: null,
            netbanking_pgtransaction_id: null,
            netbanking_servicetransaction_id: null,
            netbanking_banktransaction_id: null,
            netbanking_bank_id: null,
            card_cardtype: null,
            card_pgtransaction_id: null,
            card_banktransaction_id: null,
            card_pgauthorization_code: null,
            card_arn: null,
            card_bank_id: null,
            card_brn: null,
          };

          const data = await db.sequelize.query(query.updatePayment, {
            replacements: [
              "pending",
              obj.code,
              obj.message,
              obj.response_code,
              obj.success_state,
              obj.payment_state,
              obj.payment_instrument_type,
              obj.upi_utr,
              obj.card_cardtype,
              obj.card_pgtransaction_id,
              obj.card_banktransaction_id,
              obj.card_pgauthorization_code,
              obj.card_arn,
              obj.card_bank_id,
              obj.card_brn,
              obj.netbanking_pgtransaction_id,
              obj.netbanking_servicetransaction_id,
              obj.netbanking_banktransaction_id,
              obj.netbanking_bank_id,
              obj.provider_reference_id,
              obj.response_code_description,
              order_id,
              registrant_id,
              obj.merchant_transaction_id,
            ],
            type: QueryTypes.UPDATE,
          });

          if (data[1] > 0) {
            count++;
            console.log("line 1416: ", data);
          }
        }
      }
    }

    if (count === 1) {
      return resolve(1);
    }
  });
};

const orderData = async (order, registrant) => {
  return new Promise(async (resolve, reject) => {
    const email = { email_id: registrant[0]?.email_id };

    if (order.length > 0) {
      let result = [];
      for (let i = 0; i < order.length; i++) {
        // let booking_id = order[i].booking_id_ref;
        let class_id = order[i].registrant_class_ref;

        const regClass = await db.sequelize.query(query.regClass, {
          replacements: [class_id],
          type: QueryTypes.SELECT,
        });

        const regType = await db.sequelize.query(query.regType, {
          replacements: [regClass[0].registrant_type_id_ref],
        });
        const regtype = regType[0];

        const [merchantTransaction] = await db.sequelize.query(
          query.merchantTransId,
          { replacements: [order[i].order_id], type: QueryTypes.SELECT }
        );
        // console.log(merchantTransactionId);
        // let merchantid = {merchant_transaction_id:""}
        // if(merchantTransactionId[0] != undefined){
        //   merchantid = {
        //     merchant_transaction_id:
        //       merchantTransactionId[0].merchant_transaction_id,
        //   };
        // }
        // else{
        //   merchantid = {
        //     merchant_transaction_id:
        //       "Not available",
        //   };
        // }
        let obj = {
          ...order[i],
          ...regClass[0],
          ...regtype[0],
          ...email,
          merchant_transaction_id:
            merchantTransaction?.merchant_transaction_id ?? "",
          status: merchantTransaction?.payment_status,
        };

        result.push(obj);
      }

      return resolve(result);
    } else {
      return resolve([]);
    }
  });
};

const checkInitiatePayment = async (req, res) => {
  try {
    const { order_id, merchant_id, merchant_transaction_id } = req.body;

    const paymentStatus = await db.sequelize.query(
      query.getPaymentStatus,

      {
        replacements: [order_id, merchant_transaction_id, merchant_id],
        type: QueryTypes.SELECT,
      }
    );

    const getBooking = await db.sequelize.query(query.orderInfo1, {
      replacements: [order_id],
      type: QueryTypes.SELECT,
    });
    const bookingId = { booking_id: getBooking[0].booking_id_ref };

    let obj = { ...paymentStatus[0], ...bookingId };

    if (paymentStatus[0] !== undefined) {
      res.status(200).json(obj);
    } else {
      res.status(200).json(paymentStatus);
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
};

const bookingConfirmation = async (req, res) => {
  try {
    const { registrant_id, order_id, booking_id } = req.body;

    const eventInfo = await db.sequelize.query(query.activeEvent, {
      type: QueryTypes.SELECT,
    });

    const bookingData = await bookingInfo(registrant_id, order_id, booking_id);

    // registrant data

    const registrant = await db.sequelize.query(query.registrant, {
      replacements: [registrant_id],
      type: QueryTypes.SELECT,
    });

    // getting biling address
    //console.log(bookingData);
    const address = await db.sequelize.query(query.billAddress, {
      replacements: [order_id],
      type: QueryTypes.SELECT,
    });

    console.log(address);
    //regclass
    const regClass = await db.sequelize.query(query.regClass, {
      replacements: [address[0].registrant_class_ref],
      type: QueryTypes.SELECT,
    });

    //reg type

    const regType = await db.sequelize.query(query.regType, {
      replacements: [regClass[0].registrant_type_id_ref],
      type: QueryTypes.SELECT,
    });

    let obj1 = {
      registrantInfo: registrant[0],
      runnerInfo: [
        {
          ...regClass[0],
          ...regType[0],
          ...address[0],
          ...bookingData.transactionDetails,
          runners: bookingData.runners,
        },
      ],
    };

    res.status(200).json(obj1);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
};

const bookingInfo = async (registrantid, orderid, bookingid) => {
  return new Promise(async (resolve, reject) => {
    const transactionId = await db.sequelize.query(query.transInfo, {
      replacements: [orderid],
      type: QueryTypes.SELECT,
    });

    const runner = await db.sequelize.query(query.runners, {
      replacements: [bookingid],
      type: QueryTypes.SELECT,
    });
    let data = [];

    for (let i = 0; i < runner.length; i++) {
      console.log(runner[i].runner_id);
      const runCat = await db.sequelize.query(query.runCat, {
        replacements: [runner[i].run_category_id_ref],
        type: QueryTypes.SELECT,
      });

      //gt ticket number
      const ticket = await db.sequelize.query(query.ticketNo, {
        replacements: [runner[i].runner_id],
        type: QueryTypes.SELECT,
      });
      console.log("ticket:", ticket);
      let obj = { ...runner[i], ...ticket[0], ...runCat[0] };
      data.push(obj);
    }

    let obj = {
      transactionDetails: transactionId[0],
      runners: data,
    };
    return resolve(obj);
  });
};

const invoiceData = async (req, res) => {
  try {
    const { registrant_id, order_id, booking_id } = req.params;

    const eventInfo = await db.sequelize.query(query.activeEvent, {
      type: QueryTypes.SELECT,
    });

    const bookingData = await bookingInfo(registrant_id, order_id, booking_id);

    // registrant data

    const registrant = await db.sequelize.query(query.registrant, {
      replacements: [registrant_id],
      type: QueryTypes.SELECT,
    });

    //Rishi

    const paymentStatusForRegistrant = await db.sequelize.query(
      query.getPaymentStatusForRegistrant,
      {
        replacements: [registrant_id],
        type: QueryTypes.SELECT,
      }
    );

    // getting biling address
    //console.log(bookingData);
    const address = await db.sequelize.query(query.billAddress, {
      replacements: [order_id],
      type: QueryTypes.SELECT,
    });

    console.log(address, " - address");

    //regclass
    const regClass = await db.sequelize.query(query.regClass, {
      replacements: [address[0].registrant_class_ref],
      type: QueryTypes.SELECT,
    });

    //reg type

    const regType = await db.sequelize.query(query.regType, {
      replacements: [regClass[0].registrant_type_id_ref],
      type: QueryTypes.SELECT,
    });

    let obj1 = {
      ...registrant[0],
      ...regClass[0],
      ...regType[0],
      ...address[0],
      ...paymentStatusForRegistrant[0],
      ...bookingData,
    };
    // console.log(obj1);
    const invoiceData = obj1;

    const pay_date = new Date(invoiceData.transactionDetails.created_at);
    const payDate = pay_date.toLocaleDateString();
    const payTime = pay_date.toLocaleTimeString();
    //console.log(payDate);
    //console.log(payTime);

    const type_name = `${invoiceData.type_name}`;
    //console.log(type_name);
    const cat_name = invoiceData.category_name;
    const arr = type_name.split(" ");
    //console.log(arr);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
      //console.log(arr[i]);
    }
    const typeName = arr.join(" ");
    //console.log(typeName);

    //const typeName  =type_name[0].toUpperCase() + type_name.slice(1);
    const catName = cat_name[0].toUpperCase() + cat_name.slice(1);

    const doc = new PDFDocument();

    // Set the content disposition for the response
    res.setHeader("Content-disposition", "attachment; filename=invoice.pdf");
    res.setHeader("Content-type", "application/pdf");

    // Pipe the PDF to the response
    doc.pipe(res);

    doc
      .image("src/controllers/without-circle-black.png", 300, 8, { width: 50 })
      .fillColor("#444444");
    doc
      .font("Helvetica-Bold")
      .text("PUMA NITRO APR MARATHON 2023", 110, 48, { align: "center" });
    doc.font("Helvetica");

    doc.fontSize(12);

    doc
      .text("APR Charitable Trust", 110, 65, { align: "center" })
      .text("Adarsh Palm Retreat, ,Bellandur ", 110, 79, { align: "center" })
      .text("Bengaluru, Karnataka 560103", 110, 94, { align: "center" })
      .strokeColor("#aaaaaa")
      .lineWidth(1)
      .moveTo(50, 110)
      .lineTo(550, 110)
      .stroke()
      .moveDown();
    //generateHr(doc, position + 20);

    //receipt voucher
    doc
      .font("Helvetica-Bold")
      .text("Receipt Voucher", 50, 119, { align: "center" });
    doc
      .font("Helvetica-Bold")
      .text(`Serial No. of Receipt/MTID:`, 110, 139)
      .font("Helvetica")
      .text(
        ` ${invoiceData.transactionDetails.merchant_transaction_id}`,
        260,
        139
      );
    doc
      .font("Helvetica-Bold")
      .text(`Transaction Number:`, 110, 159)
      .font("Helvetica")
      .text(
        ` ${invoiceData.transactionDetails.provider_reference_id}`,
        260,
        159
      );
    doc
      .font("Helvetica-Bold")
      .text(`Payment Status:`, 110, 179)
      .font("Helvetica")
      .text(` ${invoiceData.payment_status}`, 260, 179);
    doc
      .font("Helvetica-Bold")
      .text(`Date/Time of Receipt:`, 110, 199)
      .font("Helvetica")
      .text(` ${payDate} - ${payTime}`, 260, 199);
    doc
      .strokeColor("#aaaaaa")
      .lineWidth(1)
      .moveTo(50, 215)
      .lineTo(550, 215)
      .stroke();
    doc.moveDown();

    // Add content to the PDF
    doc.font("Helvetica-Bold").text("Received From"); // { align: 'center' });

    doc
      .font("Helvetica-Bold")
      .text(`Registrant Name:`, 110, 245)
      .font("Helvetica")
      .text(` ${invoiceData.first_name}  ${invoiceData.last_name}`, 260, 245);
    doc
      .font("Helvetica-Bold")
      .text(`Address:`, 110, 265)
      .font("Helvetica")
      .text(` ${invoiceData.billing_address}`, 260, 265);
    doc
      .font("Helvetica-Bold")
      .text(`Email ID:`, 110, 305)
      .font("Helvetica")
      .text(` ${invoiceData.email_id}`, 260, 305);
    doc
      .font("Helvetica-Bold")
      .text(`Mobile Number:`, 110, 325)
      .font("Helvetica")
      .text(` ${invoiceData.mobile_number}`, 260, 325);
    doc
      .strokeColor("#aaaaaa")
      .lineWidth(1)
      .moveTo(50, 340)
      .lineTo(550, 340)
      .stroke();
    doc.moveDown();

    // Add items to the invoice
    // Add items to the invoice
    const invoicetableTop = 385;
    if (invoiceData.runners.length > 0) {
      ////////////////////////////////
      if (invoiceData.runners.length > 12) {
        doc.font("Helvetica-Bold").text("Participant Details"); //, { align: 'center' })

        doc.font("Helvetica-Bold");
        generateTableRow(
          doc,
          invoicetableTop,
          "Runner Name",
          "BIB Number",
          "Run Category"
        );
        generateHr(doc, invoicetableTop + 20);
        doc.font("Helvetica");

        for (let i = 0; i < invoiceData.runners.length - 5; i++) {
          const item = invoiceData.runners[i];
          let runner_name = item.runner_first_name + item.runner_last_name;

          const position = invoicetableTop + (i + 1) * 30;

          generateRunTableRow(
            doc,
            position,
            runner_name,
            item.bib_number,
            item.race_type_name
          );

          generateHr(doc, position + 20);
        }
        doc.moveDown();

        doc.addPage();

        let invoiceTable = 10;
        let count = 0;
        for (let j = 10; j < invoiceData.runners.length; j++) {
          const item = invoiceData.runners[j];
          let runner_name = item.runner_first_name + item.runner_last_name;

          const position2 = invoiceTable + count * 30;
          count++;
          generateRunTableRow(
            doc,
            position2,
            runner_name,
            item.bib_number,
            item.race_type_name
          );

          generateHr(doc, position2 + 20);
        }

        const invoiceTableTop = 180;

        doc
          .font("Helvetica-Bold")
          .text("Ticket Details", 50, invoiceTableTop, { align: "center" });

        //console.log( invoiceTableTop);

        const tableTop = invoiceTableTop + 20;
        // const tableTop =50;
        console.log(tableTop);
        doc.font("Helvetica-Bold");
        generateTableRow(doc, tableTop, "Type", "Class", "Total Amount");
        generateHr(doc, tableTop + 20);
        doc.font("Helvetica");

        const position = tableTop + 30;
        // const position = 400;
        generateTableRow(
          doc,
          position,
          typeName,
          catName,
          `Rs.${invoiceData.transactionDetails.payment_amount}`
        );

        generateHr(doc, position + 20);

        const position1 = position + 40;
        doc
          .font("Helvetica-Bold")
          .text(
            "*Note: System generated receipt. No cancellation or refund applicable",
            50,
            position1,
            { align: "left" }
          );
        //  generateHr(doc, position1 + 20);
      } else {
        /////////////////////////////

        doc.font("Helvetica-Bold").text("Participant Details"); //, { align: 'center' });
        doc.font("Helvetica-Bold");
        generateRunTableRow(
          doc,
          invoicetableTop,
          "Runner Name",
          "  BIB Number",
          "Run Category"
        );
        generateHr(doc, invoicetableTop + 20);
        doc.font("Helvetica");

        for (let i = 0; i < invoiceData.runners.length; i++) {
          const item = invoiceData.runners[i];
          let runner_name = `${item.runner_first_name} ${item.runner_last_name}`;

          const position = invoicetableTop + (i + 1) * 30;

          generateRunTableRow(
            doc,
            position,
            runner_name,
            item.bib_number,
            item.race_type_name
          );

          generateHr(doc, position + 20);
        }
        doc.moveDown();

        const invoiceTableTop =
          invoicetableTop + (invoiceData.runners.length + 1) * 30;
        if (invoiceTableTop > 680) {
          doc.addPage();
          doc
            .font("Helvetica-Bold")
            .text("Ticket Details", 50, 30, { align: "center" });

          //console.log( invoiceTableTop);

          //const tableTop =   invoiceTableTop+20;
          const tableTop = 50;
          console.log(tableTop);
          doc.font("Helvetica-Bold");
          generateTableRow(doc, tableTop, "Type", "Class", "Total Amount");
          generateHr(doc, tableTop + 20);
          doc.font("Helvetica");

          const position = tableTop + 30;
          // const position = 400;
          generateTableRow(
            doc,
            position,
            typeName,
            catName,
            `Rs.${invoiceData.transactionDetails.payment_amount}`
          );

          generateHr(doc, position + 20);
          const position1 = position + 40;
          doc
            .font("Helvetica-Bold")
            .text(
              "*Note: System generated receipt. No cancellation or refund applicable",
              50,
              position1,
              { align: "left" }
            );
          //  generateHr(doc, position1 + 20);
        } else {
          doc
            .font("Helvetica-Bold")
            .text("Ticket Details", 50, invoiceTableTop, { align: "center" });

          //console.log( invoiceTableTop);

          const tableTop = invoiceTableTop + 20;
          //const tableTop =50;
          console.log(tableTop);
          doc.font("Helvetica-Bold");
          generateTableRow(doc, tableTop, "Type", "Class", "Total Amount");
          generateHr(doc, tableTop + 20);
          doc.font("Helvetica");

          const position = tableTop + 30;
          // const position = 400;
          generateTableRow(
            doc,
            position,
            typeName,
            catName,
            `Rs.${invoiceData.transactionDetails.payment_amount}`
          );

          generateHr(doc, position + 20);

          const position1 = position + 40;
          doc
            .font("Helvetica-Bold")
            .text(
              "*Note: System generated receipt. No cancellation or refund applicable",
              50,
              position1,
              { align: "left" }
            );
          //generateHr(doc, position1 + 20);
        }
      }
    } else {
      //const invoiceTableTop =invoicetableTop + ((invoiceData.runners.length )*30)+20;
      doc
        .font("Helvetica-Bold")
        .text("Ticket Details", 50, invoicetableTop, { align: "center" });

      console.log(invoicetableTop);

      const tableTop = invoicetableTop + 20;
      //const tableTop = 730;
      console.log(tableTop);
      doc.font("Helvetica-Bold");
      generateTableRow(doc, tableTop, "Type", "Class", "Total Amount");
      generateHr(doc, tableTop + 20);
      doc.font("Helvetica");

      const position = tableTop + 30;
      // const position = 400;
      generateTableRow(
        doc,
        position,
        typeName,
        catName,
        `Rs.${invoiceData.transactionDetails.payment_amount}`
      );

      generateHr(doc, position + 20);

      const position1 = position + 40;
      doc
        .font("Helvetica-Bold")
        .text(
          "*Note: System generated receipt. No cancellation or refund applicable",
          50,
          position1,
          { align: "left" }
        );
      // generateHr(doc, position1 + 20);
    }

    //generateHr(doc, position );

    function generateTableRow(
      doc,
      y,
      // ItemDetails,
      Type,
      Regclass,
      TotalAmount
    ) {
      doc
        .fontSize(12)
        .text(Type, 150, y)
        .text(Regclass, 280, y)
        .text(TotalAmount, 420, y);
    }

    function generateRunTableRow(
      doc,
      y,
      // ItemDetails,
      runner_name,
      bib_number,
      ticket_number
    ) {
      doc
        .fontSize(12)
        .text(runner_name, 100, y)
        .text(bib_number, 320, y)
        .text(ticket_number, 450, y);
    }

    function generateHr(doc, y) {
      doc
        .strokeColor("#aaaaaa")
        .lineWidth(1)
        .moveTo(50, y)
        .lineTo(550, y)
        .stroke();
    }

    // Finalize the PDF
    doc.end();
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
};

const payHisForAdmin = async (req, res) => {
  try {
    const eventInfo = await db.sequelize.query(query.activeEvent, {
      type: QueryTypes.SELECT,
    });

    const orderDetails = await db.sequelize.query(query.orderDetailForAdmin, {
      replacements: [eventInfo[0].event_id],
      type: QueryTypes.SELECT,
    });

    //console.log(orderDetails);

    const getFullData = await orderData1(orderDetails);

    res.status(200).json(getFullData);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
};

const orderData1 = async (order) => {
  return new Promise(async (resolve, reject) => {
    let data = [];

    if (order.length > 0) {
      let result = [];
      for (let i = 0; i < order.length; i++) {
        // let booking_id = order[i].booking_id_ref;
        let class_id = order[i].registrant_class_ref;

        const regClass = await db.sequelize.query(query.regClass, {
          replacements: [class_id],
          type: QueryTypes.SELECT,
        });

        const regType = await db.sequelize.query(query.regType, {
          replacements: [regClass[0].registrant_type_id_ref],
        });
        const regtype = regType[0];

        const getReg = await db.sequelize.query(query.registrant, {
          replacements: [order[i].registrant_id_ref],
          type: QueryTypes.SELECT,
        });
        // console.log(regType);
        let obj = { ...order[i], ...regClass[0], ...regtype[0], ...getReg[0] };

        result.push(obj);
      }

      return resolve(result);
    } else {
      return resolve([]);
    }
  });
};

const getPayStatusByToken = async (req, res) => {
  try {
    const token = req.params.token;
    console.log(token);

    if (token !== null) {
      const paymentStatus = await db.sequelize.query(
        query.payStatus,

        {
          replacements: [token],
          type: QueryTypes.SELECT,
        }
      );
      if (paymentStatus[0] !== undefined) {
        const getBooking = await db.sequelize.query(query.orderInfo1, {
          replacements: [paymentStatus[0].order_id_ref],
          type: QueryTypes.SELECT,
        });
        const bookingId = { booking_id: getBooking[0].booking_id_ref };

        let obj = { ...paymentStatus[0], ...bookingId };

        res.status(200).json(obj);
      } else {
        res.status(200).json(paymentStatus);
      }
    } else {
      res.status(201).send("no token attached");
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
};

module.exports = {
  payment,
  redirectUrl,
  callBackUrl,
  checkPaymentStatus,
  paymentHistory,
  checkInitiatePayment,
  bookingConfirmation,
  invoiceData,
  payHisForAdmin,
  getPayStatusByToken,
  paymentByAdmin,
};
