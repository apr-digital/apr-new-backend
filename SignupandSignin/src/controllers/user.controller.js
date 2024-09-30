const db = require("../config/dbconfig");
const query = require("../models/user.models");
const { sequelize } = require("sequelize");
const { QueryTypes } = require("sequelize");
const crypt = require("../middlewares/crypt");
const jwt = require("jsonwebtoken");
const JWT_REFRESH_KEY = "ABCDEFGHIJKLlkjihgfedcba";
var unirest = require("unirest");
const mail = require("../middlewares/mail");

const token = require("../middlewares/token");
const session = require("express-session");
const passport = require("passport");
const { json } = require("body-parser");
require("../middlewares/googleauth");

const eventInfo = async () => {
  return new Promise(async (resolve, reject) => {
    const event = await db.sequelize.query(query.eventInfo, {
      type: QueryTypes.SELECT,
    });
    return resolve(event);
  });
};
async function generateOTP() {
  ///return new Promise((resolve, reject) => {
  return Math.floor(100000 + Math.random() * 900000);
  //});
}

// Save OTP to the database
async function saveOTPToDatabase(email, phone_number, otp) {
  //================
  return new Promise(async (resolve, reject) => {
    //  // code added on 28-11-2023
    //  //check  no of opts
    //  // Uncommented om 8/3/24 by Rishi
    const noOfAttempt = await db.sequelize.query(query.noOtpAttempt , {replacements:[phone_number], type:QueryTypes.SELECT});

      console.log("number of attempts: ", noOfAttempt);
    if(noOfAttempt[0].count >= 3){
        return resolve(false)

      }else{
    let result = await db.sequelize.query(query.saveOtp, {
      replacements: [email.toLowerCase(), phone_number, otp],
      type: QueryTypes.INSERT,
    });
    if (result[1] === 1) {
      // let result1 = await db.sequelize.query(query.otpStatus, {
      //   replacements: [email],
      //   type: QueryTypes.UPDATE,
      // });
      // if (result1[1] === 1) {
      return resolve(true);
      //}
    }
    }
  });
}

async function saveSigninOTPToDatabase(email, phone_number, otp) {
  //================
  return new Promise(async (resolve, reject) => {
    //  // code added on 28-11-2023
    //  //check  no of opts
    //  // Uncommented om 8/3/24 by Rishi
    // const noOfAttempt = await db.sequelize.query(query.noOtpAttempt , {replacements:[phone_number], type:QueryTypes.SELECT});

    //   console.log("number of attempts: ", noOfAttempt);
    // if(noOfAttempt[0].count >= 3){   //uncommented by suganthi on 23/09/2024
    //     return resolve(false)

    //   }else{
    let result = await db.sequelize.query(query.saveOtp, {
      replacements: [email.toLowerCase(), phone_number, otp],
      type: QueryTypes.INSERT,
    });
    if (result[1] === 1) {
      let result1 = await db.sequelize.query(query.otpStatus, {
        replacements: [email],
        type: QueryTypes.UPDATE,
      });
      if (result1[1] === 1) {
      return resolve(true);
      }
    }
   // }
  });
}

// Send OTP via Fast2SMS
const sendOTP = async (phone, otp_num) => {
  return new Promise((resolve, reject) => {
     // const apiKey =
    //   "7MVsvEZUBmASXhFOKzGjJdqo6Tk0wCby45aiIfct9n2HPWp3xgoEYky9jm4OUxD8Ivt3qwFpig7M5LQG";
    const message = `Your OTP for APR marathon registration is ${otp_num}. 
                       - send by APR TEAM `;
   
   var req = unirest("POST", "https://www.fast2sms.com/dev/bulkV2");
   req.headers({
      authorization:
        "7MVsvEZUBmASXhFOKzGjJdqo6Tk0wCby45aiIfct9n2HPWp3xgoEYky9jm4OUxD8Ivt3qwFpig7M5LQG",
    });

    req.form({
      variables_values: otp_num,
      message:message,
      route: "otp",
     // route:"q",
      numbers: phone,
    });

    req.end(function (res) {
      // if (res.error) throw new Error(res.error);

      console.log(res.body);
      const result = res.body;

      if (result.return === true) {
        return resolve(true);
      } else {
        return resolve(false);
      }
    });
  });
};

const userSignup = async (req, res) => {
  try {
    const {
      first_name,
      middle_name,
      last_name,
      email_id,
      google_id,
      mobile_number,
      corporate_user,
      corporate_code,
      password,
      notif_token,
    } = req.body;

    // check whether user already signed up
    const existingUser = await db.sequelize.query(query.getUserByMail, {
      replacements: [email_id.toLowerCase(), mobile_number],
      type: QueryTypes.SELECT,
    });

    if (existingUser[0] === undefined) {
      if (corporate_user === true) {

        const event = await eventInfo();
        let event_id = event[0].event_id;
        
        const checkCorpCode = await db.sequelize.query(query.getCorporateCode, {
          replacements: [corporate_code, event_id],
          type: QueryTypes.SELECT,
        });
//------------password set as null on 12-01-2023--------------------------------------------------------------
        //const hashedPassword = await crypt.encrypt(password);
        console.log("code", checkCorpCode);

        if (checkCorpCode[0] !== undefined) {
          if (
            checkCorpCode[0].number_of_passes >
            checkCorpCode[0].corporate_runner_count
          ) {
            //generate otp
            let otp = await generateOTP();
            if(mobile_number == "7904148922"){
              otp=606060
            }
            if(mobile_number == "8883660851"){ //krishna -testing
              otp=606060
            }
            // Send OTP via Fast2SMS
            const isSent = await sendOTP(mobile_number, otp);

            console.log("isSent:", isSent);
            if (isSent) {
              // Save OTP to the database
              await saveSigninOTPToDatabase(email_id, mobile_number, otp);

              const addAsRegistrant = await db.sequelize.query(
                query.addCorpUser,
                {
                  replacements: [
                    first_name,
                    middle_name,
                    last_name,
                    email_id.toLowerCase(),
                    password,
                    mobile_number,
                    checkCorpCode[0].corporate_id,
                    "corporate registrant",
                    notif_token,

                    //checkCorpCode[0].event_id_ref,
                  ],
                  type: QueryTypes.INSERT,
                }
              );

              if (addAsRegistrant[1] === 1) {
                let result1 = await db.sequelize.query(query.otpStatus, {
                  replacements: [email_id.toLowerCase()],
                  type: QueryTypes.UPDATE,
                });
                // const addAsrunner = await db.sequelize.query(
                //   query.addCorpRunner,
                //   {
                //     replacements: [
                //       first_name,
                //       last_name,
                //       email_id,
                //       mobile_number,
                //       "corporate runner",
                //       checkCorpCode[0].event_id_ref,
                //       checkCorpCode[0].corporate_id
                //     ],
                //     type: QueryTypes.INSERT,
                //   }
                // );

                let count = checkCorpCode[0].corporate_runner_count;

                // if (addAsrunner[1] === 1) {
                let regCount = count + 1;

                //if a runner is registered under corporate , incerase the runner count for particular corporate
                const increaseCount = await db.sequelize.query(
                  query.increaseRunnerCount,
                  {
                    replacements: [regCount, checkCorpCode[0].corporate_id],
                    type: QueryTypes.UPDATE,
                  }
                );
                // }
              }
              console.log("line:203 - user signup success");
              res.status(200).json({
                success: true,
                message:
                  "OTP sent successfully and Registrant signed up success",
              });
            } else {
              res.status(201).json({
                success: false,
                message: "Failed to send OTP. Try again later.",
              });
            }
          } else {
            res
              .status(201)
              .json(
                "coporate code expire, you can not registered using this code "
              );
          }
        } else {
          res.status(201).json("Please check your code");
        }
      } else {
        if (google_id === null) {
          //generate otp
          let otp = await generateOTP();
          if(mobile_number == "7904148922"){
            otp=606060
          }
          if(mobile_number == "8883660851"){ //krishna -testing
            otp=606060
          }
          console.log("line122: ", otp);

          // Send OTP via Fast2SMS
          const isSent = await sendOTP(mobile_number, otp);

          console.log("isSent:", isSent);
          if (isSent) {
            // Save OTP to the database
            const save = await saveOTPToDatabase(email_id, mobile_number, otp);

            console.log("line125: ", save);

           // const hashedPassword = await crypt.encrypt(password);

            let data = await db.sequelize.query(query.addUser, {
              replacements: [
                first_name,
                middle_name,
                last_name,
                email_id.toLowerCase(),
                null,
                password,
                mobile_number,
                notif_token,
                "registrant",
                //event_id,
              ],
              type: QueryTypes.INSERT,
            });

            console.log("line258", data);

            let result1 = await db.sequelize.query(query.otpStatus, {
              replacements: [email_id.toLowerCase()],
              type: QueryTypes.UPDATE,
            });
            //generate registrant user id for payment
            const getId = await db.sequelize.query(query.getUserByMail, {
              replacements: [email_id.toLowerCase(), mobile_number],
              type: QueryTypes.SELECT,
            });
            console.log("line 235: ", getId);
            const reg_payment_user_id =
              "APRPAY0" + Number(getId[0].registrant_id);

            const updateRegUserId = await db.sequelize.query(
              query.updateUserId,
              {
                replacements: [reg_payment_user_id, getId[0].registrant_id],
                type: QueryTypes.UPDATE,
              }
            );

            res.status(200).json({
              success: true,
              message: "OTP sent successfully and Registrant signed up success",
            });
          } else {
            res.status(201).json({
              success: false,
              message: "Failed to send OTP. Try again later.",
            });
          }
        } else {
          await db.sequelize.query(query.addUser, {
            replacements: [
              first_name,
              middle_name,
              last_name,
              email_id.toLowerCase(),
              google_id,
              null,
              mobile_number,
              notif_token,
              "registrant",
              //event_id,
            ],
            type: QueryTypes.INSERT,
          });

          //generate registrant user id for payment
          const getId = await db.sequelize.query(query.getUserByMail, {
            replacements: [email_id.toLowerCase()],
            type: QueryTypes.SELECT,
          });
          console.log("line 235: ", getId);
          const reg_payment_user_id =
            "APRPAY0" + Number(getId[0].registrant_id);

          const updateRegUserId = await db.sequelize.query(query.updateUserId, {
            replacements: [reg_payment_user_id, getId[0].registrant_id],
            type: QueryTypes.UPDATE,
          });

          // //generate otp
          // const otp = await generateOTP();
          // console.log("line122: ", otp);
          // // Save OTP to the database
          // let save = await saveOTPToDatabase(email_id, mobile_number, otp);
          // console.log("line125: ", save);
          // // Send OTP via Fast2SMS
          // const isSent = await sendOTP(mobile_number, otp);

          // console.log("isSent:", isSent);
          // if (isSent) {
          res.status(200).json({
            success: true,
            message: "Signup success",
          });
          // } else {
          //   res.json({ success: false, message: "Failed to send OTP." });
          // }
        }
      }
    } else {
      return res.status(201).json("Users already exist with this email id and mobile number");
    }
  } catch (error) {
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
};


const userLogin = async (req, res) => {
    try {
      const {
       mobile_number}
       = req.body;

       const existingUser = await db.sequelize.query(query.getUserByMobile, {
                replacements: [mobile_number],
                type: QueryTypes.SELECT,
              });
             // console.log("line 390: ", existingUser);

              if(existingUser[0] !== undefined){

                 //generate otp
          let otp = await generateOTP();
          if(mobile_number == "7904148922"){ //krishna -testing
            otp=606060
          }
          if(mobile_number == "8883660851"){ //krishna -testing
            otp=606060
          }
          console.log("line122: ", otp);

          // Send OTP via Fast2SMS
          const isSent = await sendOTP(mobile_number, otp);

          console.log("isSent:", isSent);
          if (isSent) {
            // Save OTP to the database
            console.log("OTP being saved: ", otp);
            const save = await saveSigninOTPToDatabase(existingUser[0].email_id.toLowerCase(), mobile_number, otp);
            res.status(200).json({
              success: true,
              message: "OTP sent successfully and Registrant signed up success :)",
            });
          } else {
            res.status(201).json({
              success: false,
              message: "Failed to send OTP,sending multiple sms to same number is not allowed. Please Try again after 30 minutes.",
            });
          }



              }else{
                res.status(202).json({success: false,
                  message:"you are not registered with this mobile number"});
              }
    
      }catch(error){
        res.status(400).json({
                error_msg: error.message,
                stack_trace: error.stack,
                error_obj: error,
              });
      }


  }

// const userLogin = async (req, res) => {
//   try {
//     const {
//       first_name,
//       last_name,
//       email_id,
//       password,
//       google_id,
//       notif_token,
//     } = req.body;

//     if (google_id === null) {
//       // checking user already exist or not
//       const existingUser = await db.sequelize.query(query.getUserByMail, {
//         replacements: [email_id],
//         type: QueryTypes.SELECT,
//       });

//       // console.log("existinguser", existingUser);

//       const getdeletedUser = await db.sequelize.query(query.checkUser, {
//         replacements: [email_id],
//         type: QueryTypes.SELECT,
//       });

//       // if(existingUser[0].google_id === null){

//       if (existingUser[0] == undefined) {
//         if (getdeletedUser[0] !== undefined) {
//           res
//             .status(202)
//             .json("Your acoount has beed deleted. Please do signup");
//         } else {
//           res.status(202).json("Invalid username/emaild");
//         }
//       } else {
//         if (password !== null) {
//           //checking the user password
//           const userPassword = existingUser[0].password;
//           const decryptedPassword = crypt.decrypt(userPassword);
//           //console.log("pass", userPassword);

//           if (decryptedPassword === password) {
//             // if (existingUser[0].otp_verification_status === true) {
//             const accessToken = await token.tokenGenerator(email_id);
//             const refreshToken = await token.refTokenGen(email_id);

//             //update token in database
//             await db.sequelize.query(query.updateReftoken, {
//               replacements: [refreshToken, notif_token, email_id],
//               type: QueryTypes.UPDATE,
//             });

//             res.status(200).json({
//               corporate_id: existingUser[0].corporate_sponsor_id_ref,
//               user_id: existingUser[0].registrant_id,
//               first_name: existingUser[0].first_name,
//               last_name: existingUser[0].last_name,
//               email_id: email_id,
//               mobile_number: existingUser[0].mobile_number,
//               mobile_no_verify_status: existingUser[0].otp_verification_status,
//               accessToken: accessToken,
//               refreshToken: refreshToken,
//             });
//             // } else {
//             //   res.status(201).json("verify your mobile number");
//             // }
//           } else {
//             res.status(201).json("Wrong password");
//           }
//         }
//       }

//       // }else{
//       //   res.status(202).json("User with this mail id is logged in using google login...  please login using google signin");
//       // }
//     } else {
//       const checkUser = await db.sequelize.query(query.getUserByGoogleId, {
//         replacements: [google_id],
//         type: QueryTypes.SELECT,
//       });
//       if (checkUser[0] !== undefined) {
//         //if (checkUser[0].otp_verification_status === true) {
//         const accessToken = await token.tokenGenerator(email_id);
//         const refreshToken = await token.refTokenGen(email_id);

//         //update token in database
//         await db.sequelize.query(query.updateReftoken, {
//           replacements: [refreshToken, notif_token, email_id],
//           type: QueryTypes.UPDATE,
//         });

//         console.log("line 455 login success");
//         res.status(200).json({
//           // event_id: existingUser[0].event_id_ref,
//           corporate_id: null,
//           first_name: checkUser[0].first_name,
//           last_name: checkUser[0].last_name,
//           user_id: checkUser[0].registrant_id,
//           email_id: email_id,
//           google_id: google_id,
//           mobile_number: checkUser[0].mobile_number,
//           mobile_no_verify_status: checkUser[0].otp_verification_status,
//           accessToken: accessToken,
//           refreshToken: refreshToken,
//         });
//         // } else {
//         //   res.status(201).json("Verify your phone number");
//         // }
//         //}
//       } else {
//         // if the user not exist add tehm as user(signup)

//         await db.sequelize.query(query.addUser, {
//           replacements: [
//             first_name,
//             null,
//             last_name,
//             email_id,
//             google_id,
//             null,
//             null,
//             notif_token,
//             "registrant",
//             //event_id,
//           ],
//           type: QueryTypes.INSERT,
//         });

//         //generate registrant user id for payment
//         const getId = await db.sequelize.query(query.getUserByMail, {
//           replacements: [email_id],
//           type: QueryTypes.SELECT,
//         });
//         console.log("line 235: ", getId);
//         const reg_payment_user_id = "APRPAY0" + Number(getId[0].registrant_id);

//         const updateRegUserId = await db.sequelize.query(query.updateUserId, {
//           replacements: [reg_payment_user_id, getId[0].registrant_id],
//           type: QueryTypes.UPDATE,
//         });

//         const accessToken = await token.tokenGenerator(email_id);
//         const refreshToken = await token.refTokenGen(email_id);

//         //update token in database
//         await db.sequelize.query(query.updateReftoken, {
//           replacements: [refreshToken, notif_token, email_id],
//           type: QueryTypes.UPDATE,
//         });

//         res.status(200).json({
//           corporate_id: null,
//           first_name: getId[0].first_name,
//           last_name: getId[0].last_name,
//           user_id: getId[0].registrant_id,
//           email_id: email_id,
//           google_id: google_id,
//           mobile_number: getId[0].mobile_number,
//           mobile_no_verify_status: getId[0].otp_verification_status,
//           accessToken: accessToken,
//           refreshToken: refreshToken,
//         });
//       }
//     }
//   } catch (error) {
//     res.status(400).json({
//       error_msg: error.message,
//       stack_trace: error.stack,
//       error_obj: error,
//     });
//   }
// };

const generateToken = async (req, res) => {
  try {
    const refreshToken = req.body.refreshtoken;
    if (refreshToken == null) {
      res.status(401).json("Plese enter the token");
    }

    const existingToken = await db.sequelize.query(query.checkReftoken, {
      replacements: [refreshToken],
      type: QueryTypes.SELECT,
    });

    console.log("refrehToken: ", existingToken);

    if (existingToken[0] !== undefined) {
      await jwt.verify(refreshToken, JWT_REFRESH_KEY, async (error, result) => {
        if (error) {
          res.status(400).json("invalid token");
        } else {
          const accToken = await token.tokenGenerator(
            existingToken[0].email_id
          );
          res.status(200).json({ accesstoken: accToken });
        }
      });
    } else {
      res.status(201).json("Token expired/Invalid. Please login");
    }
  } catch (error) {
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
};

const resendOtp = async (req, res) => {
  try {
    const { email_id, mobile_number } = req.body;
    //generate otp
    let otp = await generateOTP();
    if(mobile_number == "7904148922"){
      otp=606060
    }

    if(mobile_number == "8883660851"){ //krishna -testing
      otp=606060
    }
    const existingUser = await db.sequelize.query(query.getUserByMobile, {
      replacements: [mobile_number],
      type: QueryTypes.SELECT,
    });
    if(existingUser[0] !== undefined){
    // Send OTP via Fast2SMS
    const isSent = await sendOTP(mobile_number, otp);

    console.log("isSent:", isSent);
    if (isSent) {
      let resultData = await saveSigninOTPToDatabase(existingUser[0].email_id.toLowerCase(), mobile_number, otp);
      if(resultData === false){
        res
        .status(202)
        .json({
          success: false,
          message:
            "OTP attempts exceeded, Please try again after 30 minutes",
        });
      }else{
      // let result1 = await db.sequelize.query(query.otpStatus, {
      //   replacements: [mobile_number],
      //   type: QueryTypes.UPDATE,
      // });
      let result1 = await db.sequelize.query(query.otpStatus, {
        replacements: [existingUser[0].email_id],
        type: QueryTypes.UPDATE,
      });

      res.status(200).json({ success: true, message: "OTP resent" });

    }
    } else {
      res
        .status(202)
        .json({
          success: false,
          message:
            "OTP attempt exceed, Please try again after sometime or try with different mobile number",
        });
    }
  }else{
    res
    .status(202)
    .json({
      success: false,
      message:
        "No user exists with this mobile number",
    });
  }

  } catch (error) {
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
};

const mobileNoVerify = async (req, res) => {
  try {
    const { email_id, current_mobile_number,new_mobile_number,change_mobile_number, notif_token } = req.body;
    //generate otp
    let otp = await generateOTP();
    if(new_mobile_number == "7904148922"){
      otp=606060
    }
    console.log("line306: ", otp);
    if(!change_mobile_number){
      const saveGoogleUserMobile = await mobileNumber(
        email_id,
        current_mobile_number,
        notif_token
      );
    }
    var isSent = false
    // Save OTP to the database
    if(change_mobile_number){
      const checkEmandMOb = await db.sequelize.query(query.checkEmandMob, {
        replacements:[email_id.toLowerCase() ,current_mobile_number],
        type:QueryTypes.SELECT
      });
      const checkNwMob = await db.sequelize.query(query.checkNwMob, {
        replacements:[new_mobile_number],
        type:QueryTypes.SELECT
      });
      console.log(checkEmandMOb[0],checkNwMob[0]);
      if(checkEmandMOb[0] != undefined){
        if(checkNwMob[0] == undefined ){
          isSent = await sendOTP(new_mobile_number, otp);
          if(isSent){
            let save = await saveSigninOTPToDatabase(email_id, new_mobile_number, otp);
            let result1 = await db.sequelize.query(query.otpStatus, {
              replacements: [email_id.toLowerCase()],
              type: QueryTypes.UPDATE,
            });
            res
            .status(200)
            .json({ success: true, message: "OTP sent to mobile number" });
            return
          }
          else{
            res.status(400).json("OTP Limit exceeded");
            return
          }
        }
        else{
          res.status(400).json("Mobile number already registered");
          return
        }
      }
      else{
        res.status(400).json("Email is not registered with current mobile number.");
        return
      }
    }
    else{
      let save = await saveSigninOTPToDatabase(email_id, current_mobile_number, otp);
    }
    //console.log("line311: ", save);
    //  if(save === false){
    //        res.status(202).send("OTP attempt exceed, Please try again after sometime or try with different mobile number")
    //  }else{
    let result1 = await db.sequelize.query(query.otpStatus, {
      replacements: [email_id.toLowerCase()],
      type: QueryTypes.UPDATE,
    });
    // Send OTP via Fast2SMS
    // var isSent = false
    // if(change_mobile_number){
    //   isSent = await sendOTP(new_mobile_number, otp);
    // }
    // else{
    //   isSent = await sendOTP(current_mobile_number, otp);
    // }

    console.log("isSent:", isSent);
    if (isSent) {
      res
        .status(200)
        .json({ success: true, message: "OTP sent to mobile number" });
    } else {
      res
        .status(202)
        .json("OTP attempt exceed, Please try again after sometime or try with different mobile number");
    }
    //}
  } catch (error) {
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
};

const mobileNumber = async (email_id, mobile_number, notif_token) => {
  await db.sequelize.query(query.addMobileToUser, {
    replacements: [mobile_number, notif_token, email_id.toLowerCase()],
    type: QueryTypes.UPDATE,
  });
};

const verifyOtp = async (req, res) => {
  try {
    const { email_id,phone_number, current_phone_number,change_phone_number, otp, notif_token } = req.body;
    var result = []
    if(change_phone_number){
      result = await db.sequelize.query(query.getOtp1, {
        replacements: [phone_number],
        type: QueryTypes.SELECT,
      });
    }
    else{
      result = await db.sequelize.query(query.getOtp1, {
        replacements: [phone_number],
        type: QueryTypes.SELECT,
      });
    }
    
    if(change_phone_number){
      const updateMobileNumberStatus = await db.sequelize.query(query.updateMobileNumber, {
        replacements:[phone_number,email_id.toLowerCase(),current_phone_number],
        type: QueryTypes.UPDATE
      });
      
      if(updateMobileNumberStatus[1]===0){
        res.status(400).json("Email is not registered with current mobile number.");
        return
      }
    }
    if (result[0] !== undefined && result[0].otp === otp) {
      var getRegInfo =[]
      if(change_phone_number){
        const updateOtpStatus = await db.sequelize.query(query.updateOtpStatus, {
          replacements: [notif_token, current_phone_number],
          type: QueryTypes.UPDATE,
        });
        getRegInfo = await db.sequelize.query(query.regInfo, {
          replacements: [phone_number],
          type: QueryTypes.SELECT,
        });
      }
      else{
        const updateOtpStatus = await db.sequelize.query(query.updateOtpStatus, {
          replacements: [notif_token, phone_number],
          type: QueryTypes.UPDATE,
        });
        getRegInfo = await db.sequelize.query(query.regInfo, {
          replacements: [phone_number],
          type: QueryTypes.SELECT,
        });
      }
      
      if (getRegInfo[0] !== undefined) {

        const accessToken = await token.tokenGenerator(getRegInfo[0].mobile_number);
        const refreshToken = await token.refTokenGen(getRegInfo[0].mobile_number);

        const [ event ] = await db.sequelize.query(query.eventInfo, {
          type: QueryTypes.SELECT,
        });

        console.log(event, "event info")

        //update token in database
        if(change_phone_number){
          await db.sequelize.query(query.updateReftoken, {
            replacements: [refreshToken, notif_token, phone_number],
            type: QueryTypes.UPDATE,
          });
        }
        else{
          await db.sequelize.query(query.updateReftoken, {
            replacements: [refreshToken, notif_token, current_phone_number],
            type: QueryTypes.UPDATE,
          });
        }
        res.status(200).json({
          event_id: event?.event_id ?? null,
          registrant_id: getRegInfo[0].registrant_id,
          user_id: getRegInfo[0].registrant_id,
          corporate_id: getRegInfo[0].corporate_sponsor_id_ref,
          email_id: getRegInfo[0].email_id,
          google_id: getRegInfo[0].google_id,
          mobile_number: getRegInfo[0].mobile_number,
          first_name: getRegInfo[0].first_name,
          last_name: getRegInfo[0].last_name,
          mobile_no_verify_status: true,
          accessToken: accessToken,
          refreshToken: refreshToken,
          message: "OTP verified successfully.",
        });
      } else {
        res
          .status(201)
          .json("Invalid otp / user with this mobile number does not exist");
      }
    } else {
      res.status(201).json({ success: false, message: "Invalid OTP." });
    }
  } catch (error) {
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
};

// google sign up code begins here

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

const signupUrl = async (req, res) => {
  res.send(
    '<a href="/api/registrant/auth/google">Authenticate with Google</a>'
  );
};

const protected = async (req, res) => {
  console.log("line 33", req.user);
  const newUser = {
    google_id: req.user.id,
    display_name: req.user.displayName,
    email: req.user.email,
  };
  console.log("line 37", newUser);
  //check user google_id
  const checkUser = await db.sequelize.query(query.getUserByGoogleId, {
    replacements: [newUser.google_id],
    type: QueryTypes.SELECT,
  });
  if (checkUser[0] === undefined) {
    try {
      const user = await createUser(newUser);
      console.log("line262", user);
      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.redirect("/api/registrant/profile");
      });
    } catch (error) {
      console.log(error);
      // Handle error
      res.redirect("/");
    }
  } else {
    res.status(200).json("User already exist, Please login");
  }
};

const profile = async (req, res) => {
  if (req.isAuthenticated()) {
    let name = req.user[0];
    console.log("line 318", req.user);
    //console.log("name - line280", name[0].display_name);
    res.status(200).json({
      id: name[0].registrant_id,
      google_id: name[0].google_id,
      registrant_name: name[0].first_name,
      email_id: name[0].email_id,
    });
  } else {
    res.redirect("/signup");
  }
};

const logOut = async (req, res) => {
  req.logout();
  req.session.destroy();
  res.send("Goodbye!");
};

const authGoogleFailiuer = async (req, res) => {
  res.send("Failed to authenticate..");
};

async function createUser(newUser) {
  let gid = newUser.google_id;
  console.log("line 361", gid);
  try {
    const user = await db.sequelize.query(query.addGoogleUsers, {
      replacements: [newUser.display_name, newUser.email, gid],
      type: QueryTypes.INSERT,
    });

    //generate registrant user id for payment
    const getId = await db.sequelize.query(query.getUserByMail, {
      replacements: [newUser.email.toLowerCase()],
      type: QueryTypes.SELECT,
    });
    console.log("line 235: ", getId);
    const reg_payment_user_id = "APRPAY0" + Number(getId[0].registrant_id);

    const updateRegUserId = await db.sequelize.query(query.updateUserId, {
      replacements: [reg_payment_user_id, getId[0].registrant_id],
      type: QueryTypes.UPDATE,
    });

    return user;
  } catch (error) {
    throw error;
  }
}

async function findUserById(id) {
  const query = `
    SELECT * FROM google_users WHERE id = ?`;

  try {
    const user = await db.sequelize.query(query, {
      replacements: [id],
      type: QueryTypes.SELECT,
    });
    return user;
  } catch (error) {
    throw error;
  }
}

const corporateLogin = async (req, res) => {
  try {
    const { emailid, password, corp_notif_token } = req.body;

    const eventInfo = await db.sequelize.query(query.eventInfo, {
      type: QueryTypes.SELECT,
    });

    const getUser = await db.sequelize.query(query.getCorp, {
      replacements: [emailid.toLowerCase(), eventInfo[0].event_id],
      type: QueryTypes.SELECT,
    });

    if (getUser[0] == undefined) {
      res.status(201).json("Invalid username/emaild");
    } else {
      if (password !== null) {
        //checking the user password
        const userPassword = getUser[0].corp_registrant_password;
        const decryptedPassword = crypt.decrypt(userPassword);
        //console.log("pass", userPassword);

        if (decryptedPassword === password) {
          const accessToken = await token.tokenGenerator(emailid);
          const refreshToken = await token.refTokenGen(emailid);

          //update token in database
          const data = await db.sequelize.query(query.updateCorpRefreshToken, {
            replacements: [refreshToken, corp_notif_token, emailid],
            type: QueryTypes.UPDATE,
          });
          console.log("line 867 ", data);
          if (data[1] === 1) {
            res.status(200).json({
              // event_id: getUser[0].event_id_ref,
              // coporate_sponsor_id: getUser[0].corporate_id,
              // first_name: getUser[0].corp_registrant_firstname,
              // last_name: getUser[0].corp_registrant_lastname,
              // email_id: emailid,
              // mobile_number: getUser[0].mobile_number,
              // accessToken: accessToken,
              // refreshToken: refreshToken,
              event_id: getUser[0].event_id_ref,

              user_id: getUser[0].corporate_id,
              first_name: getUser[0].corp_registrant_firstname,
              last_name: getUser[0].corp_registrant_lastname,
              email_id: emailid,
              mobile_number: getUser[0].mobile_number,
              accessToken: accessToken,
              refreshToken: refreshToken,

              type: "corporatesponser",
            });
          } else {
            res.status(201).json("Something went wrong");
          }
        } else {
          res.status(201).json("Invalid password");
        }
      } else {
        res.status(201).json("Please enter the password");
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

const generateTokenForSponsor = async (req, res) => {
  try {
    const refreshToken = req.body.refreshtoken;
    if (refreshToken == null) {
      res.status(401).json("Plese enter the token");
    }

    const existingToken = await db.sequelize.query(query.checkSponsorReftoken, {
      replacements: [refreshToken],
      type: QueryTypes.SELECT,
    });

    console.log("refrehToken: ", existingToken);

    if (existingToken[0] !== undefined) {
      await jwt.verify(refreshToken, JWT_REFRESH_KEY, async (err, result) => {
        if (err) {
          res.status(400).json("invalid token");
        } else {
          const accToken = await token.tokenGenerator(
            existingToken[0].corp_registrant_mailid
          );
          res.status(200).json({ accesstoken: accToken });
        }
      });
    } else {
      res.status(201).json("Token expired/Invalid. Please login");
    }
  } catch (error) {
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email_id } = req.body;
    const checkUser = await db.sequelize.query(query.getUserByMail, {
      replacements: [email_id.toLowerCase()],
      type: QueryTypes.SELECT,
    });
    if (checkUser[0] !== undefined) {
      const JWT_SECRET = "secret password";
      const secret = JWT_SECRET + email_id;

      const payload = { email_id: email_id };
      const token = jwt.sign(payload, secret, { expiresIn: "15m" });
      const message =
        "you can reset your password using this link, link will be expired in 15 minutes";
      const footer = "Thanks and regards APR";
      const link = `https://aprmarathon.org/#/password/set?email=${email_id}&token=${token}`;
      console.log(link);
      const to = email_id;
      const from = "laksh0762@gmail.com";
      const subject = "APR- RESET YOUR PASSWORD";
      const text = link;
      const html = `<html><p>${message}</p><p>${text}</p>${footer}</p></html>`;

      const resultMail = await mail.mail(to, subject, html);
      console.log(resultMail);
      if (resultMail === true) {
        res
          .status(200)
          .json({ message: "password reset link sent to your mail!" });
      } else {
        console.log("mail not sent!");
      }
    } else {
      res.status(201).json("user with this mail does not exist");
    }
  } catch (error) {
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email_id, token } = req.params;
    const password = req.body.password;
    const encryptPassword = crypt.encrypt(password);
    console.log("token: " + token);

    const checkUser = await db.sequelize.query(query.getUserByMail, {
      replacements: [email_id.toLowerCase()],
      type: QueryTypes.SELECT,
    });

    if (checkUser[0] !== undefined) {
      const JWT_SECRET = "secret password";
      const secret = JWT_SECRET + email_id;
      try {
        const verifyToken = jwt.verify(token, secret);
        console.log(verifyToken);
      } catch (err) {
        res.status(400).json(err);
        return;
      }

      const updatePassword = await db.sequelize.query(query.updatePassword, {
        replacements: [encryptPassword, email_id.toLowerCase()],
        type: QueryTypes.UPDATE,
      });

      if (updatePassword[1] === 1) {
        res.status(200).json("password updated successfully!");
      }
    } else {
      res.status(201).json("user with this mail does not exist");
    }
  } catch (error) {
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
};

const existingUserSignUp = async (req, res) => {
  try {
    //const { data } = req.body;

    let count = 0;
    let flag = 0;
    let email = [];

    //   let obj = {
    //     first_name: data[i].first_name,
    //     middle_name: data[i].middle_name,
    //     last_name: data[i].last_name,
    //     email_id: data[i].email_id,
    //     mobile_number: data[i].mobile_number,
    //   };

    const event_info = await eventInfo();

    // check whether user already signed up
    const getExistingUser = await db.sequelize.query(query.getUser, {
      type: QueryTypes.SELECT,
    });

    console.log(getExistingUser);
    if (getExistingUser[0] !== undefined) {
      for (let i = 0; i < getExistingUser.length; i++) {
        const password = await generatePassword();
        const hashedPassword = await crypt.encrypt(password);

        // store data in database

        const result = await db.sequelize.query(query.updateUserPassword, {
          replacements: [hashedPassword, getExistingUser[i].registrant_id],
          type: QueryTypes.UPDATE,
        });

        if (result[1] === 1) {
          const message = `Hai ${getExistingUser[i].first_name}, welcome to team APR, we are introducing our new app for APR-Marathon registration. You can login to the app with the following credentials:    `;
          const footer = "Thanks and regards APR";
          const to = getExistingUser[i].email_id;
          // const from = "laksh0762@gmail.com";
          const subject = `Welcome to the ${event_info[0].event_year} Marathon Registration!`;
          // const text = `Your email-id: ${getExistingUser[i].email_id} and password: ${password}`;
          // const html = `<html><p>${message}</p><p>${text}</p><p>${footer}</p></html>`;

          const html =
            ` <html>` +
            //`<head> <title> Welcome to the ${event_info[0].event_year} Marathon Registration!</title></head>`+
            `<body>
       <div style="width: 100%; display: flex; justify-content: center; align-items: center;" class="center-container">
         <img style="margin: 0 auto;" src="https://res.cloudinary.com/dm5j0hio0/image/upload/v1697720655/apr/jxlqgdyhjehiuflbsbzq.png" alt="Image Description"> 
       </div>` +
            `<h4> Dear ${getExistingUser[i].first_name}!</h4>` +
            `<p>&nbsp; We are thrilled to welcome you to the  ${event_info[0].event_year} Marathon, one of the most exciting running events of the year! We're excited to have you join us in this incredible journey towards fitness and personal achievement.</p>` +
            // `<p>&nbsp; We are thrilled to welcome you to the  ${event_info[0].event_year} Marathon, one of the most exciting running events of the year! We're excited to have you join us in this incredible journey towards fitness and personal achievement.</p>`+
            `<p>&nbsp; Registration is now officially open, and we can't wait to see you at the starting line. Whether you're a seasoned marathon runner or just taking your first steps into the world of long-distance running, our event is designed to accommodate participants of all skill levels.</p>` +
            `<h4>Key Details:</h4>` +
            `<p>&nbsp; Event Date: ${event_info[0].event_date} </p>` +
            `<p>&nbsp; Location:${event_info[0].event_location} </p>` +
            `<p>&nbsp; Registration Period:   ${event_info[0].registration_start_date} to  ${event_info[0].event_cut_off_date}</p>` +
            `<h4>How to register:</h4>` +
            `<p>&nbsp; This year, we are proud to introduce our brand-new marathon registration app and website, making it easier than ever to sign up for the race. Here's how you can get started:</p>` +
            `<p><h4>1.Visit our Website:</h4> Our user-friendly website is now live and ready for registrations. Simply go to https://aprmarathon.org/ and follow the on-screen instructions to complete your registration.</p>` +
            `<p><h4>2.Download the App:</h4> For added convenience, we have launched a dedicated marathon registration app. It's available for download on both iOS and Android devices. Search for "Marathon [Year] Registration" on the App Store or Google Play Store </p>` +
            `<p><h4>3.Register Early:</h4> Early registration ensures you secure your spot in the marathon and may come with some exclusive benefits. Don't miss out on this opportunity!</p>` +
            `<p><h4>4.Spread the Word:</h4>We encourage you to share the news with your friends and family. Running together is more fun, and you can motivate each other to achieve your goals.</p>` +
            `<p>&nbsp; Get ready to experience the thrill of the marathon, the support of our fantastic community, and the sense of accomplishment that comes from crossing that finish line. We have exciting plans in store for this year, including fantastic prizes, entertainment, and more.</p>` +
            `<p>&nbsp; Don't hesitate to reach out to us if you have any questions or need assistance with the registration process. You can contact our dedicated support team at aprcharitabletrust@gmail.com or call us at 08025842939.</p>` +
            `<p>&nbsp; Thank you for choosing the ${event_info[0].event_year} Marathon. We can't wait to see you at the start line and celebrate your journey towards success.</p>` +
            `<p>&nbsp; You can login with your email-id: ${getExistingUser[i].email_id} and password: ${password} </p>` +
            `<p>Best regards</p>` +
            `<p>Team APR</p>` +
            `<p>Title: ${event_info[0].event_name}  </p>` +
            `<p>Our website: https://aprmarathon.org/ </p>` +
            `<p>Our email-id: aprcharitabletrust@gmail.com </p>` +
            `<p>Our mobile Number: 08025842939 </p> </body> </html>`;
          const resultMail = await mail.mail(to, subject, html);

          console.log(resultMail);
          if (resultMail === true) {
            count++;
          }
        }
        console.log(count);

        // }else{
        //   flag++;
        //   email.push(getExistingUser[i].email_id);
        // // res.status(201).json(`user with emailid: ${obj.email_id} already exist. `)
        // }
      }
      if (count === getExistingUser.length) {
        res.status(200).json("Mail sent to the registrant");
      } else {
        res.status(201).json(`please check the data`);
      }
    } else {
      res.status(201).json(`No existing user list in database`);
    }
  } catch (error) {
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
};

async function generatePassword() {
  return new Promise((resolve, reject) => {
    let length = 8,
      charset =
        "@#$&*0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$&*0123456789abcdefghijklmnopqrstuvwxyz",
      password = "";
    for (let j = 0, n = charset.length; j < length; ++j) {
      password += charset.charAt(Math.floor(Math.random() * n));
    }
    console.log("password:", password);
    return resolve(password);
  });
}

const checkOtpVerifyStatus = async (req, res) => {
  try {
    const { email_id } = req.body;

    const result = await db.sequelize.query(query.otpVerifyStatus, {
      replacements: [email_id.toLowerCase()],
      type: QueryTypes.SELECT,
    });

    //console.log(result);

    if (result[0] !== undefined) {
      res.status(200).json({ mobile_no_verify_status: true });
    } else {
      res.status(201).json({ mobile_no_verify_status: false });
    }
  } catch (error) {
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
};

const updateProfileImage = async (req, res) => {
  const { image_url, registrant_id } = req.body;

  const updateImage = await db.sequelize.query(query.updateImage, {
    replacements: [image_url, registrant_id],
    type: QueryTypes.UPDATE,
  });

  if (updateImage[1] === 1) {
    res.status(200).json("Image updated");
  } else {
    res.status(201).json("something went wrong, imgae not updated");
  }
};

const deleteAccount = async (req, res) => {
  try {
    const registrant_id = req.params.registrant_id;
    //get  active event id
    const eventInfo = await db.sequelize.query(query.eventInfo, {
      type: QueryTypes.SELECT,
    });

    //check user made any registration for current event
    const checkRegistration = await db.sequelize.query(query.checkOrder, {
      replacements: [registrant_id, eventInfo[0].event_id],
      type: QueryTypes.SELECT,
    });
    console.log("line 1238: paid registration:",checkRegistration);

    //check the user made any registration under corporate
    const checkCorpReg = await db.sequelize.query(query.checkCorpOrder, {
      replacements: [registrant_id, eventInfo[0].event_id],
      type: QueryTypes.SELECT,
    });

    console.log("line 1246: corp reg: ",checkCorpReg);

    if (checkRegistration.length > 0 || checkCorpReg.length > 0) {

            res.status(202).json("You've enrolled in a currently active event. Should you wish to delete your account, please contact the APR administrator.");
    
    } else {
      const deleteUser = await db.sequelize.query(query.deleteAccount, {
        replacements: [registrant_id],
        type: QueryTypes.UPDATE,
      });

      if (deleteUser[1] > 0) {
        res.status(200).json("Account deleted...!");
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

module.exports = {
  userSignup,
  userLogin,
  generateToken,
  resendOtp,
  verifyOtp,

  isLoggedIn,
  signupUrl,
  protected,
  profile,
  logOut,
  authGoogleFailiuer,
  findUserById,
  mobileNoVerify,
  //corporateUserSignup,
  // corporateUserLogin,
  corporateLogin,
  generateTokenForSponsor,
  forgotPassword,
  resetPassword,
  existingUserSignUp,
  checkOtpVerifyStatus,
  updateProfileImage,

  deleteAccount,
};
