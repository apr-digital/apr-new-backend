const db = require("../config/dbconfig");
const query = require("../models/adminlogin.model");
const { sequelize } = require("sequelize");
const { QueryTypes } = require("sequelize");
const hash = require("../middlewares/crypt");
const jwt = require("jsonwebtoken");
const mail = require("../middlewares/mail");
const crypt = require("../middlewares/crypt");
const pushNotif = require("../middlewares/pushnotification");


const JWT_REFRESH_KEY = "ABCDEFGHIJKLlkjihgfedcba";
const token = require("../middlewares/token");

const createAdminTable = async (req, res) => {
  const result = await db.sequelize.query(query.adminTable, {
    type: QueryTypes.CREATE,
  });
  console.log("result", result);
  res.status(200).json("Admin table created");
};

const createRunnerTable = async (req, res) => {
  const result = await db.sequelize.query(query.runnerTable, {
    type: QueryTypes.CREATE,
  });
  console.log("result", result);
  res.status(200).json("Runner table created");
};

const createRegistrantTable = async (req, res) => {
  const result = await db.sequelize.query(query.registrantTable, {
    type: QueryTypes.CREATE,
  });
  console.log("result", result);
  res.status(200).json("Runner table created");
};
const createEventTable = async (req, res) => {
  const result = await db.sequelize.query(query.eventTable, {
    type: QueryTypes.CREATE,
  });
  console.log("result", result);
  res.status(200).json("Runner table created");
};
const createPaymentTable = async (req, res) => {
  const result = await db.sequelize.query(query.paymentTable, {
    type: QueryTypes.CREATE,
  });
  console.log("result", result);
  res.status(200).json("Runner table created");
};
const createRegistrantTypeTable = async (req, res) => {
  const result = await db.sequelize.query(query.registrantTypeTable, {
    type: QueryTypes.CREATE,
  });
  console.log("result", result);
  res.status(200).json("Runner table created");
};
const createRegistrantSourceTable = async (req, res) => {
  const result = await db.sequelize.query(query.registrantSourceTable, {
    type: QueryTypes.CREATE,
  });
  console.log("result", result);
  res.status(200).json("Runner table created");
};
const createRegistrantClassTable = async (req, res) => {
  const result = await db.sequelize.query(query.registrantClassTable, {
    type: QueryTypes.CREATE,
  });
  console.log("result", result);
  res.status(200).json("Runner table created");
};

const createTicketTypeTable = async (req, res) => {
  const result = await db.sequelize.query(query.ticketTypeInfoTable, {
    type: QueryTypes.CREATE,
  });
  console.log("result", result);
  res.status(200).json("Admin table created");
};

const createCardDetailsTable = async (req, res) => {
  const result = await db.sequelize.query(query.cardDetailsTable, {
    type: QueryTypes.CREATE,
  });
  console.log("result", result);
  res.status(200).json("Admin table created");
};

const createRaceCategoryTable = async (req, res) => {
  const result = await db.sequelize.query(query.raceCategoryTable, {
    type: QueryTypes.CREATE,
  });
  console.log("result", result);
  res.status(200).json("Admin table created");
};

const createAgeCategoryTable = async (req, res) => {
  const result = await db.sequelize.query(query.ageCategoryTable, {
    type: QueryTypes.CREATE,
  });
  console.log("result", result);
  res.status(200).json("Age category table created");
};


const adminLogin = async (req, res) => {
  try{
  const { username, password, notif_token} = req.body;
  console.log("username", username);

  // checking user already exist or not
  const activeEvent = await db.sequelize.query(query.getActiveEvent,{
    type: QueryTypes.SELECT
  });
  let event_id = null;
  
  if(activeEvent[0] != undefined){
    event_id = activeEvent[0].event_id
  }
  const existingUser = await db.sequelize.query(query.getUserByMail, {
    replacements: [username],
    type: QueryTypes.SELECT,
  });

  //console.log("pass",existingUser );

  if (existingUser[0]===undefined) {
    res.status(202).json("Invalid username/emaild");
  } else {
    //checking r=the user password
    const userPassword = existingUser[0].admin_password;
     
    const decryptedPassword = crypt.decrypt(userPassword);


    //console.log( password);
    //console.log("pass1: ",  decryptedPassword);
       // console.log(decryptedPassword === password);
    if (decryptedPassword === password) {
      const accessToken = await token.tokenGenerator(username);
      const refreshToken = await token.refTokenGen(username);

      const updateToken = await db.sequelize.query(query.updateRefToken, {
        replacements: [refreshToken,  notif_token, username],
        type: QueryTypes.UPDATE,
      });

      if(updateToken[1]===1){
      res.status(200).json({
      //   user_id: existingUser[0].admin_id,
      //   username: username,
      //  // passsword: password,
      //   accessToken: accessToken,
      //   refreshToken: refreshToken,
            event_id: event_id,

            user_id: existingUser[0].admin_id,
            first_name: existingUser[0].admin_firstname,
            last_name: existingUser[0].admin_lastname,
            email_id: existingUser[0].admin_user_name,
            mobile_number: existingUser[0].admin_phone,

            // passsword: password,
            accessToken: accessToken,
            refreshToken: refreshToken,
            type: existingUser[0].role

      });

    }else{
      res.status(201).json("something went wrong")
    }
    } else {
      res.status(201).json("Invalid password");
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
      //const reToken =  await token.reTokenValidator(refreshToken);
      await jwt.verify(refreshToken, JWT_REFRESH_KEY, async (error, result) => {
        if (error) {
          res.status(400).json("invalid token");
        } else {
          const accToken = await token.tokenGenerator(
            existingToken[0].admin_user_name
          );
          res.status(200).json({ accesstoken: accToken });
        }
      });
    } else {
      res.status(201).json("Token expired/Invalid. Please login");
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

const getAdmin = async (req, res) => {
  try {
    const admin_id = req.params.admin_id;
    const result = await db.sequelize.query(query.getAdminInfo, { replacements: [admin_id], type: QueryTypes.SELECT });
    res.status(200).json(result)
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
}



const updateAdminInfo = async (req, res) => {
  try {
    const {
      admin_id,
      admin_firstname,
      admin_lastname,
      admin_emailid,
      admin_phone,
      admin_password,
      profile_image,
      role,
      admin_status
    } = req.body;
    const checkUser = await db.sequelize.query(query.adminInfo, { replacements: [admin_id], type: QueryTypes.SELECT })
    if (checkUser[0] !== undefined) {
      // Get the current timestamp in milliseconds
      const currentTimestampMillis = Date.now();

      // Create a Date object using the current timestamp
      const updated_at = new Date(currentTimestampMillis);

      const result = await db.sequelize.query(query.updateAdmin, {
        replacements: [
          admin_firstname,
          admin_lastname,
          admin_emailid,
          admin_phone,
          admin_password,
          profile_image,
          role,
          admin_status,
          updated_at,
          admin_id,
        ],
        type: QueryTypes.UPDATE,
      });
      console.log(result);
      if (result[1] === 1) {
        res.status(200).json("admin information updated");
      } else {
        res.status(201).json("please check the data");
      }
    } else {
      res.status(201).json("admin information does not exist")
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

const createAdmin = async (req, res) => {
  try {
    const {
      admin_firstname,
      admin_middlename,
      admin_lastname,
      admin_emailid,
      admin_phone,
      role,
      created_by,
    } = req.body;
    const password = await generatePassword();

    //const crypt = require("../middlewares/crypt");

    const hashedPassword = await crypt.encrypt(password);

    //console.log(password);
    const existingUser = await db.sequelize.query(query.getAdmin, { replacements: [admin_emailid], type: QueryTypes.SELECT })
    //console.log(existingUser); 
    if (existingUser[0] === undefined) {
      const addAdmin = await db.sequelize.query(query.addAdmin, {
        replacements: [
          admin_firstname,
          admin_middlename,
          admin_lastname,
          admin_emailid,
          admin_phone,
          hashedPassword,
          role,
          "active",
          created_by,
        ],
        type: QueryTypes.INSERT,
      });
      console.log(addAdmin);
      if (addAdmin[1] === 1) {
        const subject = "Admin/volunteer creation confirmation mail";
        const message = `you are added as admin/volunteer in ACT your login credential is User Name:${admin_emailid} and Password:${password}`;
        //let obj = {
        //from: "laksh0762@gmail.com",
        let to = admin_emailid;
        // subj: subject,
        // msg: message,
        // };

        // let text = "Announcement from ACT!";
        let html = `<html>
     <head>
      <title> Announcement from ACT! </title>
      </head> 
      <body> <h4> Hello ${admin_firstname}!</h4>
      <p>${message}</p> 
      </body></html>`;
        let mailResponse = await mail.mail(
          to,
          subject,
          html
        );
        console.log("mailResponse", mailResponse);
        if (mailResponse == true) {
          res.status(200).json("Admin created successfully");
        } else {
          res.status(201).json("error occured, Please check the data");
        }

      } else {
        res.status(201).json("Please check he data")
      }
    } else {
      res.status(201).json("User with this email id already exist");
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


const inactivateAdmin = async (req, res) => {
  try {
    const admin_id = req.params.admin_id;
    const checkAdmin = await db.sequelize.query(query.adminInfo, { replacements: [admin_id], type: QueryTypes.SELECT });
    if (checkAdmin[0] !== undefined) {
      const result = await db.sequelize.query(query.updateAdminStatus, { replacements: ['inactive', admin_id], type: QueryTypes.UPDATE });
      if (result[1] === 1) {
        res.status(200).json("Admin inactivated");
      }
    } else {
      res.status(200).json("Admin information does not exist")
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
}



const activateAdmin = async (req, res) => {
  try {
    const admin_id = req.params.admin_id;
    const checkAdmin = await db.sequelize.query(query.adminInfo, { replacements: [admin_id], type: QueryTypes.SELECT });
    if (checkAdmin[0] !== undefined) {
      const result = await db.sequelize.query(query.updateAdminStatus, { replacements: ['active', admin_id], type: QueryTypes.UPDATE });
      if (result[1] === 1) {
        res.status(200).json("Admin activated");
      }
    } else {
      res.status(200).json("Admin information does not exist")
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
}


const forgotPassword = async(req,res)=>{
  try{
         const {email_id} =req.body;
         const checkUser = await db.sequelize.query(query.getUserByMail, {replacements:[email_id], type:QueryTypes.SELECT});
         if(checkUser[0] !== undefined){
           const JWT_SECRET = "secret password";
           const secret = JWT_SECRET+email_id;

           const payload = { email_id: email_id };
              const token = jwt.sign(payload, secret, { expiresIn: "15m" });
              const message ="you can reset your password using this link, link will be expired in 15 minutes";
              const footer ="Thanks and regards APR";
              const link =  `https://stagingadmin.aprmarathon.org/#/password/set?email=${email_id}&token=${token}`;
              // const link =  `https://apradmin.aprmarathon.org/#/password/set?email=${email_id}&token=${token}`;
              console.log(link);
              const to = email_id;
              const from = "laksh0762@gmail.com";
              const subject = "APR- RESET YOUR PASSWORD";
             // const text = link;
              //const html = `<html><p>${message}</p><p>${text}</p>${footer}</p><p>${link}</p></html>`;
              const html = `<html><p>${message}</p><p>${footer}</p><p>${link}</p></html>`;

              const resultMail =await mail.mail(to,subject, html);
              console.log(resultMail);
              if (resultMail === true) {
                res
                    .status(200)
                    .json({ message: "password reset link sent to your mail!" });
            } else {
                console.log("mail not sent!");
            }
         }else{
          res.status(201).json("user with this mail does not exist")
         }
        } catch (error) {
          res.status(400).json({
            error_msg: error.message,
            stack_trace: error.stack,
            error_obj: error,
          });
        }    

}

const resetPassword = async (req, res) => {
  try {
    const { email_id, token } = req.params;
    const password = req.body.password;
    const hashedPassword = await crypt.encrypt(password);
    //const encryptPassword =crypt.encrypt(password);
    console.log("token: " + token);

    const checkUser = await db.sequelize.query(query.getUserByMail, { replacements: [email_id], type: QueryTypes.SELECT });
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
      const updatePassword = await db.sequelize.query(query.updatePassword, { replacements: [hashedPassword, email_id], type: QueryTypes.UPDATE })
      if (updatePassword[1] === 1) {
        res.status(200).json("password updated successfully!")
      }
    } else {
      res.status(201).json("user with this mail does not exist")
    }
  } catch (error) {
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
};

const dropAdmin = async (req, res) => {
  try {
    const admin_id = req.params.admin_id;
    const checkAdmin = await db.sequelize.query(query.adminInfo, { replacements: [admin_id], type: QueryTypes.SELECT });
    if (checkAdmin[0] !== undefined) {
      const result = await db.sequelize.query(query.dropAdmin, { replacements: [admin_id], type: QueryTypes.UPDATE });
      if (result[1] === 1) {
        res.status(200).json("Admin dropped");
      }
    } else {
      res.status(201).json("Admin information does not exist")
    }
  } catch (error) {
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
}

const getAllAdmin = async (req, res) => {
  try {
    const adminData = await db.sequelize.query(query.getAdmins, { type: QueryTypes.SELECT });

    res.status(200).json(adminData);

  } catch (error) {
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
}

const editProfilePic = async (req, res) => {
  try {
    const { admin_id, profile_image } = req.body;

    const checkAdmin = await db.sequelize.query(query.adminInfo, { replacements: [admin_id], type: QueryTypes.SELECT });
    if (checkAdmin[0] !== undefined) {
      const result = await db.sequelize.query(query.editPic, { replacements: [profile_image, admin_id], type: QueryTypes.UPDATE });
      if (result[1] === 1) {
        res.status(200).json("Profile pic updated");
      }
    } else {
      res.status(201).json("Admin information does not exist")
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
  createAdminTable,
  createRunnerTable,
  createEventTable,
  createPaymentTable,
  createRegistrantSourceTable,
  createRegistrantClassTable,
  createRegistrantTypeTable,
  createRegistrantTable,
  createTicketTypeTable,
  createCardDetailsTable,
  createRaceCategoryTable,
  createAgeCategoryTable,

  adminLogin,
  generateToken,
  updateAdminInfo,
  editProfilePic,
  createAdmin,
  inactivateAdmin,
  activateAdmin,
  dropAdmin,
  forgotPassword,
  resetPassword,
  getAdmin,
  getAllAdmin
};
