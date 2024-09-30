const db = require("../config/dbconfig");
const query = require("../models/corpregistration.model");
const { sequelize } = require("sequelize");
const { QueryTypes } = require("sequelize");
const mail = require("../middlewares/mail");

const dataForCorpRunnerReg = async (req, res) => {
  try {
    const { registrant_type_id, registrant_id } = req.body;

    const registrantData = await db.sequelize.query(query.registrantInfo, {
      replacements: [registrant_id],
      type: QueryTypes.SELECT,
    });

    const registrantClass = await db.sequelize.query(query.registrantClass, {
      replacements: [registrant_type_id],
      type: QueryTypes.SELECT,
    });

    // const registrantSource = await db.sequelize.query(query.registrantSource, {
    //   type: QueryTypes.SELECT,
    // });

    const runCategory = await db.sequelize.query(query.runCategory, {
      type: QueryTypes.SELECT,
    });
    const towerData = await db.sequelize.query(query.getTowerData, {
      type: QueryTypes.SELECT,
    });
    const blockData = await db.sequelize.query(query.getBlockData, {
      type: QueryTypes.SELECT,
    });

    if (registrantData[0] !== undefined) {
      res.status(200).json({
        registrant_id: registrant_id,
        first_name: registrantData[0].first_name,
        middle_name: registrantData[0].middle_name,
        last_name: registrantData[0].last_name,
        email_id: registrantData[0].email_id,
        phone_number: registrantData[0].mobile_number,
        registrant_class: registrantClass,
        //registrant_source: registrantSource,
        tower_details: towerData,
        block_details: blockData,
        run_category: runCategory,
      });
    } else {
      res.status(201).status([]);
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

const getRaceCategory = async () => {
  return new Promise(async (resolve, reject) => {
    const data = await db.sequelize.query(query.getRaceCategory, {
      // replacements: [event_id_ref],
      type: QueryTypes.SELECT,
    });

    if (data[0] !== undefined) {
      return resolve(data);
    } else {
      return resolve([]);
    }
  });
};

const getAgeCategory = async () => {
  return new Promise(async (resolve, reject) => {
    const data = await db.sequelize.query(query.getAgeCategory, {
      // replacements: [event_id_ref],
      type: QueryTypes.SELECT,
    });

    return resolve(data);
  });
};

const getRaceTiming = async (event_id) => {
  return new Promise(async (resolve, reject) => {
    const data = await db.sequelize.query(query.raceTiming, {
      replacements: [event_id],
      type: QueryTypes.SELECT,
    });

    if (data[0] !== undefined) {
      return resolve(data);
    } else {
      return resolve([]);
    }
  });
};

const getRegistrantImage = async (event_id_ref) => {
  return new Promise(async (resolve, reject) => {
    const data = await db.sequelize.query(query.getRegistrantImage, {
      replacements: [event_id_ref],
      type: QueryTypes.SELECT,
    });

    return resolve(data);
  });
};

const getRegistrantCount = async (registrant_event_id_ref) => {
  return new Promise(async (resolve, reject) => {
    const data = await db.sequelize.query(query.runnersCount, {
      replacements: [registrant_event_id_ref],
      type: QueryTypes.SELECT,
    });

    return resolve(data);
  });
};

const getregistrantCategoryDetail = async (req, res) => {
  try {
    const regType = "marathon runners";

    // console.log(event_id);

    const eventInfo = await db.sequelize.query(query.getActiveEvetnInfo, {
      type: QueryTypes.SELECT,
    });

    const event_id = eventInfo[0].event_id;

    console.log("\n EVentInfo \n", eventInfo);

    const typeId = await db.sequelize.query(query.registrantTypeId, {
      replacements: [regType],
      type: QueryTypes.SELECT,
    });

    const ageCategory = { age_category: "7-60+" };
    const runCategory = { run_category: "1k,5k,10k" };
    const registType = await db.sequelize.query(query.registrantTypeInfo, {
      replacements: [typeId[0].type_id],
      type: QueryTypes.SELECT,
    });

    console.log("line173: ", registType);

    const registrantType = { ...registType[0], ...runCategory, ...ageCategory };
    console.log("\nRegistrantType \n", registrantType);

    const minPrice = await db.sequelize.query(query.getMinPrice, {
      replacements: [event_id, typeId[0].type_id],
    });
    const raceCategory = await getRaceCategory();
    console.log("\n raceCategory \n", raceCategory);

    const overAllageCategory = await getAgeCategory();
    //console.log("\n ageCategory \n", ageCategory);

    const registrantImage = await getRegistrantImage(event_id);
    console.log("\n image \n", registrantImage);

    const raceTiming = await getRaceTiming(event_id);

    const registrantCount = await getRegistrantCount(event_id);
    console.log("\n registrantCount\n", registrantCount);

    res.status(200).json({
      event_info: eventInfo[0],
      registrant_type: registrantType,
      //min_price :minPrice,
      raceCategory: raceCategory,
      overAllageCategory: overAllageCategory,
      registrant_images: registrantImage,
      race_timing: raceTiming,
      registrant_count: registrantCount[0],
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
};

const addCorpRegistrantInfo = async (req, res) => {
  try {
    const {
      event_id,
      registrant_id,
      runner_first_name,
      runner_last_name,
      runner_dob,
      runner_gender,
      runner_email_id,
      runner_phone_number,
      runner_emergency_contact_name,
      runner_emergency_contact_number,
      runner_address_type,
      addr_villa_number,
      addr_villa_lane_no,
      addr_villa_phase_no,
      addr_tower_no,
      addr_tower_block_no,
      addr_tower_flat_no,
      external_address,
      runner_city,
      runner_state,
      runner_country,
      runner_pincode,
      tshirt_size,
      runner_blood_group,
      run_category_id_ref,
    } = req.body;
    const checkUser = await db.sequelize.query(query.getCorpReg, {
      replacements: [registrant_id],
      type: QueryTypes.SELECT,
    });

    console.log(checkUser);

    if (checkUser[0] !== undefined) {
      const corp_runner = await db.sequelize.query(query.corpRunner, {
        replacements: [registrant_id],
        type: QueryTypes.SELECT,
      });
      if (corp_runner[0] === undefined) {
        const data = await db.sequelize.query(query.addCorpRegistrantInfo, {
          replacements: [
            runner_address_type,
            addr_villa_number,
            addr_villa_lane_no,
            addr_villa_phase_no,
            addr_tower_no,
            addr_tower_block_no,
            addr_tower_flat_no,
            external_address,
            runner_city,
            runner_state,
            runner_country,
            runner_pincode,
            registrant_id,
          ],
          type: QueryTypes.UPDATE,
        });

        if (data[1] === 1) {
          //code commented onn 11-01-2024 , we removed dob from UI so age and age category are hard coded here



          // const cutoff_date = await db.sequelize.query(
          //   "SELECT event_cut_off_date FROM event_info WHERE event_id=?",
          //   { replacements: [event_id], type: QueryTypes.SELECT }
          // );

          // console.log("cutOffDate", cutoff_date);

          // const ageDecimal = Math.abs(
          //   new Date(runner_dob) - new Date(cutoff_date[0].event_cut_off_date)
          // );
          // const millisecond = 1000 * 60 * 60 * 24 * 365;
          // const runner_age = Math.floor(ageDecimal / millisecond);
          // console.log("age: ", runner_age);

          // const ageCategory = await runnerAgeCat(runner_age);

          // console.log("age_category: ", ageCategory);


          let runner_age=  null ;
          let ageCategory =null ;
          //code commented onn 11-01-2024 , we removed dob from UI so age and age category are hard coded here

          const bib_number = await generateBib(run_category_id_ref, event_id);
       let corporate_id = checkUser[0].corporate_sponsor_id_ref;
          let obj = {
            registrant_id,
            runner_first_name,
            runner_last_name,

            runner_dob,
            runner_gender,
            runner_phone_number,
            runner_emergency_contact_name,
            runner_emergency_contact_number,
            runner_city,
            runner_state,
            runner_country,
            runner_pincode,
            tshirt_size,
            runner_blood_group,
            runner_age,
            ageCategory,
            bib_number,
            run_category_id_ref,
            event_id,
            runner_email_id,
            corporate_id
          };
          console.log("line277: ", runner_address_type);
          let count = 0;

          if (runner_address_type === "villa") {
            let runner_address = `villa ${addr_villa_number},lane ${addr_villa_lane_no},phase ${addr_villa_phase_no},${runner_city},${runner_state},${runner_country},${runner_pincode} `;
            const result = await addCorpRunnerInfo(obj, runner_address);
            console.log("line282", result);

            if (result === 1) {
              count++;
              console.log("line284: ", count);
            }
          } else {
            if (runner_address_type == "tower") {
              let runner_address = `${addr_tower_no},${addr_tower_block_no},${addr_tower_flat_no},${runner_city},${runner_state},${runner_country},${runner_pincode} `;
              const result = await addCorpRunnerInfo(obj, runner_address);
              console.log("line290", result);

              if (result === 1) {
                count++;
                console.log("line292: ", count);
              }
            } else {
              if (runner_address_type == "others") {
                let runner_address = `${external_address},${runner_city},${runner_state},${runner_country},${runner_pincode} `;
                const result = await addCorpRunnerInfo(obj, runner_address);
                console.log("line300", result);

                if (result === 1) {
                  count++;
                  console.log("line300: ", count);
                }
              }
            }
          }
          // const result = await addCorpRunnerInfo();
          const corpName = await db.sequelize.query(query.corpName, {
            replacements: [checkUser[0].corporate_sponsor_id_ref],
          });

          let company_name = corpName[0];
          let subject = `Registration confirmation mail`;
          let message = `Hai, ${runner_first_name} you are successfully registered for APR marathon under the company ${company_name[0].corp_company_name} and your BIB No:${bib_number} for the run  categroy ....`;
          console.log("line309:", count);

          if (count === 1) {
            let obj = {
              //from: "laksh0762@gmail.com",
              to: runner_email_id,
              subj: subject,
              msg: message,
            };

            let text = "Announcement from ACT!";
            let html = ` <html>  
          <p>Dear${runner_first_name} ${runner_last_name},</p>
          <p> Thank you for registering for the APR Run scheduled for 10th December 2023. Your registration has been successful under the Corporate registration category.</p>
          <p> The receipt for the payment and registration details are find below links.</p>
          <p> For registration details, please refer https://aprmarathon.org/#/home/masterlist</p>
          <p> For payment details, please refer https://aprmarathon.org/#/home/payment-history.</p>
          <p> Thank you,</p>
          <p> APR Charitable Trust (ACT)</p>
          <p> APR Run team</p></html> `;
            let mailResponse = await mail.mail(obj.to, obj.subj, html);
            console.log("mailResponse", mailResponse);

            if (mailResponse == true) {
              res
                .status(200)
                .json("Runner information added and check your mail");
            } else {
              res.status(201).json("error occured, Please check the data");
            }
          }
        }
      } else {
        res.status(201).json("You are already registered");
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

const bibUniqueness = async (bib_number, eventid) => {
  return new Promise(async (resolve, reject) => {
    let count = 0;
    // const bib_number = await generateBib(typeName,typeid, eventid);

    //   console.log("line 465 bibnumber:", bib_number);
    //  const type_name =typeName;
    //  const type_id= typeid;
    const event_id = eventid;
    const check_unique = await db.sequelize.query(query.checkUnique, {
      replacements: [`${bib_number}`, event_id],
      type: QueryTypes.SELECT,
    });
    console.log("bib already ecxist ", check_unique.length);
    if (check_unique.length === 0) {
      console.log("line 474,test", bib_number);

      return resolve(bib_number);
    } else {
      const bib = Number(check_unique[0].bib_number) + 1;
      console.log("line 473, bib", bib);

      const result = await bibUniqueness(bib, event_id);

      console.log("line 484: result", result);
      if (result) {
        console.log("line 486 testing return");
        return resolve(result);
      }
    }
  });
};

const addCorpRunnerInfo = async (obj, runner_address) => {
  return new Promise(async (resolve, reject) => {
    console.log("line354:", obj.bib_number);

    const bibNumber = await bibUniqueness(obj.bib_number, obj.event_id);
    // let data = await db.sequelize.query(query.addCorpRunnerInfo, {
    //   replacements: [
    //     obj.registrant_id,
    //     obj.runner_dob,
    //     obj.runner_gender,
    //     obj.runner_phone_number,
    //     obj.runner_emergency_contact_name,
    //     obj.runner_emergency_contact_number,
    //     runner_address,
    //     obj.runner_city,
    //     obj.runner_state,
    //     obj.runner_country,
    //     obj.runner_pincode,
    //     obj.tshirt_size,
    //     obj.runner_blood_group,
    //     obj.runner_age,
    //     obj.ageCategory,
    //     bibNumber,
    //     obj.run_category_id_ref,
    //     obj.event_id,
    //     obj.runner_email_id,
    //   ],
    //   type: QueryTypes.UPDATE,
    // });

    let data = await db.sequelize.query(query.addCorpRunnerInfo, {
      replacements: [
        obj.registrant_id,
        obj.runner_first_name,
        obj.runner_last_name,
        
        obj.runner_dob,
        obj.runner_gender,
        obj.runner_email_id,
        obj.runner_phone_number,
        obj.runner_emergency_contact_name,
        obj.runner_emergency_contact_number,
        runner_address,
        obj.runner_city,
        obj.runner_state,
        obj.runner_country,
        obj.runner_pincode,
        obj.tshirt_size,
        obj.runner_blood_group,
        obj.runner_age,
        obj.ageCategory,
        obj.run_category_id_ref,
        obj.event_id,
        bibNumber,
        obj.corporate_id,
      
      ],
      type: QueryTypes.INSERT,
    });
    console.log("line 440", data);
    if (data[1] > 0) {
      return resolve(1);
    } else {
      return reject(0);
    }
  });
};

const runnerAgeCat = async (runner_age) => {
  return new Promise(async (resolve, reject) => {
    // let runner_age_category;
    if (runner_age >= 7 && runner_age <= 12) {
      let age_category = "kids (7-12)";
      const categoryId = await ageCatId(age_category);
      return resolve(categoryId[0].age_type_id);
    } else {
      if (runner_age >= 13 && runner_age <= 18) {
        let runner_age_category = "teens (13-18)";
        const categoryId = await ageCatId(runner_age_category);
        return resolve(categoryId[0].age_type_id);
      } else {
        if (runner_age >= 19 && runner_age <= 45) {
          let runner_age_category = "adults (19-45)";
          const categoryId = await ageCatId(runner_age_category);
          console.log(categoryId);
          return resolve(categoryId[0].age_type_id);
        } else {
          if (runner_age >= 45 && runner_age <= 60) {
            let runner_age_category = "veterans (46-60)";
            const categoryId = await ageCatId(runner_age_category);
            return resolve(categoryId[0].age_type_id);
          } else {
            if (runner_age > 60) {
              let runner_age_category = "seniors (60+)";
              const categoryId = await ageCatId(runner_age_category);
              return resolve(categoryId[0].age_type_id);
            } else {
              return resolve(0);
            }
          }
        }
      }
    }
  });
};

const ageCatId = async (age_type_name) => {
  return new Promise(async (resolve, reject) => {
    const ageId = await db.sequelize.query(query.ageCatId, {
      replacements: [age_type_name],
      type: QueryTypes.SELECT,
    });

    return resolve(ageId);
  });
};

const generateBib = async (run_category_id, event_id) => {
  return new Promise(async (resolve, reject) => {
    //const race_type_id = req.body.race_type_id;
    const result = await db.sequelize.query(query.raceCategory, {
      replacements: [run_category_id],
      type: QueryTypes.SELECT,
    });

    console.log(result[0]);

    let type = result[0].race_type_name;

    if (type === "1k") {
      const count = await db.sequelize.query(query.runnerCountPerRace, {
        replacements: [event_id, run_category_id],
        type: QueryTypes.SELECT,
      });
      console.log(count);
      const generateBib = Number(count[0].max_bib_num) + 1;
      return resolve(generateBib);
    } else {
      if (type === "5k") {
        const count = await db.sequelize.query(query.runnerCountPerRace, {
          replacements: [event_id, run_category_id],
          type: QueryTypes.SELECT,
        });
        const generateBib = Number(count[0].max_bib_num) + 1;
        return resolve(generateBib);
      } else {
        if (type === "10k") {
          const count = await db.sequelize.query(query.runnerCountPerRace, {
            replacements: [event_id, run_category_id],
            type: QueryTypes.SELECT,
          });
          const generateBib = Number(count[0].max_bib_num) + 1;
          return resolve(generateBib);
        }
      }
    }
  });
};

const corpRegHistory = async (req, res) => {
  try {
    const registrant_id = req.params.registrant_id;

    const runnerData = await db.sequelize.query(query.corpRunner, {
      replacements: [registrant_id],
      type: QueryTypes.SELECT,
    });
    if (runnerData[0] !== undefined) {
      const runCat = await db.sequelize.query(query.runCat, {
        replacements: [runnerData[0].run_category_id_ref],
        type: QueryTypes.SELECT,
      });
      let obj = { ...runnerData[0], ...runCat[0] };
      res.status(200).json(obj);
    } else {
      res.status(422).json("no data availabile");
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
  dataForCorpRunnerReg,
  getregistrantCategoryDetail,
  addCorpRegistrantInfo,
  corpRegHistory,
};
