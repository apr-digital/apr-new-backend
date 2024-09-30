const db = require("../config/dbconfig");
const query = require("../models/registration.model");
const { sequelize } = require("sequelize");
const { QueryTypes } = require("sequelize");
const crypt = require("../middlewares/crypt");
var unirest = require("unirest");
const mail = require("../middlewares/mail");
const pushNotif = require("../middlewares/pushnotification");
const { payment } = require("./payment.controller");

const addRegistrantInfo = async (req, res) => {
  try {
    const {
      registrant_id,
      registrant_type_ref,
      address_type,
      address,
      city,
      state,
      country,
      pin_code,
      need_80G_certificate,
      pancard_number,
      registrant_source_ref,
      registrant_class_ref,
      event_id_ref,
      role,
    } = req.body;

    await db.sequelize.query(query.addRegistrantInfo, {
      replacements: [
        registrant_type_ref,
        address_type,
        address,
        city,
        state,
        country,
        pin_code,
        need_80G_certificate,
        pancard_number,
        registrant_source_ref,
        registrant_class_ref,
        event_id_ref,
        role,
        registrant_id,
      ],
      type: QueryTypes.UPDATE,
    });
    res.status(200).json("Registrant information added");
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
};

const getRegistrantDetail = async (req, res) => {
  try {
    const registrant_id = req.params.registrant_id;

    const registrantDetails = await db.sequelize.query(query.getRegistrant, {
      replacements: [registrant_id],
      type: QueryTypes.SELECT,
    });
        if(registrantDetails[0]!==undefined){
    const towerData = await db.sequelize.query(query.getTowerData, {
      type: QueryTypes.SELECT,
    });
    // const blockData = await db.sequelize.query(query.getBlockData, {type:QueryTypes.SELECT});
    const blockData = await blockDetails(towerData);

    res.status(200).json({registrantDetail: registrantDetails[0],
                            towerData:blockData });
    }else{
      res.status(201).json("no data available")
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

const updateRegistrantInfo = async (req, res) => {
  try {
    const {
      registrant_id,
      address_type,
      address,
      city,
      state,
      country,
      pin_code,
      need_80G_certificate,
      pancard_number,
      registrant_source_ref,
      registrant_class_ref,
    } = req.body;

    await db.sequelize.query(query.updateRegistrantInfo, {
      replacements: [
        address_type,
        address,
        city,
        state,
        country,
        pin_code,
        registrant_source_ref,
        registrant_class_ref,
        need_80G_certificate,
        pancard_number,
        registrant_id,
      ],
      type: QueryTypes.UPDATE,
    });

    res.status(400).json("Registrant information updated!");
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
};

const removeRegistrant = async (req, res) => {
  try {
    const registrant_id = req.params.registrant_id;
    const checkUser = await db.sequelize.query(query.getRegistrant, {
      replacements: [registrant_id],
      type: QueryTypes.SELECT,
    });
    if (checkUser[0] !== undefined) {
      await db.sequelize.query(query.removeRegistrsant, {
        replacements: [registrant_id],
        type: QueryTypes.DELETE,
      });

      res.status(200).json("Registrant info deleted");
    } else {
      res.status(201).json("User information does not exist");
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

const addRunners = async (req, res) => {
  try {
    var data = req.body.map((key) => [
      key.registrant_id_ref,
      key.runner_first_name,
      key.runner_last_name,
      key.runner_dob,
      key.runner_gender,
      key.runner_email_id,
      key.runner_phone_number,
      key.runner_emergency_contact_name,
      key.runner_emergency_contact_number,
      key.runner_address_type,
      key.runner_address,
      key.runner_city,
      key.runner_state,
      key.runner_country,
      key.runner_pincode,
      key.tshirt_size,
      key.runner_blood_group,
      key.run_category_id_ref,
      key.registrant_event_id_ref,
    ]);
    console.log(data);
    for (let i = 0; i < data.length; i++) {
      let registrant_id_ref = data[i][0];
      let runner_first_name = data[i][1];
      let runner_last_name = data[i][2];
      let ageCategory = data[i][3];
      let runner_gender = data[i][4];
      let runner_email_id = data[i][5];
      let runner_phone_number = data[i][6];
      let runner_emergency_contact_name = data[i][7];
      let runner_emergency_contact_number = data[i][8];
      let runner_address_type = data[i][9];
      let runner_address = data[i][10];
      let runner_city = data[i][11];
      let runner_state = data[i][12];
      let runner_country = data[i][13];
      let runner_pincode = data[i][14];
      let tshirt_size = data[i][15];
      let runner_blood_group = data[i][16];
      let run_category_id_ref = data[i][17];
      let registrant_event_id_ref = data[i][18];
      //age calculation
      const cutoff_date = await db.sequelize.query(
        "SELECT event_cut_off_date FROM event_info WHERE event_id=?",
        { replacements: [registrant_event_id_ref], type: QueryTypes.SELECT }
      );

      console.log("cutOffDate", cutoff_date);

      // const ageDecimal = Math.abs(
      //   new Date(runner_dob) - new Date(cutoff_date[0].event_cut_off_date)
      // );
      // const millisecond = 1000 * 60 * 60 * 24 * 365;
      // const runner_age = Math.floor(ageDecimal / millisecond);
      // console.log("age: ", runner_age);

      //const ageCategory = await runnerAgeCat(runner_age);

     // console.log("age_category: ", ageCategory);
            let runner_age=null;
      const result = await db.sequelize.query(query.addRunner, {
        replacements: [
          registrant_id_ref,
          runner_first_name,
          runner_last_name,
          //runner_dob,
          ageCategory,
          runner_gender,
          runner_email_id,
          runner_phone_number,
          runner_emergency_contact_name,
          runner_emergency_contact_number,
          runner_address_type,
          runner_address,
          runner_city,
          runner_state,
          runner_country,
          runner_pincode,
          tshirt_size,
          runner_blood_group,
          ageCategory,
           runner_age,
          run_category_id_ref,
          registrant_event_id_ref,
        ],
        type: QueryTypes.INSERT,
      });
    }

    res.status(200).json("Runner info added");
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
};

// const runnerAgeCat = async (runner_age) => {
//   return new Promise(async (resolve, reject) => {
//     // let runner_age_category;
//     if (runner_age >= 7 && runner_age <= 12) {
//       let age_category = "kids (7-12)";
//       const categoryId = await ageCatId(age_category);
//       return resolve(categoryId[0].age_type_id);
//     } else {
//       if (runner_age >= 13 && runner_age <= 18) {
//         let runner_age_category = "teens (13-18)";
//         const categoryId = await ageCatId(runner_age_category);
//         return resolve(categoryId[0].age_type_id);
//       } else {
//         if (runner_age >= 19 && runner_age <= 45) {
//           let runner_age_category = "adults (19-45)";
//           const categoryId = await ageCatId(runner_age_category);
//           console.log(categoryId);
//           return resolve(categoryId[0].age_type_id);
//         } else {
//           if (runner_age >= 45 && runner_age <= 60) {
//             let runner_age_category = "veterans (46-60)";
//             const categoryId = await ageCatId(runner_age_category);
//             return resolve(categoryId[0].age_type_id);
//           } else {
//             if (runner_age > 60) {
//               let runner_age_category = "seniors (60+)";
//               const categoryId = await ageCatId(runner_age_category);
//               return resolve(categoryId[0].age_type_id);
//             } else {
//               let msg =
//                 "He/she is below the age 7, The runner does not fit for marathon";
//               return resolve(msg);
//             }
//           }
//         }
//       }
//     }
//   });
// };

const ageCatId = async (age_type_name) => {
  return new Promise(async (resolve, reject) => {
    const ageId = await db.sequelize.query(query.ageCatId, {
      replacements: [age_type_name],
      type: QueryTypes.SELECT,
    });

    return resolve(ageId);
  });
};

const updateRunnerInfo = async (req, res) => {
  try {
    const {
      runner_first_name,
      runner_last_name,
      runner_dob,
      runner_gender,
      runner_email_id,
      runner_phone_number,
      runner_emergency_contact_name,
      runner_emergency_contact_number,
      runner_address_type,
      runner_address,
      runner_city,
      runner_state,
      runner_country,
      runner_pincode,
      tshirt_size,
      runner_blood_group,
      run_category_id_ref,
      runner_id,
    } = req.body;

    await db.sequelize.query(query.updateRunnerInfo, {
      replacements: [
        runner_first_name,
        runner_last_name,
        runner_dob,
        runner_gender,
        runner_email_id,
        runner_phone_number,
        runner_emergency_contact_name,
        runner_emergency_contact_number,
        runner_address_type,
        runner_address,
        runner_city,
        runner_state,
        runner_country,
        runner_pincode,
        tshirt_size,
        runner_blood_group,
        run_category_id_ref,
        runner_id,
      ],
      type: QueryTypes.UPDATE,
    });
    res.status(200).json("Runner info updated...");
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
};

const removeRunner = async (req, res) => {
  try {
    const runner_id = req.params.runner_id;
    const checkUser = await db.sequelize.query(query.getRunner, {
      replacements: [runner_id],
      type: QueryTypes.SELECT,
    });

    // console.log("Checkuser", checkUser[0]);

    if (checkUser[0] !== undefined) {
      await db.sequelize.query(query.removeRunner, {
        replacements: [runner_id],
        type: QueryTypes.DELETE,
      });

      res.status(200).json("Runner info deleted");
    } else {
      res.status(201).json("User information does not exist");
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

const getRunnerDetail = async (req, res) => {
  try {
    const runner_id = req.params.runner_id;

    const runnerDetails = await db.sequelize.query(query.getRunner, {
      replacements: [runner_id],
      type: QueryTypes.SELECT,
    });

    res.status(200).json(runnerDetails);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
};

const getRegistrantType = async () => {
  return new Promise(async (resolve, reject) => {
    const data = await db.sequelize.query(query.getRegistrantTypes, {
      // replacements: [event_id_ref],
      type: QueryTypes.SELECT,
    });

    return resolve(data);
  });
};

const getRunCategory = async () => {
  return new Promise(async (resolve, reject) => {
    const data = await db.sequelize.query(query.getRaceCategory, {
      // replacements: [event_id_ref],
      type: QueryTypes.SELECT,
    });
    //console.log(data);
    if (data[0] !== undefined) {
      let obj = {
        run_category: `${data[0].race_type_name},${data[1].race_type_name},${data[2].race_type_name}`,
      };

      return resolve(obj);
    } else {
      return resolve([]);
    }
  });
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

const getRegistrantImage = async (event_id_ref) => {
  return new Promise(async (resolve, reject) => {
    const data = await db.sequelize.query(query.getRegistrantImage, {
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

const getMinPrice = async (regType, event_id) => {

  return new Promise(async (resolve, reject) => {
    let result = [];
    let price = [];
    const ageCategory = { age_type: "7-60+" };

    for (let i = 0; i < regType.length; i++) {
      const data = await db.sequelize.query(query.getMinPrice, {
        replacements: [event_id, regType[i].type_id],
        type: QueryTypes.SELECT,
      });

      price.push(data[0]);
    }

    if (regType.length === price.length) {
      regType.forEach((obj) => {
        let matchObj = price.find(
          (obj2) => obj2.registrant_type_id_ref === obj.type_id
        );

        if (matchObj) {
          let merge = { ...obj, ...matchObj, ...ageCategory };
          result.push(merge);
        }
      });
    }

    const runCategory = await getRunCategory();
    let registrantType = [];

    for (let i = 0; i < result.length; i++) {
      if (regType[i].type_name === "donate") {
        registrantType.push(result[i]);
      } else {
        let merge = { ...result[i], ...runCategory };
        registrantType.push(merge);
      }
    }

    if (registrantType.length === regType.length) {
      return resolve(registrantType);
    } else {
      return resolve([]);
    }
  });
};

const getRaceTiming = async (event_id, raceCategory, ageCat) => {
  return new Promise(async (resolve, reject) => {
    //console.log("category", raceCategory);
    let result = [];

    for (let i = 0; i < raceCategory.length; i++) {
      const data = await db.sequelize.query(query.raceTiming, {
        replacements: [event_id, raceCategory[i].race_type_id],
        type: QueryTypes.SELECT,
      });

      ///for (let j=0; j< data.length; j++){
      let data1 = [];
      data.forEach((obj) => {
        let matchObj = ageCat.find(
          (obj1) => obj.age_type_id_ref == obj1.age_type_id
        );
        console.log("test: ", matchObj);
        if (matchObj) {
          let merge = { ...obj, ...matchObj };

          data1.push(merge);
        }
      });

      let type = raceCategory[i].race_type_name;
      let type_name = { race_type_name: type };

      if (raceCategory[i].race_type_name !== "5k") {
        result.push({ ...data1[0], ...type_name });
      } else {
        //let type = {race_type_name:raceCategory[i].race_type_name}
        // console.log("\n line 564: \n", data1);
        let data2 = { timing: data1 };
        result.push({ ...data2, ...type_name });
      }
      // }
    }
    if (raceCategory.length === result.length) {
      return resolve(result);
    } else {
      return resolve([]);
    }
  });
};

const getRegClassPrice = async (eventInfo, registrantType) => {
  return new Promise(async (resolve, reject) => {
    let array1 = [];
    let price = [];

    var date1 = new Date();
    const date = new Date(date1.toISOString().split("T")[0]);
    var date2 = new Date(eventInfo[0].early_bird_cut_off_date);

    // Calculate the time difference in milliseconds
    var timeDiff = date - date2;

    // Convert the time difference to days, hours, minutes, seconds, etc.
    var daysDif = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    // console.log("line 596:", daysDif);

    /************************************* commented early bird price by Ram ********************************************/

    // for (let i = 0; i < registrantType.length; i++) {
    //   if (daysDif <= 0) {
    //     const result = await db.sequelize.query(query.getEarlybirdClassPrice, {
    //       replacements: [eventInfo[0].event_id, registrantType[i].type_id],
    //       type: QueryTypes.SELECT,
    //     });

    //     if (result[0] !== undefined) {
    //       for (let j = 0; j < result.length; j++) {
    //         array1.push(result[j]);
    //       }
    //     }
    //   } else {
    //     const result = await db.sequelize.query(query.getClassPrice, {
    //       replacements: [eventInfo[0].event_id, registrantType[i].type_id],
    //       type: QueryTypes.SELECT,
    //     });

    //     console.log("line621:", result);

    //     if (result[0] !== undefined) {
    //       for (let j = 0; j < result.length; j++) {
    //         array1.push(result[j]);
    //       }
    //     } else {
    //       return resolve(price);
    //     }
    //   }
    // }

    /*********************************************************************************/
    /*********************************** added by Ram ********************************/
    for (let i = 0; i < registrantType.length; i++) {
      const result = await db.sequelize.query(query.getClassPrice, {
        replacements: [eventInfo[0].event_id, registrantType[i].type_id],
        type: QueryTypes.SELECT,
      });

      console.log("line621:", result);

      if (result[0] !== undefined) {
        for (let j = 0; j < result.length; j++) {
          array1.push(result[j]);
        }
      } else {
        return resolve(price);
        }
    }

   /*********************************************************************************/

    for (let k = 0; k < array1.length; k++) {
      let category_id = array1[k].registrant_class_category_id_ref;
      let data = await db.sequelize.query(query.className, {
        replacements: [array1[k].registrant_class_category_id_ref],
        type: QueryTypes.SELECT,
      });

      price.push({ ...array1[k], ...data[0] });

      // console.log("line 621: ", price);
    }

    // } else {
    //   return resolve(price);
    // }

    // console.log("line582:", price);
    return resolve(price);
  });
};

const getRaceTypeForAge = async (ageCategory, raceCategory, event_id) => {
  return new Promise(async (resolve, reject) => {
    let data = [];
    for (let i = 0; i < ageCategory.length; i++) {
      const raceCat = await db.sequelize.query(query.raceForAge, {
        replacements: [ageCategory[i].age_type_id, event_id],
        type: QueryTypes.SELECT,
      });
      let data1 = [];
      raceCat.forEach((obj) => {
        let findobj = raceCategory.find(
          (obj1) => obj.race_type_id_ref == obj1.race_type_id
        );
        if (findobj) {
          let mergeObj = { ...obj, ...findobj };
          data1.push(mergeObj);
        }
      });

      let obj = { data1 };

      let obj1 = { ...ageCategory[i], ...obj };
      data.push(obj1);
    }

    return resolve(data);
  });
};

const getregistrantCategoryDetail = async (req, res) => {
  try {
    //const event_id = req.params.event_id;

    //console.log(event_id);
    const eventInfo = await db.sequelize.query(query.getEventDetail, {
      type: QueryTypes.SELECT,
    });
    // console.log("\n EVentInfo \n", eventInfo);

    const event_id = eventInfo[0]?.event_id;

    if(!event_id){
      return res.status(400).send("No upcoming event");
    }

    const registrantType = await getRegistrantType();
    //console.log("\nRegistrantType \n", registrantType);

    const minPrice = await getMinPrice(registrantType, event_id);
    const raceCategory = await getRaceCategory();
    //console.log("\n raceCategory \n", raceCategory);

    const runCategory = await getRunCategory();
    const overAllageCategory = await getAgeCategory();

    const raceTypeForAge = await getRaceTypeForAge(
      overAllageCategory,
      raceCategory,
      event_id
    );
    //console.log("\n ageCategory \n", ageCategory);
    const ageCategory = "7-60+";

    const registrantImage = await getRegistrantImage(event_id);
    //console.log("\n image \n", registrantImage);

    const raceTiming = await getRaceTiming(
      event_id,
      raceCategory,
      overAllageCategory
    );

    const registrantCount = await getRegistrantCount(event_id);
    //console.log("\n registrantCount\n", registrantCount);

    const classPrice = await getRegClassPrice(eventInfo, registrantType);
    // console.log("classPrice", classPrice);

    return res.status(200).json({
      event_info: eventInfo[0],
      registrant_type: minPrice,
      raceCategory: raceCategory,
      overAllageCategory: overAllageCategory,
      registrant_images: registrantImage,
      race_timing: raceTiming,
      raceTypeForAge: raceTypeForAge,
      class_price: classPrice,
      registrant_count: registrantCount[0],
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
};

const masterList = async (registrant_id, registrant_event_id_ref) => {
  return new Promise(async (resolve, reject) => {
    const masterList = await db.sequelize.query(
      query.getRunnerDetailForMasterList,
      {
        replacements: [registrant_id, registrant_event_id_ref],
        type: QueryTypes.SELECT,
      }
    );

    //console.log("masterlist", masterList);
    const masterlistData = [];

    if (masterList[0] !== undefined) {
      let array = [];
      for (let i = 0; i < masterList.length; i++) {
        let race_type_id = masterList[i].run_category_id_ref;
        const obj = await db.sequelize.query(query.raceCategory, {
          replacements: [race_type_id],
          type: QueryTypes.SELECT,
        });
        array.push(obj[0]);
      }
      // console.log(array);

      masterList.forEach((obj1) => {
        let matchObj = array.find(
          (obj2) => obj2.race_type_id === obj1.run_category_id_ref
        );
        //console.log("match", matchObj);
        if (matchObj) {
          let merge = { ...obj1, ...matchObj };
          masterlistData.push(merge);
        }
      });
      // console.log("masterlistData", masterlistData);
      return resolve(masterlistData);
    }
  });
};

const getMasterList = async (req, res) => {
  try {
    const { registrant_id, event_id } = req.body;

    //let event_id_ref = event_id;
    const registrantData = await db.sequelize.query(query.getRegistrantInfo, {
      replacements: [registrant_id],
      type: QueryTypes.SELECT,
    });

    const type_id = registrantData[0].registrant_type_ref;

    const registrantType = await db.sequelize.query(query.getRegistrantType, {
      replacements: [type_id],
    });
    //console.log("type_id", registrantType[0]);
    let type = registrantType[0];
    const master_list = await masterList(registrant_id, event_id);
    if (
      registrantData[0] !== undefined &&
      registrantType[0] !== undefined &&
      master_list[0] !== undefined
    ) {
      res.status(200).json({
        registrant_id: registrant_id,
        registrant_type: type[0].type_name,
        registrant_type_id: type_id,
        masterList: master_list,
      });
    } else {
      res.status(201).json([]);
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

const getrunnerByRegistrant = async (req, res) => {
  try {
    const registrant_id = req.params.registrant_id;
    const runnerData = await db.sequelize.query(query.runnerByRegistrant, {
      replacements: [registrant_id],
      type: QueryTypes.SELECT,
    });
    res.status(200).json(runnerData);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
};

const getRunnerForRegistrant = async (req, res) => {
  try {
    const { registrant_id, runner_id } = req.body;

    const runnerData = await db.sequelize.query(query.runnerForRegistrant, {
      replacements: [runner_id, registrant_id],
      type: QueryTypes.SELECT,
    });
    res.status(200).json(runnerData);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
};
const mergeArray = async (classInfo, price) => {
  return new Promise((resolve, reject) => {
    let result = [];
    console.log(classInfo);
    classInfo.forEach((obj) => {
      let matchObj = price.find(
        (obj2) => obj2.registrant_class_category_id_ref === obj.category_id
      );
      if (matchObj) {
        let mergeObj = { ...obj, ...matchObj };
        result.push(mergeObj);
      }
    });

    if (classInfo.length === result.length) {
      return resolve(result);
    } else {
      return resolve(result);
    }
  });
};

const getPricedetails = async (req, res) => {
  try {
    const { event_id, type_id } = req.body;

    const classInfo = await db.sequelize.query(query.registrantClassinfo, {
      replacements: [type_id],
      type: QueryTypes.SELECT,
    });
    let price = [];
    for (let i = 0; i < classInfo.length; i++) {
      const priceList = await db.sequelize.query(query.classPrice, {
        replacements: [event_id, type_id, classInfo[i].category_id],
        type: QueryTypes.SELECT,
      });
      price.push(priceList[0]);
    }

    const merge = await mergeArray(classInfo, price);
    res.status(200).json(merge);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
};

// let count = 0;
// const increaseCount = async (req, res, next) => {
//   count++;
//   req.sequenceNumber = count;
//   next();
// };

//generateBib();

const getDataForRegistration = async (req, res) => {
  try {
    const { registrant_type_id, registrant_id } = req.body;

    //console.log("registrant_id:", registrant_id);
    const event = await db.sequelize.query(query.getEventDetail, {
      type: QueryTypes.SELECT,
    });
    let event_id = event[0].event_id;
    let registrantData = []
    //Commented by Rishi on 14-feb
    if(registrant_id != null && registrant_type_id != null){
        registrantData = await db.sequelize.query(query.registrantInfo, {
        replacements: [registrant_id],
        type: QueryTypes.SELECT,
      });
    }
    let registrantClass = []
    if(registrant_id != null && registrant_type_id != null){
        registrantClass = await db.sequelize.query(query.registrantClass, {
        replacements: [registrant_type_id],
        type: QueryTypes.SELECT,
      });
    }
    else{
        registrantClass = await db.sequelize.query(query.registrantClassForAdmin, {
        replacements: [],
        type: QueryTypes.SELECT,
      });
    }

    const getPrice = await getPrices(registrantClass, event_id);

    //Added by Rishi on 14-feb

    let type1 = []
    let type2 = []
    let type3 = []

    for(i=0;i<getPrice.length;i++){
      if(getPrice[i].registrant_type_id_ref == 1){
        type1.push(getPrice[i])
      }
      else if(getPrice[i].registrant_type_id_ref == 2){
        type2.push(getPrice[i])
      }
      else if(getPrice[i].registrant_type_id_ref == 3){
        type3.push(getPrice[i])
      }
    }

    // const registrantSource = await db.sequelize.query(query.registrantSource, {
    //   type: QueryTypes.SELECT,
    // });

    const runCategory = await db.sequelize.query(query.runCategory, {
      type: QueryTypes.SELECT,
    });

    const towerData = await db.sequelize.query(query.getTowerData, {
      type: QueryTypes.SELECT,
    });
    // const blockData = await db.sequelize.query(query.getBlockData, {type:QueryTypes.SELECT});
    const blockData = await blockDetails(towerData);
    if (registrantData[0] !== undefined && registrant_id != null && registrant_type_id != null) {
      res.status(200).json({
        registrant_id: registrant_id,
        first_name: registrantData[0].first_name,
        middle_name: registrantData[0].middle_name,
        last_name: registrantData[0].last_name,
        email_id: registrantData[0].email_id,
        phone_number: registrantData[0].mobile_number,
        registrant_class: getPrice,
        // tower_details:towerData,
        tower_details: blockData,
        // registrant_source: registrantSource,
        run_category: runCategory,
      });
    } 
    else if(registrant_id == null && registrant_type_id == null){
      res.status(200).json({
        registrant_class: {"marathon runners":type1,"donors with runners":type2,"donate":type3},
        // tower_details:towerData,
        tower_details: blockData,
        // registrant_source: registrantSource,
        run_category: runCategory,
      });
    }
    else {
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

const blockDetails = async (towerData) => {
  return new Promise(async (resolve, reject) => {
    let result = [];
    for (let i = 0; i < towerData.length; i++) {
      if (towerData[i].tower_number === "Tower 1") {
        const getBlock = await db.sequelize.query(query.getBlock1, {
          replacements: [],
          type: QueryTypes.SELECT,
        });
        let block = { block: getBlock };
        let obj = { ...towerData[i], ...block };
        result.push(obj);
      } else {
        if (towerData[i].tower_number === "Tower 2") {
          const getBlock = await db.sequelize.query(query.getBlock2, {
            replacements: [],
            type: QueryTypes.SELECT,
          });
          let block = { block: getBlock };
          let obj = { ...towerData[i], ...block };
          result.push(obj);
        } else {
          if (towerData[i].tower_number === "Tower 3") {
            const getBlock = await db.sequelize.query(query.getBlock3, {
              replacements: [],
              type: QueryTypes.SELECT,
            });

            let block = { block: getBlock };
            let obj = { ...towerData[i], ...block };
            result.push(obj);
          } else {
            if (towerData[i].tower_number === "Tower 4") {
              const getBlock = await db.sequelize.query(query.getBlock4, {
                replacements: [],
                type: QueryTypes.SELECT,
              });
              console.log("tower4", getBlock);

              let block = { block: getBlock };
              let obj = { ...towerData[i], ...block };
              result.push(obj);
            } else {
              if (towerData[i].tower_number === "Tower 5") {
                const getBlock = await db.sequelize.query(query.getBlock5, {
                  replacements: [],
                  type: QueryTypes.SELECT,
                });
                let block = { block: getBlock };
                let obj = { ...towerData[i], ...block };
                result.push(obj);
              } else {
                if (towerData[i].tower_number === "Tower 6") {
                  const getBlock = await db.sequelize.query(query.getBlock6, {
                    type: QueryTypes.SELECT,
                  });
                  let block = { block: getBlock };
                  let obj = { ...towerData[i], ...block };
                  result.push(obj);
                } else {
                  if (towerData[i].tower_number === "Tower 7") {
                    const getBlock = await db.sequelize.query(query.getBlock7, {
                      replacements: [],
                      type: QueryTypes.SELECT,
                    });
                    let block = { block: getBlock };
                    let obj = { ...towerData[i], ...block };
                    result.push(obj);
                  }
                }
              }
            }
          }
        }
      }
    }

    return resolve(result);
  });
};

const vaildateAddress = async (villaInfo, villa_number) => {
  return new Promise(async (resolve, reject) => {
    console.log("length:", villaInfo.length);
    let result = [];
    for (let i = 0; i < villaInfo.length; i++) {
      //console.log(Number(villaInfo[i].villa_number_start));
      if (
        villa_number >= Number(villaInfo[i].villa_number_start) &&
        villa_number <= Number(villaInfo[i].villa_number_end)
      ) {
        console.log("test");
        result.push({
          status: true,
          lane_no: villaInfo[i].lane_no,
          phase_no: villaInfo[i].phase_no,
        });
      }
    }
    console.log(result);
    return resolve(result);
  });
};

const verifyAddress = async (req, res) => {
  try {
    const { villa_number } = req.body;

    const getVillaInfo = await db.sequelize.query(query.villaInfo, {
      type: QueryTypes.SELECT,
    });

    const result = await vaildateAddress(getVillaInfo, villa_number);
    if (result[0] == undefined) {
      res
        .status(201)
        .json("villa number doesn't exist in APR, please check your data");
    } else {
      if (result[0].status === true) {
        //console.log(result);
        res.status(200).json(result[0]);
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

const getPrices = async (registrantClass, event_id) => {
  return new Promise(async (resolve, reject) => {
    let array = [];
    for (let i = 0; i < registrantClass.length; i++) {
      const result = await db.sequelize.query(query.getPrice, {
        replacements: [event_id, registrantClass[i].category_id],
      });
      let price = result[0];
      let obj = { ...registrantClass[i], ...price[0] };

      array.push(obj);
    }
    //console.log(array);
    return resolve(array);
  });
};

const addRegistrantInfoWeb = async (req, res) => {
  try {
    const { registrant_detail, runner_details } = req.body;
    let data = registrant_detail;

    const event_id = await db.sequelize.query(query.getActiveEventId, { type:QueryTypes.SELECT });
    console.log(event_id);
    
    const class_id = data.registrant_class_ref;
    
    const regClass = await db.sequelize.query(query.getRegClass, {replacements:[class_id], type:QueryTypes.SELECT});
     
    const catAmount = await db.sequelize.query(query.getPrice, {replacements:[data.event_id_ref, class_id], type:QueryTypes.SELECT});
    
    const  amount = catAmount[0]?.category_price;
    const registrantCreation = await db.sequelize.query(query.addRegistrant, {
      replacements: [
        //data.registrant_type_ref,
        data.resident_of_apr,
        data.address_type,
        data.addr_villa_number,
        data.addr_villa_lane_no,
        data.addr_villa_phase_no,
        data.addr_tower_no,
        data.addr_tower_block_no,
        data.addr_tower_flat_no,
        data.external_address,
        data.city,
        data.state,
        data.country,
        data.pin_code,
        // data.need_80G_certificate,
        data.pancard_number,
        data.emergency_contact_name,
        data.emergency_contact_number,
        //data.event_id_ref,
        data.role,
        data.registrant_id,
      ],
      type: QueryTypes.UPDATE,
    });
    let value = runner_details;
    let runner_count = runner_details.length;
    let count = 0;
    if (registrantCreation[1] === 1) {
      // const genBookingId = await db.sequelize.query(query.bookingCount, {
      //   replacements: [data.event_id_ref],
      //   type: QueryTypes.SELECT,
      // });

      // const bookingId = "10" + (Number(genBookingId[0].booking_count) + 1);

      // const bookingInfo = await db.sequelize.query(query.getBookingid,{
      //   replacements: [
      //     data.registrant_id,
      //     data.event_id_ref,
      //     data.registrant_type_ref,
      //   ],
      //     type: QueryTypes.SELECT,
      //   }
      // );
// console.log("booking: ", bookingInfo.rows);

//       if(bookingInfo?.length > 0){
//         return res.status(400).send("You have already registered for the current event on this run category");
//       }

      const insertIntobooking = await db.sequelize.query(query.insertIntobooking,{
          replacements: [
            data.registrant_type_ref,
            data.registrant_class_ref,
            data.need_80G_certificate,
            data.event_id_ref,
            data.registrant_id,
            runner_count,
            // bookingId,
          ],
          type: QueryTypes.INSERT,
        }
      );
      
      if (insertIntobooking[1] === 1) {

        const [ getBookingInfo ] = await db.sequelize.query(query.getBookingid,{
          replacements: [
            data.registrant_id,
            data.event_id_ref,
            data.registrant_type_ref,
          ],
            type: QueryTypes.SELECT,
          }
        );

        if (value.length == 0) {
          if(regClass[0].category_name === 'other amount'){
            res
              .status(200)
              .json({
                msg: "registrant and runner info added successfully",
                registrant_id: data.registrant_id,
                registrant_class_ref: data.registrant_class_ref,
                booking_id_ref: getBookingInfo?.booking_id,
                event_id_ref: data.event_id_ref,
                runner_count: runner_count,
                total_amount : data.donate_other_amount,
              });
            }else{
              res
              .status(200)
              .json({
                msg: "registrant and runner info added successfully",
                registrant_id: data.registrant_id,
                registrant_class_ref: data.registrant_class_ref,
                booking_id_ref: getBookingInfo?.booking_id,
                event_id_ref: data.event_id_ref,
                runner_count: runner_count,
                total_amount: amount
            })
          }



        
        } else {
          for (let i = 0; i < value.length; i++) {
            let detail = {
              ...value[i],
              address_type: data.address_type,
              addr_villa_number: data.addr_villa_number,
              addr_villa_lane_no: data.addr_villa_lane_no,
              addr_villa_phase_no: data.addr_villa_phase_no,
              addr_tower_no: data.addr_tower_no,
              addr_tower_block_no: data.addr_tower_block_no,
              addr_tower_flat_no: data.addr_tower_flat_no,
              external_address: data.external_address,
              city: data.city,
              state: data.state,
              country: data.country,
              pin_code: data.pin_code,
            };

            //code commented onn 11-01-2024 , we removed dob from UI so age and age category are hard coded here


            // const cutoff_date = await db.sequelize.query(
            //   query.cutOffDate,

            //   {
            //     replacements: [detail.registrant_event_id_ref],
            //     type: QueryTypes.SELECT,
            //   }
            // );

            // const ageDecimal = Math.abs(
            //   new Date(detail.runner_dob) -
            //     new Date(cutoff_date[0].event_cut_off_date)
            // );
            // const millisecond = 1000 * 60 * 60 * 24 * 365;
            // const runner_age = Math.floor(ageDecimal / millisecond);

            // const ageCategory = await runnerAgeCat(runner_age);

        //  let runner_age=  null ;
        //  let ageCategory =null;
         //code commented onn 11-01-2024 , we removed dob from UI so age and age category are hard coded here
            if (data.address_type == "villa") {
              let runner_address = ` ${data.addr_villa_number},${data.addr_villa_lane_no}, ${data.addr_villa_phase_no},${data.city},${data.state},${data.country},${data.pin_code} `;
              const result = await addRunner(
                detail,
                runner_address,
               // runner_age,
               // ageCategory,
                getBookingInfo?.booking_id
              );
              if (result === 1) {
                count++;
              }
            } else {
              if (data.address_type == "tower") {
                let runner_address = `${data.addr_tower_no},${data.addr_tower_block_no},${data.addr_tower_flat_no},${data.city},${data.state},${data.country},${data.pin_code} `;
                const result = await addRunner(
                  detail,
                  runner_address,
                 // runner_age,
                  //ageCategory,
                  getBookingInfo?.booking_id
                );
                if (result === 1) {
                  count++;
                }
              } else {
                if (data.address_type == "others") {
                  let runner_address = `${data.external_address},${data.city},${data.state},${data.country},${data.pin_code} `;
                  const result = await addRunner(
                    detail,
                    runner_address,
                    //runner_age,
                    //ageCategory,
                    getBookingInfo?.booking_id
                  );
                  if (result === 1) {
                    count++;
                  }
                }
              }
            }
          }
          if (value.length === count) {


           
            if(regClass[0].category_name == 'other amount'){
            res
              .status(200)
              .json({
                msg: "registrant and runner info added successfully",
                registrant_id: data.registrant_id,
                registrant_class_ref: data.registrant_class_ref,
                booking_id_ref: getBookingInfo?.booking_id,
                event_id_ref: data.event_id_ref,
                runner_count: runner_count,
                total_amount : data.donate_other_amount,
              });
            }else{
              res
              .status(200)
              .json({
                msg: "registrant and runner info added successfully",
                registrant_id: data.registrant_id,
                registrant_class_ref: data.registrant_class_ref,
                booking_id_ref: getBookingInfo?.booking_id,
                event_id_ref: data.event_id_ref,
                runner_count: runner_count,
                total_amount:amount
            })
          }
        }
      }
      } else {
        res.status(201).json("error occured, please check the details");
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

const addRunner = async (detail, address,  bookingId) => {
  return new Promise(async (resolve, reject) => {
      let value= [
        detail.registrant_id_ref,
        detail.runner_first_name,
        detail.runner_last_name,
        detail.runner_age_category,  // here we receive age category from the name og dob and store in db as runner_age_category
        detail.runner_gender,
        detail.runner_email_id,
        detail.runner_phone_number,
       // detail.runner_emergency_contact_name,
       // detail.runner_emergency_contact_number,
        detail.address_type,
        detail.addr_villa_number,
        detail.addr_villa_lane_no,
        detail.addr_villa_phase_no,
        detail.addr_tower_no,
        detail.addr_tower_block_no,
        detail.addr_tower_flat_no,
        detail.external_address,
        detail.city,
        detail.state,
        detail.country,
        detail.pin_code,
        address,
        detail.tshirt_size,
        //detail.runner_blood_group,
        // age,
        // age_category,
        detail.run_category_id_ref, 
        detail.registrant_event_id_ref,
        bookingId,
      ]
      console.log("value:", value);
      
    const result = await db.sequelize.query(query.runnerInsertion, {
      replacements: [
        detail.registrant_id_ref,
        detail.runner_first_name,
        detail.runner_last_name,
        detail.runner_age_category,  // here we receive age category from the name og dob and store in db as runner_age_category
        detail.runner_gender,
        detail.runner_email_id,
        detail.runner_phone_number,
       // detail.runner_emergency_contact_name,
       // detail.runner_emergency_contact_number,
        detail.address_type,
        detail.addr_villa_number,
        detail.addr_villa_lane_no,
        detail.addr_villa_phase_no,
        detail.addr_tower_no,
        detail.addr_tower_block_no,
        detail.addr_tower_flat_no,
        detail.external_address,
        detail.city,
        detail.state,
        detail.country,
        detail.pin_code,
        address,
        detail.tshirt_size,
        //detail.runner_blood_group,
        // age,
        // age_category,
        detail.run_category_id_ref, 
        detail.registrant_event_id_ref,
        bookingId,
      ],
      type: QueryTypes.INSERT,
    });
    if (result[1] == 1) {
      return resolve(1);
    } else {
      return reject(error);
    }
  });
};

const addRegistrantInfoAdminWeb = async (req, res) => {
  try {
    const { registrant_detail, runner_details } = req.body;
   // console.log("registrant_detail: ",registrant_detail);
    let data = registrant_detail;

   const checkNewRegistrantDetails = await db.sequelize.query(query.getOldRegistrantID, {replacements:[
      data.email_id,
      data.mobile_number,
    ], type: QueryTypes.SELECT});

    console.log(checkNewRegistrantDetails)

    if(checkNewRegistrantDetails[0] == undefined){
      const event_id = await db.sequelize.query(query.getActiveEventId, { type:QueryTypes.SELECT });
      console.log(event_id)
      const class_id = data.registrant_class_ref;
      const regClass = await db.sequelize.query(query.getRegClass, {replacements:[class_id], type:QueryTypes.SELECT});
      
      const catAmount = await db.sequelize.query(query.getPrice, {replacements:[event_id[0].event_id,class_id], type:QueryTypes.SELECT});
      const  amount = catAmount[0]?.category_price;
      const registrantCreation = await db.sequelize.query(query.addNewRegistrant, {
        replacements: [
          //data.registrant_type_ref,
          data.first_name,
          data.middle_name,
          data.last_name,
          data.email_id,
          data.mobile_number,
          data.resident_of_apr,
          data.address_type,
          data.addr_villa_number,
          //data.address,
          data.addr_villa_lane_no,
          data.addr_villa_phase_no,
          data.addr_tower_no,
          data.addr_tower_block_no,
          data.addr_tower_flat_no,
          data.external_address,
          data.city,
          data.state,
          data.country,
          data.pin_code,
          // data.need_80G_certificate,
          data.pancard_number,
          data.emergency_contact_name,
          data.emergency_contact_number,
          //data.event_id_ref,
          data.role,
          //data.registrant_id,
        ],
        type: QueryTypes.INSERT,
      });

    const  addedRegistranID = await db.sequelize.query(query.getAddedRegistrantID, {replacements:[
        data.first_name,
        data.last_name,
        data.email_id,
        data.mobile_number,
      ], type: QueryTypes.SELECT});

      console.log(addedRegistranID)

      let value = runner_details;
      let runner_count = runner_details.length;
      let count = 0;
      if (registrantCreation[1] === 1) {

        // const genBookingId = await db.sequelize.query(query.bookingCount, {
        //   replacements: [event_id[0].event_id],
        //   type: QueryTypes.SELECT,
        // });
        // console.log("BookingCountDone:",genBookingId[0].booking_count);
        // const bookingId = `${event_id[0].event_id}10` + (Number(genBookingId[0].booking_count) + 1);

        // const insertIntobooking = await db.sequelize.query(
        //   query.insertIntobooking,
        //   {
        //     replacements: [
        //       data.registrant_type_ref,
        //       data.registrant_class_ref,
        //       data.need_80G_certificate,
        //       event_id[0].event_id,
        //       addedRegistranID[0].registrant_id,
        //       runner_count,
        //       bookingId,
        //     ],
        //     type: QueryTypes.INSERT,
        //   }
        // );

        /**************************************************************************************************************/
        // const bookingInfo = await db.sequelize.query(query.getBookingid,{
        //   replacements: [
        //     addedRegistranID[0].registrant_id,
        //     data.event_id_ref,
        //     data.registrant_type_ref,
        //   ],
        //     type: QueryTypes.SELECT,
        //   }
        // );
  
        // if(bookingInfo?.length > 0){
        //   return res.status(400).send("You have already registered for the current event on this run category");
        // }
  
        const insertIntobooking = await db.sequelize.query(query.insertIntobooking,{
            replacements: [
              data.registrant_type_ref,
              data.registrant_class_ref,
              data.need_80G_certificate,
              data.event_id_ref,
              addedRegistranID[0].registrant_id,
              runner_count,
              // bookingId,
            ],
            type: QueryTypes.INSERT,
          }
        );

        /**************************************************************************************************************/

        if (insertIntobooking[1] === 1) {

          const [ getBookingInfo ] = await db.sequelize.query(query.getBookingid,{
            replacements: [
              addedRegistranID[0].registrant_id,
              data.event_id_ref,
              data.registrant_type_ref,
            ],
              type: QueryTypes.SELECT,
            }
          );

          if (value.length == 0) {
            if(regClass[0].category_name == 'other amount'){
              res
                .status(200)
                .json({
                  msg: "registrant and runner info added successfully",
                  registrant_id: addedRegistranID[0].registrant_id,
                  registrant_class_ref: data.registrant_class_ref,
                  booking_id_ref: getBookingInfo?.booking_id,
                  event_id_ref: event_id[0].event_id,
                  runner_count: runner_count,
                  total_amount : data.donate_other_amount,
                });
              }else{
                res
                .status(200)
                .json({
                  msg: "registrant and runner info added successfully",
                  registrant_id: addedRegistranID[0].registrant_id,
                  registrant_class_ref: data.registrant_class_ref,
                  booking_id_ref: getBookingInfo?.booking_id,
                  event_id_ref: event_id[0].event_id,
                  runner_count: runner_count,
                  total_amount:amount
              })
            }



          
          } else {
            for (let i = 0; i < value.length; i++) {
              let detail = {
                ...value[i],
                address_type: data.address_type,
                addr_villa_number: data.addr_villa_number,
                addr_villa_lane_no: data.addr_villa_lane_no,
                addr_villa_phase_no: data.addr_villa_phase_no,
                addr_tower_no: data.addr_tower_no,
                addr_tower_block_no: data.addr_tower_block_no,
                addr_tower_flat_no: data.addr_tower_flat_no,
                external_address: data.external_address,
                city: data.city,
                state: data.state,
                country: data.country,
                pin_code: data.pin_code,
              };

              //code commented onn 11-01-2024 , we removed dob from UI so age and age category are hard coded here


              // const cutoff_date = await db.sequelize.query(
              //   query.cutOffDate,

              //   {
              //     replacements: [event_id[0].event_id],
              //     type: QueryTypes.SELECT,
              //   }
              // );

              // console.log("cutOffDate", cutoff_date);

              // const ageDecimal = Math.abs(
              //   new Date(detail.runner_dob) -
              //     new Date(cutoff_date[0].event_cut_off_date)
              // );
              // const millisecond = 1000 * 60 * 60 * 24 * 365;
              // const runner_age = Math.floor(ageDecimal / millisecond);
              // console.log("age: ", runner_age);

              // const ageCategory = await runnerAgeCat(runner_age);

              // console.log("age_category: ", ageCategory);
        
              if (data.address_type == "villa") {
                let runner_address = ` ${data.addr_villa_number},${data.addr_villa_lane_no}, ${data.addr_villa_phase_no},${data.city},${data.state},${data.country},${data.pin_code} `;
                const result = await addNewRunner(
                  addedRegistranID[0].registrant_id,
                  event_id[0].event_id,
                  detail,
                  runner_address,
                 // runner_age,
                  //ageCategory,
                  getBookingInfo?.booking_id
                );
                if (result === 1) {
                  count++;
                }
              } else {
                if (data.address_type == "tower") {
                  let runner_address = `${data.addr_tower_no},${data.addr_tower_block_no},${data.addr_tower_flat_no},${data.city},${data.state},${data.country},${data.pin_code} `;
                  const result = await addNewRunner(
                    addedRegistranID[0].registrant_id,
                    event_id[0].event_id,
                    detail,
                    runner_address,
                    // runner_age,
                    // ageCategory,
                    getBookingInfo?.booking_id
                  );
                  if (result === 1) {
                    count++;
                  }
                } else {
                  if (data.address_type == "others") {
                    let runner_address = `${data.external_address},${data.city},${data.state},${data.country},${data.pin_code} `;
                    const result = await addNewRunner(
                      addedRegistranID[0].registrant_id,
                      event_id[0].event_id,
                      detail,
                      runner_address,
                      // runner_age,
                      // ageCategory,
                      getBookingInfo?.booking_id
                    );
                    if (result === 1) {
                      count++;
                    }
                  }
                }
              }
            }
            if (value.length === count) {


            
              if(regClass[0].category_name == 'other amount'){
              res
                .status(200)
                .json({
                  msg: "registrant and runner info added successfully",
                  registrant_id: addedRegistranID[0].registrant_id,
                  registrant_class_ref: data.registrant_class_ref,
                  booking_id_ref: getBookingInfo?.booking_id,
                  event_id_ref: event_id[0].event_id,
                  runner_count: runner_count,
                  total_amount : data.donate_other_amount,
                });
              }else{
                res
                .status(200)
                .json({
                  msg: "registrant and runner info added successfully",
                  registrant_id: addedRegistranID[0].registrant_id,
                  registrant_class_ref: data.registrant_class_ref,
                  booking_id_ref: getBookingInfo?.booking_id,
                  event_id_ref: event_id[0].event_id,
                  runner_count: runner_count,
                  total_amount:amount
              })
            }
          }
        }
        } else {
          res.status(400).json("error occured, please check the details");
        }
      }
    }
    else{
      res.status(400).json("Registrant already exist")
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

const addNewRunner = async (registranr_id, event_id, detail, address,  bookingId) => {
  return new Promise(async (resolve, reject) => {  
    const result = await db.sequelize.query(query.runnerInsertion, {
      replacements: [
        registranr_id,
        detail.runner_first_name,
        detail.runner_last_name,
        detail.runner_age_category,
        detail.runner_gender,
        detail.runner_email_id,
        detail.runner_phone_number,
        // detail.runner_emergency_contact_name,
        // detail.runner_emergency_contact_number,
        detail.address_type,
        detail.addr_villa_number,
        detail.addr_villa_lane_no,
        detail.addr_villa_phase_no,
        detail.addr_tower_no,
        detail.addr_tower_block_no,
        detail.addr_tower_flat_no,
        detail.external_address,
        detail.city,
        detail.state,
        detail.country,
        detail.pin_code,
        address,
        detail.tshirt_size,
        detail.run_category_id_ref,
        event_id,
        bookingId,
      ],
      type: QueryTypes.INSERT,
    });
    if (result[1] == 1) {
      return resolve(1);
    } else {
      return reject(error);
    }
  });
};

const createOrder = async (req, res) => {
  try {
    const {
      registrant_id,
      registrant_class_ref,
      booking_id_ref,
      event_id_ref,
      runner_count,
      total_amount,
    } = req.body;

    const regClass = await db.sequelize.query(query.getRegClass, {
      replacements: [registrant_class_ref],
      type: QueryTypes.SELECT,
    });
     
    const regType = await db.sequelize.query(query.regType, {
      replacements: [regClass[0].registrant_type_id_ref],
      type: QueryTypes.SELECT,
    });
    
    const orderStatus = await db.sequelize.query(query.getOrderStatus, {
      replacements: [booking_id_ref],
      type: QueryTypes.SELECT,
    });


    const billingAddress = await db.sequelize.query(query.registrantData, {
      replacements: [registrant_id],
      type: QueryTypes.SELECT,
    });

    if (orderStatus[0] === undefined) {
      const orderCount = await db.sequelize.query(query.orderCount, {
        type: QueryTypes.SELECT,
      });

      const orderId = "ACT0001" + orderCount[0].count;

      //const runner_count = runner_details.length;
      console.log("orderid: ", orderId);

      const amount = await db.sequelize.query(query.getPrice, {
        replacements: [event_id_ref, registrant_class_ref],
        type: QueryTypes.SELECT,
      });
 
   
      console.log("billingAddress:  ", billingAddress);
console.log(billingAddress[0].address_type);
      if (billingAddress[0].address_type == "villa") {
        console.log("test1");
        const address = await db.sequelize.query(query.villaAddress, {
          replacements: [billingAddress[0].registrant_id],
          type: QueryTypes.SELECT,
        });

        const createOrder = await db.sequelize.query(query.createOrder, {
          replacements: [
            orderId,
            registrant_class_ref,
            registrant_id,
            event_id_ref,
            booking_id_ref,
            "payment initiated",
            runner_count,
            total_amount,
            address[0].address,
          ],
          type: QueryTypes.INSERT,
        });
        if (createOrder[1] === 1) {
          let obj = {
            order_id: orderId,
            registrant_id: registrant_id,
            registrant_class: regClass[0].category_name,
            amount: total_amount,
            first_name: billingAddress[0].first_name,
                middle_name:billingAddress[0].middle_name,
                last_name:billingAddress[0].last_name,
                mobile_number:billingAddress[0].mobile_number,
                registrant_type: regType[0].type_name
          
          };
          res.status(200).json({
            msg: "order Created successfully ",
            order_details: obj,
            billing_address: address[0].address,
          });
        } else {
          res.status(201).json("something went wrong");
        }
      } else {
        if (billingAddress[0].address_type == "tower") {
          console.log("test2");
          const address = await db.sequelize.query(query.towerAddress, {
            replacements: [billingAddress[0].registrant_id],
            type: QueryTypes.SELECT,
          });

          const createOrder = await db.sequelize.query(query.createOrder, {
            replacements: [
              orderId,
              registrant_class_ref,
              registrant_id,
              event_id_ref,
              booking_id_ref,
              "payment initiated",
              runner_count,
              total_amount,
              address[0].address,
            ],
            type: QueryTypes.INSERT,
          });
          if (createOrder[1] === 1) {
            let obj = {
              order_id: orderId,
              registrant_id: registrant_id,
              registrant_class: regClass[0].category_name,
              amount: total_amount,
              first_name: billingAddress[0].first_name,
                middle_name:billingAddress[0].middle_name,
                last_name:billingAddress[0].last_name,
                mobile_number:billingAddress[0].mobile_number,
                registrant_type: regType[0].type_name
            };
            res.status(200).json({
              msg: "order Created successfully ",
              order_details: obj,
              billing_address: address[0].address,
            });
          } else {
            res.status(201).json("something went wrong");
          }
        } else {
          if (billingAddress[0].address_type == "others") {
            console.log("test2");
            const address = await db.sequelize.query(query.otherAddress, {
              replacements: [billingAddress[0].registrant_id],
              type: QueryTypes.SELECT,
            });

            const createOrder = await db.sequelize.query(query.createOrder, {
              replacements: [
                orderId,
                registrant_class_ref,
                registrant_id,
                event_id_ref,
                booking_id_ref,
                "payment initiated",
                runner_count,
                total_amount,
                address[0].address,
              ],
              type: QueryTypes.INSERT,
            });
            if (createOrder[1] === 1) {
              let obj = {
                order_id: orderId,
                registrant_id: registrant_id,
                registrant_class: regClass[0].category_name,
                amount: total_amount,
                first_name: billingAddress[0].first_name,
                middle_name:billingAddress[0].middle_name,
                last_name:billingAddress[0].last_name,
                mobile_number:billingAddress[0].mobile_number,
                registrant_type: regType[0].type_name
              };
              res.status(200).json({
                msg: "order Created successfully ",
                order_details: obj,
                billing_address: address[0].address,
              });
            } else {
              res.status(201).json("something went wrong");
            }
          }
        }
      }
    } else {
      // if (orderStatus[0].order_status == "success") {
      //   res.status(201).json("No pending order");
      // } else {
        let obj = {
          order_id: orderStatus[0].order_id,
          registrant_id: registrant_id,
          registrant_class: regClass[0].category_name,
          amount: orderStatus[0].total_amount,
          first_name: billingAddress[0].first_name,
          middle_name:billingAddress[0].middle_name,
          last_name:billingAddress[0].last_name,
          mobile_number:billingAddress[0].mobile_number,
           registrant_type: regType[0].type_name
        };

        res.status(200).json({
          msg: "order Created successfully ",
          order_details: obj,
          billing_address: orderStatus[0].billing_address,
        });
      
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

const masterListApp = async (req, res) => {
  try {
    const { registrant_id, event_id, registrant_type_id } = req.body;
    let result = [];
    let data = [];
    const getBookingId = await db.sequelize.query(query.getBookingid, {
      replacements: [registrant_id, event_id, registrant_type_id],
      type: QueryTypes.SELECT,
    });

    for (let i = 0; i < getBookingId.length; i++) {
      const runnerInfo = await db.sequelize.query(query.runnerByBookingId, {
        replacements: [getBookingId[i].booking_id],
        type: QueryTypes.SELECT,
      });
      const getRegClass = await db.sequelize.query(query.getRegClass, {
        replacements: [getBookingId[i].registrant_class_ref],
        type: QueryTypes.SELECT,
      });
      //let category =getRegClass[0].category_name

      let obj = {
        runnerInfo,
        registrant_class: getRegClass[0].category_name,
        registrant_class_id: getBookingId[i].registrant_class_ref,
        booking_id: getBookingId[i].booking_id,
      };
      result.push(obj);
    }
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
};

const runnersList = async (bookingId) => {
  return new Promise(async (resolve, reject) => {
    let result=[];
    const runners = await db.sequelize.query(query.runnerByBookingId, {
      replacements: [bookingId[0].booking_id],
      type: QueryTypes.SELECT,
    });
     
    if(runners.length >0){
    for(let i=0; i < runners.length; i++){
      
      const runCat = await db.sequelize.query(query.runCat, {replacements:[runners[i].run_category_id_ref], type:QueryTypes.SELECT});

      let obj={...runners[i], ...runCat[0]};

      result.push(obj);
     
    }

    return resolve(result)
  }else{

    return resolve(runners);
  }
  });
};

const mySchedule = async (req, res) => {
  try {
    const registrant_id = req.params.registrant_id;

    const getOrderStatus = await db.sequelize.query(query.orderStatus, {
      replacements: [registrant_id],
      type: QueryTypes.SELECT,
    });

    // if(getOrderStatus[0]!==undefined){
    const registrantInfo = await db.sequelize.query(query.registrantData, {
      replacements: [registrant_id],
      type: QueryTypes.SELECT,
    });

    let data = [];
    if (getOrderStatus[0] !== undefined) {

      for (let i = 0; i < getOrderStatus.length; i++) {

        const getBookingId = await db.sequelize.query(query.bookingId, {
          replacements: [getOrderStatus[i].booking_id_ref],
          type: QueryTypes.SELECT,
        });
       
        const paymentDate = await db.sequelize.query(query.paymentDate, {replacements:[getOrderStatus[i].order_id], type:QueryTypes.SELECT});
      
          console.log("line 1613: ", paymentDate);

        const getRunners = await runnersList(getBookingId);
       // console.log("booking id: ", getBookingId);
        const regType = await db.sequelize.query(query.getRegistrantType, {
          replacements: [getBookingId[0].registrant_type_ref],
          type: QueryTypes.SELECT,
        });

        const eventDate = await db.sequelize.query(query.getEventDetail, {
         // replacements: [getBookingId[0].event_id_ref],
          type: QueryTypes.SELECT,
        });

        if(!eventDate[0]?.event_date){
          return res.status(400).send("No registration details found since there is no ongoing event")
        }

        const registrantClass = await db.sequelize.query(query.className, {
          replacements: [getBookingId[0].registrant_class_ref],
          type: QueryTypes.SELECT,
        });

        if (registrantClass[0].category_name !== "donate") {

          let obj = {
            type_name: regType[0].type_name,
            event_date: eventDate[0].event_date,
            event_time: eventDate[0].event_time,
            category_name: registrantClass[0].category_name,
            run_category: "1k,5k,10k",
            order_id_ref:getOrderStatus[i].order_id,
            booking_id: getOrderStatus[i].booking_id_ref,
            payment_date : paymentDate[0].payment_date,
            payment_amount:paymentDate[0].payment_amount,
            merchant_transaction_id: paymentDate[0].merchant_transaction_id,
            provider_reference_id:paymentDate[0].provider_reference_id,
            runners: getRunners,
          };
          data.push(obj);
        } else {

          let obj = {
            registrant_type: regType[0].type_name,
            event_date: eventDate[0].event_date,
            event_time: eventDate[0].event_time,
            registrant_class: registrantClass[0].category_name,
            order_id:getOrderStatus[i].order_id,
            booking_id: getOrderStatus[i].booking_id_ref,
            payment_date : paymentDate[0].payment_date,
            runners: getRunners,
          };
          data.push(obj);
        }
      }

      return res
        .status(200)
        .json({ registerant_info: registrantInfo[0], runnerInfo: data });

    } else {
      return res.status(200).json([]);
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
};

const editUserProfile = async (req, res) => {
  try {
    const {
      registrant_id,
      first_name,
      middle_name,
      last_name,
      email_id,
      mobile_number,
    //  password,
      resident_of_apr,
      address_type,
      addr_villa_number,
      addr_villa_lane_no,
      addr_villa_phase_no,
      addr_tower_no,
      addr_tower_block_no,
      addr_tower_flat_no,
      external_address,
      city,
      state,
      country,
      pin_code,
      registrant_profile_image,
    } = req.body;

    const checkUser = await db.sequelize.query(query.checkUser, {
      replacements: [registrant_id],
      type: QueryTypes.SELECT,
    });

    

   // const hashedPassword = await crypt.encrypt(password);
    if (checkUser[0] !== undefined) {
    //  if(password !==null){
      // console.log(checkUser[0].mobile_number);
      // console.log(mobile_number);
      // console.log("line1722: ",mobile_number == checkUser[0].mobile_number);
      if (mobile_number == checkUser[0].mobile_number) {
        const editUser = await db.sequelize.query(query.editUser, {
          replacements: [
            first_name,
            middle_name,
            last_name,
            email_id,
            mobile_number,
          //  hashedPassword,
            resident_of_apr,
            address_type,
            addr_villa_number,
            addr_villa_lane_no,
            addr_villa_phase_no,
            addr_tower_no,
            addr_tower_block_no,
            addr_tower_flat_no,
            external_address,
            city,
            state,
            country,
            pin_code,
            registrant_profile_image,
            registrant_id,
          ],
          type: QueryTypes.UPDATE,
        });
        if (editUser[1] === 1) {
          res.status(200).json("User profile information updated");
        }
      } else {
        const editUser = await db.sequelize.query(query.editUser, {
          replacements: [
            first_name,
            middle_name,
            last_name,
            email_id,
            mobile_number,
           // hashedPassword,
            resident_of_apr,
            address_type,
            addr_villa_number,
            addr_villa_lane_no,
            addr_villa_phase_no,
            addr_tower_no,
            addr_tower_block_no,
            addr_tower_flat_no,
            external_address,
            city,
            state,
            country,
            pin_code,
            registrant_profile_image,
            registrant_id,
          ],
          type: QueryTypes.UPDATE,
        });
        if (editUser[1] === 1) {
          //generate otp
          const otp = await generateOTP();

          // Save OTP to the database
          await saveOTPToDatabase(email_id, mobile_number, otp);

          // Send OTP via Fast2SMS
          const isSent = await sendOTP(mobile_number, otp);

          console.log("isSent:", isSent);
          if (isSent) {
            res.json({
              success: true,
              message: "OTP sent successfully and User profile updated",
            });
          } else {
            res.json({ success: false, message: "Failed to send OTP." });
          }
        }
      }
    }
  
 // else{

  //}
    
     else {
      res.status(201).json("User information does not exist");
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

async function generateOTP() {
  return new Promise((resolve, reject) => {
    return resolve(Math.floor(100000 + Math.random() * 900000));
  });
}

// Save OTP to the database
async function saveOTPToDatabase(email, phone_number, otp) {
  let result = await db.sequelize.query(query.saveOtp, {
    replacements: [email, phone_number, otp],
    type: QueryTypes.INSERT,
  });
  if (result[1] === 1) {
    return true;
  }
}

const sendOTP = async (phone, otp_num) => {
  return new Promise((resolve, reject) => {
   const apiKey = "7MVsvEZUBmASXhFOKzGjJdqo6Tk0wCby45aiIfct9n2HPWp3xgoEYky9jm4OUxD8Ivt3qwFpig7M5LQG";
 // const apiKey="CWG3xwMRZtfY46pBVqgmQezSj18TKXrbilN7ykaHhOILudJvDnQ7GskjuyLiYw68RH1IMgoUeNZXAxVC";
    const message = `Your OTP  for APR marathon registration is ${otp_num}.`;
    // const url = ` https://www.fast2sms.com/dev/bulkV2?authorization=7MVsvEZUBmASXhFOKzGjJdqo6Tk0wCby45aiIfct9n2HPWp3xgoEYky9jm4OUxD8Ivt3qwFpig7M5LQG&route=otp&variables_values=&flash=0&numbers=`;
    // //const url = `https://www.fast2sms.com/dev/bulk?authorization=${apiKey}&message=${message}&language=english&route=q&numbers=${phone}`;

    var req = unirest("POST", "https://www.fast2sms.com/dev/bulkV2");

    req.headers({
      authorization: "7MVsvEZUBmASXhFOKzGjJdqo6Tk0wCby45aiIfct9n2HPWp3xgoEYky9jm4OUxD8Ivt3qwFpig7M5LQG",
     // authorization: "CWG3xwMRZtfY46pBVqgmQezSj18TKXrbilN7ykaHhOILudJvDnQ7GskjuyLiYw68RH1IMgoUeNZXAxVC",
    });

    req.form({
      variables_values: otp_num,
      route: "otp",
      numbers: phone,
    });

    req.end(function (res) {
      // if (res.error) throw new Error(res.error);

      console.log(res.body);
      const result = res.body;

      if (result.return === true) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
};

const dataForCorpSponsor = async (req, res) => {
  try {
    const towerData = await db.sequelize.query(query.getTowerData, {
      type: QueryTypes.SELECT,
    });
    // const blockData = await db.sequelize.query(query.getBlockData, {type:QueryTypes.SELECT});
    const blockData = await blockDetails(towerData);

    res.status(200).json(blockData);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
};

const updateRegProfilePic = async(req,res)=>{
  try {
    const {registrant_id,registrant_profile_image }=req.body;

    const checkUser = await db.sequelize.query(query.checkUser, {
      replacements: [registrant_id],
      type: QueryTypes.SELECT,
    });

    if(checkUser[0]!==undefined){

  const result = await db.sequelize.query(query.profilePic, {replacements:[registrant_profile_image,registrant_id], type:QueryTypes.UPDATE});

  if(result[1]=== 1){
    res.status(200).json("Profile pic updated")
  }

    }else{
      res.status(201).json("user does not exist")
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

const getOnSpotAdminRegisteredDetails = async(req,res) =>{

  let response = []

  try{
    const event_id = await db.sequelize.query(query.getActiveEventId, { type:QueryTypes.SELECT });

    if(event_id.length === 0){
      return res.status(400).send("Currently there is no active event to fetch onspot registrants.");
    }

    const result = await db.sequelize.query(query.getPaymentStatusAdminRegistrants, {
      replacements: [ event_id[0]?.event_id ],
      type:QueryTypes.SELECT
    });

    for(let i=0; i<result.length; i++){

      const merchant_transaction_id = await db.sequelize.query(query.getTranscationId, {replacements:[result[i].registrant_id],type:QueryTypes.SELECT});
      const booking_id = await db.sequelize.query(query.getBookingIDForAdmin, {replacements:[result[i].registrant_id], type:QueryTypes.SELECT});

      if(booking_id.length !== 0){

        const className = await db.sequelize.query(query.getCategoryName, {replacements:[booking_id[0].registrant_class_ref],type:QueryTypes.SELECT})
        const categoryName = await db.sequelize.query(query.getClassName,{replacements:[booking_id[0].registrant_type_ref],type:QueryTypes.SELECT});

        response.push({
          ...event_id[0],
          ...merchant_transaction_id[0],
          ...result[i],
          booking_id: booking_id[0].booking_id,
          type_id: booking_id[0].registrant_type_ref,
          class_id: booking_id[0].registrant_class_ref,
          class_name: className[0].category_name,
          type_name: categoryName[0].type_name,
        })
      }
    }

    return res.status(200).json(response)
  }
  catch(error){
    console.log(error)
    return res.status(500).json("internal server error")
  }

}

const searchRegistrant = async(req,res) =>{
  const { email, mobileNumber } = req.body;

  var response = [];

  const [ getCurrentEvent ] = await db.sequelize.query(query.getEventDetail, { type:QueryTypes.SELECT });
  const { event_id } = getCurrentEvent;

  const searchData = await db.sequelize.query(query.getSearchedRegistrantsByMail, {
    replacements:[
      event_id,
      email+"%"
    ],
    type:QueryTypes.SELECT
  });

  console.log(searchData)

  for(let i=0;i<searchData.length;i++){
    const eventName = await db.sequelize.query(query.getEventName,{replacements:[searchData[i].event_id_ref],type:QueryTypes.SELECT});
    const booking_id = await db.sequelize.query(query.getBookingIDForAdmin, {replacements:[searchData[i].registrant_id], type:QueryTypes.SELECT});
    const className = await db.sequelize.query(query.getCategoryName, {replacements:[booking_id[0].registrant_class_ref],type:QueryTypes.SELECT})
    const categoryName = await db.sequelize.query(query.getClassName,{replacements:[booking_id[0].registrant_type_ref],type:QueryTypes.SELECT});
    response.push({
      ...searchData[i],
      ...eventName[0],
      ...categoryName[0],
      ...className[0]
    });
  }

  // commented by Ram

  // if(mobileNumber == null ){
  //   const searchData = await db.sequelize.query(query.getSearchedRegistrantsByMail, {replacements:[email+"%"],type:QueryTypes.SELECT});
  //   for(let i=0;i<searchData.length;i++){
  //     const eventName = await db.sequelize.query(query.getEventName,{replacements:[searchData[i].event_id_ref],type:QueryTypes.SELECT});
  //     const booking_id = await db.sequelize.query(query.getBookingIDForAdmin, {replacements:[searchData[i].registrant_id], type:QueryTypes.SELECT});
  //     const className = await db.sequelize.query(query.getCategoryName, {replacements:[booking_id[0].registrant_class_ref],type:QueryTypes.SELECT})
  //     const categoryName = await db.sequelize.query(query.getClassName,{replacements:[booking_id[0].registrant_type_ref],type:QueryTypes.SELECT});
  //     response.push({...searchData[i],...eventName[0],...categoryName[0],...className[0]});
  //   }
  // }
  // else if(email == null){
  //   searchData = await db.sequelize.query(query.getSearchedRegistrantsByMobileNumber, {replacements:[mobileNumber+"%"],type:QueryTypes.SELECT});
  //   for(let i=0;i<searchData.length;i++){
  //     eventName = await db.sequelize.query(query.getEventName,{replacements:[searchData[i].event_id_ref],type:QueryTypes.SELECT});
  //     const booking_id = await db.sequelize.query(query.getBookingIDForAdmin, {replacements:[searchData[i].registrant_id], type:QueryTypes.SELECT});
  //     const className = await db.sequelize.query(query.getCategoryName, {replacements:[booking_id[0].registrant_class_ref],type:QueryTypes.SELECT})
  //     const categoryName = await db.sequelize.query(query.getClassName,{replacements:[booking_id[0].registrant_type_ref],type:QueryTypes.SELECT});
  //     response.push({...searchData[i],...eventName[0],...categoryName[0],...className[0]});
  //   }
  // }

  res.status(200).json(response);
}

const getRegistrantData = async(req,res)=>{

  const {registrant_id,event_id} = req.body;

  const response1 = await db.sequelize.query(query.getRegistrantData, {replacements:[registrant_id],type:QueryTypes.SELECT});
  let runners = []
  const response2 = await db.sequelize.query(query.getRunnerData, {replacements:[registrant_id,event_id],type:QueryTypes.SELECT});
  for(let i=0; i<response2.length; i++){
    const categoryName = await db.sequelize.query(query.getCategoryInfo, {replacements:[response2[i].run_category_id_ref],type:QueryTypes.SELECT});
    runners.push({...response2[i],...{run_category_name:categoryName[0].race_type_name}});
  }
  res.status(200).json({"registrant_details":response1[0],"runner_details":runners});

}


const fetchpreviousEventRunnerDetail = async(req,res)=>{
  const {registrant_id, registrant_class_ref} =req.body;

  const currentYear = new Date().getFullYear();
let value =[ currentYear, registrant_id,registrant_class_ref];
//console.log(value);

  const eventRegisterinfo = await db.sequelize.query(query.eventRegisterinfo, {replacements:value,type:QueryTypes.SELECT} )
          if(eventRegisterinfo.length >0 ){
            //console.log(eventRegisterinfo);
           // let mergedArray=[];
            let runner=[];
            for(const id of eventRegisterinfo){
              //console.log("booking_id: ",id.booking_id);
              
               const runnerInfo = await db.sequelize.query(query.previousEventRunner,  {replacements:[id.booking_id],type:QueryTypes.SELECT},)
             //console.log("runnerInfo: ",runnerInfo);
               runner =   runner.concat(runnerInfo)
                
            }
            res.status(200).json(runner)
          }else{
            res.status(200).json([]);
          }
}     
module.exports = {
  addRegistrantInfo,
  updateRegistrantInfo,
  removeRegistrant,
  getRegistrantDetail,

  addRunners,
  updateRunnerInfo,
  removeRunner,
  getRunnerDetail,

  getregistrantCategoryDetail,
  getMasterList,
  getRunnerForRegistrant,
  getrunnerByRegistrant,
  getPricedetails,
  getDataForRegistration,
  //generateBib,
  //increaseCount,
  addRegistrantInfoWeb,
  masterListApp,
  createOrder,
  mySchedule,
  editUserProfile,
  verifyAddress,
  //payment,
  dataForCorpSponsor,
  updateRegProfilePic,

  //Rishi
  addRegistrantInfoAdminWeb,
  getOnSpotAdminRegisteredDetails,
  searchRegistrant,
  getRegistrantData,
  fetchpreviousEventRunnerDetail
};
