const db = require("../config/dbconfig");
const query = require("../models/adminconfiguration.model");
const { sequelize } = require("sequelize");
const { QueryTypes } = require("sequelize");
const query1 = require("../models/dashboard.model")

const geteventinfo = async (req, res) => {
  try {
    const event_id = req.params.event_id;
    const eventInfo = await db.sequelize.query(query.getEventInfo, {
      replacements: [event_id],
      type: QueryTypes.SELECT,
    });
    res.status(200).json(eventInfo);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
};

const getRaceCategoryinfo = async (req, res) => {
  try {
    // const event_id = req.params.event_id;
    const raceCategory = await db.sequelize.query(query.getRaceCategory, {
      //replacements:[event_id],
      type: QueryTypes.SELECT,
    });
    res.status(200).json(raceCategory);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
};

const getRegistrantClass = async (req, res) => {
  try {
    const event_id = req.params.event_id;
    const registrantClass = await db.sequelize.query(query.getRegistrantClass, {
      replacements: [event_id],
      type: QueryTypes.SELECT,
    });
    res.status(200).json(registrantClass);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
};

const getRegistrantSource = async (req, res) => {
  try {
    //const event_id = req.params.event_id;
    const registrantSource = await db.sequelize.query(
      query.getRegistrantSource,
      { type: QueryTypes.SELECT }
    );
    res.status(200).json(registrantSource);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
};

const getRegistrantType = async (req, res) => {
  try {
    //const event_id = req.params.event_id;
    const registrantType = await db.sequelize.query(query.getRegistrantType, {
      //replacements:[event_id],
      type: QueryTypes.SELECT,
    });
    res.status(200).json(registrantType);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
};

const getTicketType = async (req, res) => {
  try {
    //const event_id = req.params.event_id;
    const ticketType = await db.sequelize.query(query.getTicketType, {
      //replacements:[event_id],
      type: QueryTypes.SELECT,
    });
    res.status(200).json(ticketType);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
};

const setUpEvent = async (req, res) => {
  try {
    const { event_name, event_year, event_organiser } = req.body;

    const data = await db.sequelize.query(query.setUpEvent, {
      replacements: [event_name, event_year, event_organiser],
      type: QueryTypes.INSERT,
    });
    res.status(200).json("Event created successfully...");
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
};

const registrantClass = async (regType) => {
  return new Promise(async (resolve, reject) => {
    //console.log("regType :", regType );
    let result = [];
    for (let i = 0; i < regType.length; i++) {
      const data = await db.sequelize.query(query.regType, {
        replacements: [regType[i].type_id],
        type: QueryTypes.SELECT,
      });
      for (let j = 0; j < data.length; j++) {
        result.push(data[j]);
      }
    }

    let array = [];
    result.forEach((obj) => {
      let matchObj = regType.find(
        (obj1) => obj1.type_id === obj.registrant_type_id_ref
      );
      if (matchObj) {
        let merge = { ...obj, ...matchObj };
        array.push(merge);
      }
    });
    //console.log(array);
    if (array.length === result.length) {
      return resolve(array);
    }
  });
};

const getDataForEvent = async (req, res) => {
  try {
    const getActiveEvent = await db.sequelize.query(query.activeEvent, {
      type: QueryTypes.SELECT,
    });

    const getRegistrantType = await db.sequelize.query(
      query.getRegistrantType1,
      { type: QueryTypes.SELECT }
    );

    const regClass = await registrantClass(getRegistrantType);

    const raceType = await db.sequelize.query(query.getRaceCategory1, {
      type: QueryTypes.SELECT,
    });

    const ageType = await db.sequelize.query(query.ageType, {
      type: QueryTypes.SELECT,
    });

    console.log("ageType: ", ageType);
    res.status(200).json({
      activeEvent: getActiveEvent[0],
      regType: getRegistrantType,
      regClass: regClass,
      raceType: raceType,
      ageType: ageType,
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

// const updateEvent = async (req, res) => {
//   try {
//     const { eventDetails, raceCategory, registrantType } = req.body;
//     let regType = registrantType;
//     let race = raceCategory;
//     // Get the current timestamp in milliseconds
//     const currentTimestampMillis = Date.now();

//     // Create a Date object using the current timestamp
//     const currentTimestampWithTimezone = new Date(currentTimestampMillis);

//     console.log(currentTimestampWithTimezone);
//     const findEvent = await db.sequelize.query(query.getEventInfo, {
//       replacements: [eventDetails.event_id],
//       type: QueryTypes.SELECT,
//     });
//     if (findEvent[0] !== undefined) {
//       const update_event = await db.sequelize.query(query.updateEvent, {
//         replacements: [
//           eventDetails.event_name,
//           //eventDetails.event_year,
//           eventDetails.event_date,
//           eventDetails.event_time,
//           eventDetails.address,
//           eventDetails.city,
//           eventDetails.state,
//           eventDetails.zip_code,
//           eventDetails.event_description,
//           eventDetails.registration_cut_off_date,
//           eventDetails.registration_cut_off_time,
//           eventDetails.registration_starts,
//           eventDetails.expo_day,
//           eventDetails.stall_opening_time,
//           eventDetails.stall_closing_time,
//           eventDetails.bib_collection_date,
//           eventDetails.bib_collection_place,
//           eventDetails.bib_collection_starts,
//           eventDetails.bib_collection_ends,
//           eventDetails.early_bird_cut_off_date,
//           eventDetails.race_instructions,
//           eventDetails.parking_instructions,
//           eventDetails.updated_by,
//           currentTimestampWithTimezone,
//           eventDetails.event_id,
//         ],
//         type: QueryTypes.UPDATE,
//       });

//       console.log(update_event);
//       let count = 0;
//       let result = 0;
//       if (update_event[1] === 1) {
//         for (let i = 0; i < race.length; i++) {
//           let obj = {
//             race_type_id: race[i].race_type_id,
//             age_type_id: race[i].age_type_id,
//             race_time: race[i].race_time,
//             event_id: eventDetails.event_id,
//             created_by: eventDetails.updated_by,
//           };

//           const insertRaceTiming = await db.sequelize.query(
//             query.insertRaceTime,
//             {
//               replacements: [
//                 obj.race_type_id,
//                 obj.age_type_id,
//                 obj.race_time,
//                 obj.event_id,
//                 obj.created_by,
//               ],
//               type: QueryTypes.INSERT,
//             }
//           );
//           if (insertRaceTiming[1] === 1) {
//             count++;
//           }
//         }
//       }
//       if (race.length == count) {
//         for (let j = 0; j < regType.length; j++) {
//           let obj1 = {
//             registrant_type_id: regType[j].registrant_type_id,
//             class_category_id: regType[j].class_category_id,
//             ticket_count: regType[j].ticket_count,
//             runner_count: regType[j].ticket_count,
//             category_price: regType[j].price,
//             created_by: eventDetails.updated_by,
//             event_id: eventDetails.event_id,
//           };

//           const insertPrice = await db.sequelize.query(query.insertClassPrice, {
//             replacements: [
//               obj1.class_category_id,
//               obj1.category_price,
//               obj1.ticket_count,
//               obj1.runner_count,
//               obj1.registrant_type_id,
//               obj1.created_by,
//               obj1.event_id,
//             ],
//             type: QueryTypes.INSERT,
//           });
//           if (insertPrice[1] === 1) {
//             result++;
//           }
//         }
//       }

//       if (result === regType.length) {
//         res.status(200).json("Event information updated successfully...");
//       } else {
//         res.status(201).json("something went wrong");
//       }
//     } else {
//       res.status(201).json("Event information does not exist, Please check");
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(400).json({
//       error_msg: error.message,
//       stack_trace: error.stack,
//       error_obj: error,
//     });
//   }
// };


const updateEvent = async (req, res) => {
  try {
    const { eventDetails, raceCategory, registrantType } = req.body;
    let regType = registrantType;
    let race = raceCategory;
    // Get the current timestamp in milliseconds
    const currentTimestampMillis = Date.now();
    // Create a Date object using the current timestamp
    const currentTimestampWithTimezone = new Date(currentTimestampMillis);
    console.log(currentTimestampWithTimezone);
    const findActiveEvent = await db.sequelize.query(query.getActiveEvent, {
        replacements: [eventDetails.event_id],
        type: QueryTypes.SELECT,
      });
    
    if (findActiveEvent[0] === undefined) {
      const check_event = await db.sequelize.query(query.getCurrentEvent, {
        replacements:[
          eventDetails.event_name,
          eventDetails.event_year
        ],
        type: QueryTypes.SELECT,
      });
      console.log(check_event);
      if(check_event.length == 0){
        const update_event = await db.sequelize.query(query.setUpEvent1, {
          replacements: [
            
            eventDetails.event_name,
            eventDetails.event_year,
            eventDetails.event_organiser,
            //eventDetails.event_year,
            eventDetails.event_date,
            eventDetails.event_time,
            eventDetails.address,
            eventDetails.city,
            eventDetails.state,
            eventDetails.zip_code,
            eventDetails.event_description,
            eventDetails.registration_cut_off_date,
            eventDetails.registration_cut_off_time,
            eventDetails.registration_starts,
            eventDetails.expo_day,
            eventDetails.stall_opening_time,
            eventDetails.stall_closing_time,
            eventDetails.bib_collection_date,
            eventDetails.bib_collection_place,
            eventDetails.bib_collection_starts,
            eventDetails.bib_collection_ends,
            eventDetails.early_bird_cut_off_date,
            eventDetails.race_instructions,
            eventDetails.parking_instructions,
            eventDetails.updated_by,
            currentTimestampWithTimezone,
          ],
          type: QueryTypes.INSERT,
        });
  
        console.log(update_event);
  
        const get_event = await db.sequelize.query(query.getCurrentEvent, {
          replacements:[
            eventDetails.event_name,
            eventDetails.event_year
          ],
          type: QueryTypes.SELECT,
        });
  
        console.log(get_event);
  
        let count = 0;
        let result = 0;
  
        if (get_event.length > 0) {
          for (let i = 0; i < race.length; i++) {
            let obj = {
              race_type_id: race[i].race_type_id,
              age_type_id: race[i].age_type_id,
              race_time: race[i].race_time,
              event_id: get_event[0].event_id,
              created_by: eventDetails.updated_by,
            };
  
            const insertRaceTiming = await db.sequelize.query(
              query.insertRaceTime,
              {
                replacements: [
                  obj.race_type_id,
                  obj.age_type_id,
                  obj.race_time,
                  obj.event_id,
                  obj.created_by,
                ],
                type: QueryTypes.INSERT,
              }
            );
            if (insertRaceTiming[1] === 1) {
              count++;
            }
          }
        }
        if (race.length == count) {
          for (let j = 0; j < regType.length; j++) {
            let obj1 = {
              registrant_type_id: regType[j].registrant_type_id,
              class_category_id: regType[j].class_category_id,
              ticket_count: regType[j].ticket_count,
              runner_count: regType[j].ticket_count,
              category_price: regType[j].price,
              created_by: eventDetails.updated_by,
              event_id: get_event[0].event_id,
            };
            //
            const insertPrice = await db.sequelize.query(query.insertClassPrice, {
              replacements: [
                obj1.class_category_id,
                obj1.category_price,
                obj1.ticket_count,
                obj1.runner_count,
                obj1.registrant_type_id,
                obj1.created_by,
                obj1.event_id,
              ],
              type: QueryTypes.INSERT,
            });
            if (insertPrice[1] === 1) {
              result++;
            }
          }
        }
  
        if (result === regType.length) {
          res.status(200).json("Event information updated successfully...");
        } else {
          res.status(201).json("something went wrong");
        }
      }
      else{
        res.status(201).json("Event name and year combination already exist.")
      }
    }
    else if(findActiveEvent[0] !== undefined){
      res.status(201).json("Already an active event exist");
    } 
    else {
      res.status(201).json("Event information does not exist, Please check");
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

/***************************** written by Ram ******************************* */

const createEvent = async (req, res) => {
  try {

    const { 
      eventName,
      eventOrganizer,
      raceInstructions,
      parkingInstructions,
      eventDate,
      eventTime,
      eventLocation,
      city,
      state,
      zipcode,
      raceArray,
      time_1k,
      time_5k,
      time_10k,
      individual_price,
      couple_price,
      family_of_3_price,
      family_of_4_price,
      family_of_5_price,
      family_of_6_price,
      senior_citizen_individual_price,
      senior_citizen_couple_price,
      bronze_donate_price,
      silver_donate_price,
      gold_donate_price,
      platinum_donate_price,
      diamond_donate_price,
      bronze_donor_price,
      silver_donor_price,
      gold_donor_price,
      platinum_donor_price,
      diamond_donor_price,
      bronze_donor_tickets,
      silver_donor_tickets,
      gold_donor_tickets,
      platinum_donor_tickets,
      diamond_donor_tickets,
      expo_day,
      stall_opening_time,
      stall_closing_time,
      bib_collection_date,
      bib_collection_starts,
      bib_collection_ends,
      bib_collection_place,
      registration_cut_off_time,
      registration_cut_off_date,
      registration_starts,
      early_bird_cut_off_date,
      created_by,
      country,
    } = req.body;

    const eventYear = new Date(eventDate).getFullYear();

    const currentTimestampWithTimezone = new Date(Date.now());

    const isActiveEventExists = await db.sequelize.query(query.getActiveEvent, {
      type: QueryTypes.SELECT,
    });

    if(isActiveEventExists.length > 0){
      return res.status(400).send("There is an active event ongoing")
    }

    // update event_info table

    await db.sequelize.query(query.setUpEvent1, {
      replacements: [
        eventName,
        eventYear,
        eventOrganizer,
        eventDate,
        eventTime,
        eventLocation,
        city,
        state,
        country,
        zipcode,
        "lorem ipsum",
        registration_cut_off_date,
        registration_cut_off_time,
        registration_starts,
        expo_day,
        stall_opening_time,
        stall_closing_time,
        bib_collection_date,
        bib_collection_place,
        bib_collection_starts,
        bib_collection_ends,
        early_bird_cut_off_date,
        raceInstructions,
        parkingInstructions,
        created_by,
        currentTimestampWithTimezone,
      ],
      type: QueryTypes.INSERT,
    });
     
    const [ event ] = await db.sequelize.query(query.getCurrentEvent, {
      replacements:[
        eventName,
        eventYear
      ],
      type: QueryTypes.SELECT,
    });

    const get_race_categories = await db.sequelize.query(query.getRaceCategory1, {
      type: QueryTypes.SELECT,
    });

    const get_age_categories = await db.sequelize.query(query.ageType, {
      type: QueryTypes.SELECT,
    });

    if(get_race_categories.length > 0 && get_age_categories.length > 0){

      // deleting existing race timings before entering new timings

      // await db.sequelize.query(query.deleteRaceTimings, {
      //   type: QueryTypes.DELETE,
      // });

      const race_timings = get_race_categories.map(raceObj => {

        if(raceObj.race_type_name === "5k"){

          return raceArray.map(obj => {
            return {
              race_type_id: raceObj.race_type_id,
              age_type_id: obj.id,
              race_time: time_5k.find(timeObj => timeObj.id === obj.id)?.time,
              race_1k: obj.race_1k,
              race_5k: obj.race_5k,
              race_10k: obj.race_10k,
              event_id: event.event_id,
              created_by,
            }
          })

        }

        if(raceObj.race_type_name === "1k"){
          return raceArray.map(obj => {
            return {
              race_type_id: raceObj.race_type_id,
              age_type_id: obj.id,
              race_time: time_1k,
              race_1k: obj.race_1k,
              race_5k: obj.race_5k,
              race_10k: obj.race_10k,
              event_id: event.event_id,
              created_by,
            }
          })
        }

        if(raceObj.race_type_name === "10k"){
          return raceArray.map(obj => {
            return {
              race_type_id: raceObj.race_type_id,
              age_type_id: obj.id,
              race_time: time_10k,
              race_1k: obj.race_1k,
              race_5k: obj.race_5k,
              race_10k: obj.race_10k,
              event_id: event.event_id,
              created_by,
            }
          })
        }
      });

      const race_timings_array = race_timings.flatMap(data => data);

      console.log(race_timings_array)

      // insert new race timings in race_timing_info table

      await Promise.all(race_timings_array.map(async (obj) => {
        return await db.sequelize.query(
          query.insertRaceTime,
          {
            replacements: [
              obj.race_type_id,
              obj.age_type_id,
              obj.race_time,
              obj.race_1k,
              obj.race_5k,
              obj.race_10k,
              obj.event_id,
              obj.created_by,
            ],
            type: QueryTypes.INSERT,
          }
        );
      }))

    }

    const registrant_class_array = [
      {
          registrant_type_id: 1,
          registrant_type_name: "marathon runners",
          class_category_id: 1,
          class_category_name: "individual",
          price: parseFloat(individual_price),
          ticket_count: 1
      },
      {
          registrant_type_id:1,
          registrant_type_name: "marathon runners",
          class_category_id: 2,
          class_category_name: "couple",
          price:parseFloat(couple_price),
          ticket_count: 2
      },
      {
          registrant_type_id:1,
          registrant_type_name: "marathon runners",
          class_category_id: 3,
          class_category_name: "family of 3",
          price:parseFloat(family_of_3_price),
          ticket_count:3
      },
      {
          registrant_type_id:1,
          registrant_type_name: "marathon runners",
          class_category_id: 4,
          class_category_name: "family of 4",
          price:parseFloat(family_of_4_price),
          ticket_count:4
      },
      {
          registrant_type_id:1,
          registrant_type_name: "marathon runners",
          class_category_id: 5,
          class_category_name: "family of 5",
          price:parseFloat(family_of_5_price),
          ticket_count:5
      },
      {
          registrant_type_id:1,
          registrant_type_name: "marathon runners",
          class_category_id: 6,
          class_category_name: "family of 6",
          price: parseFloat(family_of_6_price),
          ticket_count:6
      },
      {
          registrant_type_id:1,
          registrant_type_name: "marathon runners",
          class_category_id: 7,
          class_category_name: "senior citizen individual",
          price:parseFloat(senior_citizen_individual_price),
          ticket_count:1
      },
      {
          registrant_type_id:1,
          registrant_type_name: "marathon runners",
          class_category_id: 8,
          class_category_name: "senior citizen couple",
          price:parseFloat(senior_citizen_couple_price),
          ticket_count:2
      },
      {
          registrant_type_id: 2,
          registrant_type_name: "donors with runners",
          class_category_id: 9,
          class_category_name: "bronze",
          price: parseFloat(bronze_donor_price),
          ticket_count: parseInt(bronze_donor_tickets)
      },
      {
          registrant_type_id: 2,
          registrant_type_name: "donors with runners",
          class_category_id: 10,
          class_category_name: "silver",
          price: parseFloat(silver_donor_price),
          ticket_count: parseInt(silver_donor_tickets)
      },
      {
          registrant_type_id: 2,
          registrant_type_name: "donors with runners",
          class_category_id: 11,
          class_category_name: "gold",
          price: parseFloat(gold_donor_price),
          ticket_count: parseInt(gold_donor_tickets)
      },
      {
          registrant_type_id: 2,
          registrant_type_name: "donors with runners",
          class_category_id: 12,
          class_category_name: "platinum",
          price: parseFloat(platinum_donor_price),
          ticket_count: parseInt(platinum_donor_tickets)
      },
      {
          registrant_type_id: 2,
          registrant_type_name: "donors with runners",
          class_category_id: 13,
          class_category_name: "diamond",
          price: parseInt(diamond_donor_price),
          ticket_count: parseInt(diamond_donor_tickets)
      },
      {
          registrant_type_id: 3,
          registrant_type_name: "donate",
          class_category_id: 14,
          class_category_name: "bronze",
          price: parseFloat(bronze_donate_price),
          ticket_count: null
      },
      {
          registrant_type_id: 3,
          registrant_type_name: "donate",
          class_category_id: 15,
          class_category_name: "silver",
          price: parseFloat(silver_donate_price),
          ticket_count: null
      },
      {
          registrant_type_id: 3,
          registrant_type_name: "donate",
          class_category_id: 16,
          class_category_name: "gold",
          price: parseFloat(gold_donate_price),
          ticket_count: null
      },
      {
          registrant_type_id: 3,
          registrant_type_name: "donate",
          class_category_id: 17,
          class_category_name: "platinum",
          price: parseFloat(platinum_donate_price),
          ticket_count: null
      },
      {
          registrant_type_id: 3,
          registrant_type_name: "donate",
          class_category_id: 18,
          class_category_name: "diamond",
          price: parseFloat(diamond_donate_price),
          ticket_count: null
      },
      {
          registrant_type_id: 3,
          registrant_type_name: "donate",
          class_category_id: 19,
          class_category_name: "other amount",
          price: null,
          ticket_count: null
      },
    ];

    // delete existing registrant class price in registrant_class_info table

    // await db.sequelize.query(query.deleteRegistrantClassInfo, {
    //   type: QueryTypes.DELETE,
    // });

    // insert new registrant class price in registrant_class_info table

    await Promise.all(registrant_class_array.map(async (obj) => {
      await db.sequelize.query(query.insertClassPrice, {
        replacements: [
          obj.class_category_id,
          obj.class_category_name,
          obj.price,
          obj.ticket_count,
          obj.ticket_count,
          obj.registrant_type_id,
          created_by,
          event.event_id,
        ],
        type: QueryTypes.INSERT,
      });
    }))

    return res.status(201).send({ event_id: event.event_id })
  
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
}

const editEvent = async (req, res) => {
  try {

    const { event_id } = req.params;

    if(isNaN(parseInt(event_id))){
      return res.status(400).send("Invalid event key")
    }

    const isEventExists = await db.sequelize.query(query.isEventExistsById, {
      replacements: [ event_id ],
      type: QueryTypes.SELECT,
    });

    if(isEventExists.length === 0){
      return res.status(400).send("This event is not found")
    }

    const { 
      eventName,
      eventOrganizer,
      raceInstructions,
      parkingInstructions,
      eventDate,
      eventTime,
      eventLocation,
      city,
      state,
      zipcode,
      raceArray,
      time_1k,
      time_5k,
      time_10k,
      individual_price,
      couple_price,
      family_of_3_price,
      family_of_4_price,
      family_of_5_price,
      family_of_6_price,
      senior_citizen_individual_price,
      senior_citizen_couple_price,
      bronze_donate_price,
      silver_donate_price,
      gold_donate_price,
      platinum_donate_price,
      diamond_donate_price,
      bronze_donor_price,
      silver_donor_price,
      gold_donor_price,
      platinum_donor_price,
      diamond_donor_price,
      bronze_donor_tickets,
      silver_donor_tickets,
      gold_donor_tickets,
      platinum_donor_tickets,
      diamond_donor_tickets,
      expo_day,
      stall_opening_time,
      stall_closing_time,
      bib_collection_date,
      bib_collection_starts,
      bib_collection_ends,
      bib_collection_place,
      registration_cut_off_time,
      registration_cut_off_date,
      registration_starts,
      early_bird_cut_off_date,
      created_by,
      country,
    } = req.body;

    const eventYear = new Date(eventDate).getFullYear();

    const currentTimestampWithTimezone = new Date(Date.now());

    // // update event_info table

    await db.sequelize.query(query.updateEventQuery, {
      replacements: [
        eventName,
        eventYear,
        eventOrganizer,
        eventDate,
        eventTime,
        eventLocation,
        city,
        state,
        country,
        zipcode,
        "lorem ipsum",
        registration_cut_off_date,
        registration_cut_off_time,
        registration_starts,
        expo_day,
        stall_opening_time,
        stall_closing_time,
        bib_collection_date,
        bib_collection_place,
        bib_collection_starts,
        bib_collection_ends,
        early_bird_cut_off_date,
        raceInstructions,
        parkingInstructions,
        created_by,
        currentTimestampWithTimezone,
        event_id
      ],
      type: QueryTypes.UPDATE,
    });

    const get_race_categories = await db.sequelize.query(query.getRaceCategory1, {
      type: QueryTypes.SELECT,
    });

    const get_age_categories = await db.sequelize.query(query.ageType, {
      type: QueryTypes.SELECT,
    });

    if(get_race_categories.length > 0 && get_age_categories.length > 0){

      // deleting existing race timings before entering new timings

      // await db.sequelize.query(query.deleteRaceTimings, {
      //   type: QueryTypes.DELETE,
      // });

      const race_timings = get_race_categories.map(raceObj => {

        if(raceObj.race_type_name === "5k"){

          return raceArray.map(obj => {
            return {
              race_type_id: raceObj.race_type_id,
              age_type_id: obj.id,
              race_time: time_5k.find(timeObj => timeObj.id === obj.id)?.time,
              race_1k: obj.race_1k,
              race_5k: obj.race_5k,
              race_10k: obj.race_10k,
              event_id: event_id,
              created_by,
            }
          })

        }

        if(raceObj.race_type_name === "1k"){
          return raceArray.map(obj => {
            return {
              race_type_id: raceObj.race_type_id,
              age_type_id: obj.id,
              race_time: time_1k,
              race_1k: obj.race_1k,
              race_5k: obj.race_5k,
              race_10k: obj.race_10k,
              event_id: event_id,
              created_by,
            }
          })
        }

        if(raceObj.race_type_name === "10k"){
          return raceArray.map(obj => {
            return {
              race_type_id: raceObj.race_type_id,
              age_type_id: obj.id,
              race_time: time_10k,
              race_1k: obj.race_1k,
              race_5k: obj.race_5k,
              race_10k: obj.race_10k,
              event_id: event_id,
              created_by,
            }
          })
        }
      });

      const race_timings_array = race_timings.flatMap(data => data);

      // insert new race timings in race_timing_info table

      await Promise.all(race_timings_array.map(async (obj) => {
        return await db.sequelize.query(
          query.insertRaceTime,
          {
            replacements: [
              obj.race_type_id,
              obj.age_type_id,
              obj.race_time,
              obj.race_1k,
              obj.race_5k,
              obj.race_10k,
              obj.event_id,
              obj.created_by,
            ],
            type: QueryTypes.INSERT,
          }
        );
      }))

    }

    const registrant_class_array = [
      {
          registrant_type_id: 1,
          registrant_type_name: "marathon runners",
          class_category_id: 1,
          class_category_name: "individual",
          price: parseFloat(individual_price),
          ticket_count: 1
      },
      {
          registrant_type_id:1,
          registrant_type_name: "marathon runners",
          class_category_id: 2,
          class_category_name: "couple",
          price:parseFloat(couple_price),
          ticket_count: 2
      },
      {
          registrant_type_id:1,
          registrant_type_name: "marathon runners",
          class_category_id: 3,
          class_category_name: "family of 3",
          price:parseFloat(family_of_3_price),
          ticket_count:3
      },
      {
          registrant_type_id:1,
          registrant_type_name: "marathon runners",
          class_category_id: 4,
          class_category_name: "family of 4",
          price:parseFloat(family_of_4_price),
          ticket_count:4
      },
      {
          registrant_type_id:1,
          registrant_type_name: "marathon runners",
          class_category_id: 5,
          class_category_name: "family of 5",
          price:parseFloat(family_of_5_price),
          ticket_count:5
      },
      {
          registrant_type_id:1,
          registrant_type_name: "marathon runners",
          class_category_id: 6,
          class_category_name: "family of 6",
          price: parseFloat(family_of_6_price),
          ticket_count:6
      },
      {
          registrant_type_id:1,
          registrant_type_name: "marathon runners",
          class_category_id: 7,
          class_category_name: "senior citizen individual",
          price:parseFloat(senior_citizen_individual_price),
          ticket_count:1
      },
      {
          registrant_type_id:1,
          registrant_type_name: "marathon runners",
          class_category_id: 8,
          class_category_name: "senior citizen couple",
          price:parseFloat(senior_citizen_couple_price),
          ticket_count:2
      },
      {
          registrant_type_id: 2,
          registrant_type_name: "donors with runners",
          class_category_id: 9,
          class_category_name: "bronze",
          price: parseFloat(bronze_donor_price),
          ticket_count: parseInt(bronze_donor_tickets)
      },
      {
          registrant_type_id: 2,
          registrant_type_name: "donors with runners",
          class_category_id: 10,
          class_category_name: "silver",
          price: parseFloat(silver_donor_price),
          ticket_count: parseInt(silver_donor_tickets)
      },
      {
          registrant_type_id: 2,
          registrant_type_name: "donors with runners",
          class_category_id: 11,
          class_category_name: "gold",
          price: parseFloat(gold_donor_price),
          ticket_count: parseInt(gold_donor_tickets)
      },
      {
          registrant_type_id: 2,
          registrant_type_name: "donors with runners",
          class_category_id: 12,
          class_category_name: "platinum",
          price: parseFloat(platinum_donor_price),
          ticket_count: parseInt(platinum_donor_tickets)
      },
      {
          registrant_type_id: 2,
          registrant_type_name: "donors with runners",
          class_category_id: 13,
          class_category_name: "diamond",
          price: parseInt(diamond_donor_price),
          ticket_count: parseInt(diamond_donor_tickets)
      },
      {
          registrant_type_id: 3,
          registrant_type_name: "donate",
          class_category_id: 14,
          class_category_name: "bronze",
          price: parseFloat(bronze_donate_price),
          ticket_count: null
      },
      {
          registrant_type_id: 3,
          registrant_type_name: "donate",
          class_category_id: 15,
          class_category_name: "silver",
          price: parseFloat(silver_donate_price),
          ticket_count: null
      },
      {
          registrant_type_id: 3,
          registrant_type_name: "donate",
          class_category_id: 16,
          class_category_name: "gold",
          price: parseFloat(gold_donate_price),
          ticket_count: null
      },
      {
          registrant_type_id: 3,
          registrant_type_name: "donate",
          class_category_id: 17,
          class_category_name: "platinum",
          price: parseFloat(platinum_donate_price),
          ticket_count: null
      },
      {
          registrant_type_id: 3,
          registrant_type_name: "donate",
          class_category_id: 18,
          class_category_name: "diamond",
          price: parseFloat(diamond_donate_price),
          ticket_count: null
      },
      {
        registrant_type_id: 3,
        registrant_type_name: "donate",
        class_category_id: 19,
        class_category_name: "other amount",
        price: null,
        ticket_count: null
    },
    ];

    // delete existing registrant class price in registrant_class_info table

    // await db.sequelize.query(query.deleteRegistrantClassInfo, {
    //   type: QueryTypes.DELETE,
    // });

    // insert new registrant class price in registrant_class_info table

    await Promise.all(registrant_class_array.map(async (obj) => {
      await db.sequelize.query(query.insertClassPrice, {
        replacements: [
          obj.class_category_id,
          obj.class_category_name,
          obj.price,
          obj.ticket_count,
          obj.ticket_count,
          obj.registrant_type_id,
          created_by,
          event_id,
        ],
        type: QueryTypes.INSERT,
      });
    }))

    return res.status(201).send("Event updated successfully!")
  
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
}

const getEventsData = async (req, res) => {
  try {

    const paramEventId = req.params.event_id
    const [ eventData ] = await db.sequelize.query(query.getEventDataById, {
      replacements: [ paramEventId ],
      type: QueryTypes.SELECT,
    });

    console.log(eventData)

    if(!eventData){
      return res.status(400).send("This event is not found")
    }

    const registrantClassData = await db.sequelize.query(query.getRegistrantClassDetails, {
      replacements: [ eventData.event_id ],
      type: QueryTypes.SELECT,
    });

    const [ one_k_time ] = await db.sequelize.query(query.getOneKTime, {
      replacements: [ eventData.event_id ],
      type: QueryTypes.SELECT,
    });

    const [ ten_k_time ] = await db.sequelize.query(query.getTenKTime, {
      replacements: [ eventData.event_id ],
      type: QueryTypes.SELECT,
    });

    const five_k_time = await db.sequelize.query(query.getFiveKTime, {
      replacements: [ eventData.event_id ],
      type: QueryTypes.SELECT,
    });

    const getRaceArray = await db.sequelize.query(query.getRaceArrayQuery, {
      replacements: [ eventData.event_id ],
      type: QueryTypes.SELECT,
    });

    return res.status(200).json({
      eventName: eventData.event_name,
      eventOrganizer: eventData.event_organiser,
      raceInstructions: eventData.race_instruction,
      parkingInstructions: eventData.parking_instruction,
      eventDate: eventData.event_date,
      eventTime: eventData.event_time,
      eventLocation: eventData.event_location,
      city: eventData.city,
      state: eventData.state,
      zipcode: eventData.zip_code,
      raceArray: getRaceArray,
      time_1k: one_k_time.race_time,
      time_5k: five_k_time,
      time_10k: ten_k_time.race_time,
      individual_price: registrantClassData.find(data => data.category_name === "individual").category_price,
      couple_price: registrantClassData.find(data => data.category_name === "couple").category_price,
      family_of_3_price: registrantClassData.find(data => data.category_name === "family of 3").category_price,
      family_of_4_price: registrantClassData.find(data => data.category_name === "family of 4").category_price,
      family_of_5_price: registrantClassData.find(data => data.category_name === "family of 5").category_price,
      family_of_6_price: registrantClassData.find(data => data.category_name === "family of 6").category_price,
      senior_citizen_individual_price: registrantClassData.find(data => data.category_name === "senior citizen individual").category_price,
      senior_citizen_couple_price: registrantClassData.find(data => data.category_name === "senior citizen couple").category_price,
      bronze_donate_price: registrantClassData.find(data => data.category_name === "bronze" && data.registrant_type_id_ref === 3).category_price,
      silver_donate_price: registrantClassData.find(data => data.category_name === "silver" && data.registrant_type_id_ref === 3).category_price,
      gold_donate_price: registrantClassData.find(data => data.category_name === "gold" && data.registrant_type_id_ref === 3).category_price,
      platinum_donate_price: registrantClassData.find(data => data.category_name === "platinum" && data.registrant_type_id_ref === 3).category_price,
      diamond_donate_price: registrantClassData.find(data => data.category_name === "diamond" && data.registrant_type_id_ref === 3).category_price,
      bronze_donor_price: registrantClassData.find(data => data.category_name === "bronze" && data.registrant_type_id_ref === 2).category_price,
      silver_donor_price: registrantClassData.find(data => data.category_name === "silver" && data.registrant_type_id_ref === 2).category_price,
      gold_donor_price: registrantClassData.find(data => data.category_name === "gold" && data.registrant_type_id_ref === 2).category_price,
      platinum_donor_price: registrantClassData.find(data => data.category_name === "platinum" && data.registrant_type_id_ref === 2).category_price,
      diamond_donor_price: registrantClassData.find(data => data.category_name === "diamond" && data.registrant_type_id_ref === 2).category_price,
      bronze_donor_tickets: registrantClassData.find(data => data.category_name === "bronze" && data.registrant_type_id_ref === 2).category_ticket_count,
      silver_donor_tickets: registrantClassData.find(data => data.category_name === "silver" && data.registrant_type_id_ref === 2).category_ticket_count,
      gold_donor_tickets: registrantClassData.find(data => data.category_name === "gold" && data.registrant_type_id_ref === 2).category_ticket_count,
      platinum_donor_tickets: registrantClassData.find(data => data.category_name === "platinum" && data.registrant_type_id_ref === 2).category_ticket_count,
      diamond_donor_tickets: registrantClassData.find(data => data.category_name === "diamond" && data.registrant_type_id_ref === 2).category_ticket_count,
      expo_day: eventData.expo_day,
      stall_opening_time: eventData.stall_opening_time,
      stall_closing_time: eventData.stall_closing_time,
      bib_collection_date: eventData.bib_collection_date,
      bib_collection_starts: eventData.bib_collection_starts,
      bib_collection_ends: eventData.bib_collection_ends,
      bib_collection_place: eventData.bib_collection_place,
      registration_cut_off_time: eventData.event_cut_off_time,
      registration_cut_off_date: eventData.event_cut_off_date,
      registration_starts: eventData.registration_start_date,
      early_bird_cut_off_date: eventData.early_bird_cut_off_date,
      country: eventData.country,
    })

  } catch (error) {
    console.log(error);
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
}

/*****************************************************************************/

const getEvents = async (req, res) => {
  try {
    const events = await db.sequelize.query(query.getEvents, {
      type: QueryTypes.SELECT,
    });

    res.status(200).json(events);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
};

const getParticipantsList = async (req, res) => {
  try {
    const eventId = await db.sequelize.query(query.activeEvent, {
      type: QueryTypes.SELECT,
    });
    if(eventId[0] != undefined){
      const event_id = eventId[0].event_id;
      console.log(event_id);
      // get the runners whose payment status is paid or paid by corporate
      // const runners = await db.sequelize.query(query.runners, {
      //   type: QueryTypes.SELECT,
      // });


      //data for normal runners

      const registrant = await db.sequelize.query(query1.paidRegistrant, {
        replacements: [event_id],
        type: QueryTypes.SELECT,
      });


      if (registrant[0] !== undefined) {
        let list = [];

        for (let i = 0; i < registrant.length; i++) {
          const bookingInfo = await db.sequelize.query(query.bookingInfo, { replacements: [registrant[i].booking_id_ref], type: QueryTypes.SELECT });

          let registrant_id = registrant[i].registrant_id_ref;
          let reg_type = bookingInfo[0].registrant_type_ref;
          let reg_class = bookingInfo[0].registrant_class_ref;

          const getReg = await db.sequelize.query(query.registrant, {
            replacements: [registrant_id],
            type: QueryTypes.SELECT,
          });

          const regType = await db.sequelize.query(query.regTypeName, {
            replacements: [reg_type],
            type: QueryTypes.SELECT,
          });

          const regClass = await db.sequelize.query(query.regClassName, {
            replacements: [reg_class],
            type: QueryTypes.SELECT,
          });

          //  const regType = await 
          let regObj = { ...getReg[0], ...regType[0], ...regClass[0] };
          //console.log(regObj);
          //  list.push(regObj)
          const runners = await db.sequelize.query(query.runner, {
            replacements: [registrant[i].booking_id_ref],
            type: QueryTypes.SELECT,
          });
          for (let j = 0; j < runners.length; j++) {
            const runType = await db.sequelize.query(query.runType, {
              replacements: [runners[j].run_category_id_ref],
              type: QueryTypes.SELECT,
            });

            let company = {corporate_name:null};
            let regName = { registrant_name: `${getReg[0].first_name} ${getReg[0].last_name}` };
            let addressType = {address_type: getReg[0].address_type};
            let phase ={phase_no: getReg[0].addr_villa_phase_no};
            let tower = {tower_no:getReg[0].addr_tower_no}
            let obj = { ...runners[j], ...regName, ...runType[0], ...regClass[0], ...regType[0], ...addressType, ...phase, ...tower, ...company};
            //console.log(obj);
            list.push(obj);

          }

        }



        //data for corporate runners

        const corpRunner = await db.sequelize.query(query.corpRunner, { 
          replacements: [ event_id ], 
          type: QueryTypes.SELECT 
        });

        let corp = [];
        
        for (let k = 0; k < corpRunner.length; k++) {
          const runType = await db.sequelize.query(query.runType, {
              replacements: [corpRunner[k].run_category_id_ref],
              type: QueryTypes.SELECT,
          });
          const regAddress =  await db.sequelize.query(query.registrant, {
            replacements: [corpRunner[k].registrant_id_ref],
            type: QueryTypes.SELECT,
          });


          const companyName = await db.sequelize.query(query.getCorporateName, {
            replacements: [corpRunner[k].corporate_sponsor_id_ref],
            type: QueryTypes.SELECT,
          });

          if(companyName[0]!= undefined){
            let company = {corporate_name: companyName[0].corp_company_name}
            let regNames = { registrant_name: `${corpRunner[k].runner_first_name} ${corpRunner[k].runner_last_name}` };

            let corAddressType = {address_type:regAddress[0].address_type};
            let corpPhase ={phase_no:regAddress[0].addr_villa_phase_no};
            let corpTower = {tower_no:regAddress[0].addr_tower_no}
            let obj2 = { ...corpRunner[k],...regNames, ...runType[0],...corAddressType, ...corpPhase, ...corpTower,...company };
            corp.push(obj2)
          }

        }


        let result = list.concat(corp);
        res.status(200).json(result);
      } else {
        res.status(201).json("no registration data available..")
      }
    }
    else{
      res.status(201).json("no active event available..")
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

const getCorpSponsorList = async (req, res) => {
  try {
    const eventId = await db.sequelize.query(query.activeEvent, {
      type: QueryTypes.SELECT,
    });
    if(eventId[0] != undefined){
      const event_id = eventId[0].event_id;
      console.log(event_id);

      const result = await db.sequelize.query(query.getSponsorList, { replacements: [event_id], type: QueryTypes.SELECT });
      res.status(200).json(result)
    }
    else{
      res.status(201).json("No active event found...")
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

const inactiveEvent = async (req, res) => {
  try {

    const event_id = req.params.event_id;
    const checkEvent = await db.sequelize.query(query.getEventInfo, { replacements: [event_id], type: QueryTypes.SELECT });

    if (checkEvent[0] !== undefined) {

      const result = await db.sequelize.query(query.inactivateEvent, { replacements: [event_id], type: QueryTypes.UPDATE });

      if (result[1] === 1) {

        const corpSponsor = await db.sequelize.query(query.getSponsorList, { replacements: [event_id], type: QueryTypes.SELECT });
        console.log("corpSponsor : ", corpSponsor);
        let count = 0;
        if (corpSponsor[0] !== undefined) {
          for (let i = 0; i < corpSponsor.length; i++) {

            const deactivateSponsor = await db.sequelize.query(query.updateSponsorStatus, { replacements: ['inactive', corpSponsor[i].corporate_id], type: QueryTypes.UPDATE });
            if (deactivateSponsor[1] === 1) {
              const deactivateReg = await db.sequelize.query(query.updateRegStatus, { replacements: ['inactive', corpSponsor[i].corporate_id], type: QueryTypes.UPDATE });
              count++;
            }
          }
          if (count === corpSponsor.length) {
            res.status(200).json("Event inactivated")
          }
        } else {
          res.status(200).json("Event inactivated")
        }

      }
    }
    else {
      res.status(201).json("event info does not exist")
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

const activateEvent = async (req, res) => {
  try {
    const event_id = req.params.event_id;
    const checkEvent = await db.sequelize.query(query.getEventInfo, { replacements: [event_id], type: QueryTypes.SELECT });
    if (checkEvent[0] !== undefined) {

      await db.sequelize.query(query.inactiveAllEvents, { type: QueryTypes.UPDATE }); // inactive all events
      const result = await db.sequelize.query(query.activateEvent, { replacements: [event_id], type: QueryTypes.UPDATE });

      if (result[1] === 1) {

        const corpSponsor = await db.sequelize.query(query.getSponsorList, { replacements: [event_id], type: QueryTypes.SELECT });
        console.log("corpSponsor : ", corpSponsor);

        let count = 0;
        if (corpSponsor[0] !== undefined) {
          for (let i = 0; i < corpSponsor.length; i++) {

            const activateSponsor = await db.sequelize.query(query.updateSponsorStatus, { replacements: ['active', corpSponsor[i].corporate_id], type: QueryTypes.UPDATE });
            if (activateSponsor[1] === 1) {
              const activateReg = await db.sequelize.query(query.updateRegStatus, { replacements: ['active', corpSponsor[i].corporate_id], type: QueryTypes.UPDATE });
              count++;
            }
          }
          if (count === corpSponsor.length) {
            res.status(200).json("Event activated")
          }

        } else {
          res.status(200).json("Event activated")
        }
        // res.status(200).json("Event activated")
      }
    }
    else {
      res.status(201).json("event info does not exist")
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

//-----------------------laksh-----------------------
const get_All_Registrants = async (req, res) => {

  try {
    const allregistrants = await db.sequelize.query(query.getAllRegistrants, {
      type: QueryTypes.SELECT,
    });

    let result =[];
    if (allregistrants.length > 0) {
           //------------- suganthi---------------//

           for(let i=0; i<allregistrants.length; i++){
                     const checkPayment = await db.sequelize.query(query.orderStatus, { replacements:[allregistrants[i].registrant_id],  type: QueryTypes.SELECT});

                      if(checkPayment.length >0){
                              for(let j=0; j<checkPayment.length; j++ ){
                               
                                const regType =  await db.sequelize.query(query.regTypeForParticipant, {replacements:[checkPayment[j].registrant_type_ref],
                                type: QueryTypes.SELECT,
                              });

                               let eventType = {registrant_type:regType[0].type_name}
                               let regPayStatus = {registrant_payment_status:'paid registrant'}
                               let obj ={...allregistrants[i], ...regPayStatus,...eventType}
                               result.push(obj);
                              }
                      }else{
                        let regPayStatus = {registrant_payment_status:'unpaid registrant'}
                        let eventType = {registrant_type:null}
                          let obj1 ={...allregistrants[i], ...regPayStatus,...eventType}
                          result.push(obj1);
                      }
                     
           
           }
      res.status(200).json(result)
    } else {
      throw new Error("No registrants data available")

    }

  } catch (error) {
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error
    })
  }

}


const get_Donate_Registrant_id = (event_id) => {
  return new Promise((resolve, reject) => {
    try {
      const getId = db.sequelize.query(query.getDonateRegistrantId, {
        replacements:[event_id],
        type: QueryTypes.SELECT,

      });
      if (getId) {
        resolve(getId);
      } else {
        reject(new Error("No donate registrant available"))
      }
    } catch (error) {
      reject(error)

    }
  })
}

const get_Donate_Registrant = async (donateId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let myArray = [];
      const filteredArray = donateId.filter(item => item.registrant_id_ref !== null);
      console.log("line 604", filteredArray);
      for (let i = 0; i < filteredArray.length; i++) {
        const getId = await db.sequelize.query(query.getAllDonateRegistrants, {
          type: QueryTypes.SELECT,
          replacements: [filteredArray[i].registrant_id_ref]
        });

        myArray.push(getId[0]);
      }

      console.log("line 611", myArray.length);

      if (myArray.length > 0) {
        //console.log("line 612 ", myArray);
        resolve(myArray);
      } else {
        resolve([])
      }
    } catch (error) {
      reject(error);
    }
  });
};

const mergedArray_For_Donate = async (donateId, donateRegistrant) => {
  try {
    const mergedArray = donateId.map(item1 => {
      const matchedItem = donateRegistrant.find(item2 => item2 && item2.registrant_id === item1.registrant_id_ref);

      // Return merged object if a match is found, otherwise, return null
      return matchedItem ? { ...item1, ...matchedItem } : null;
    })
      .filter(mergedObject => mergedObject !== null);

    //console.log("line 637", mergedArray);
    return mergedArray;
  } catch (error) {
    console.error("Error in merging arrays:", error);
    return [];
  }
};





const get_All_Donate_Registrants = async (req, res) => {
  try {
    const eventId = await db.sequelize.query(query.activeEvent, {
      type: QueryTypes.SELECT,
    });
    
    if(eventId[0] != undefined){
      const event_id = eventId[0].event_id;
      const result1 = await get_Donate_Registrant_id(event_id);

      const result2 = await get_Donate_Registrant(result1);
      const result3 = await mergedArray_For_Donate(result1, result2)
      if (result3) {
        res.status(200).json(result3);
      } else {
        res.status(201).json("No data available");
      }
    }
    else{
      res.status(201).json("No active event available...")
    }

  } catch (error) {
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error
    })
  }
}

//-----------------------laksh-----------------------



module.exports = {
  geteventinfo,
  getRaceCategoryinfo,
  getRegistrantClass,
  getRegistrantSource,
  getRegistrantType,
  getTicketType,
  //createEvevntInfo,
  updateEvent,
  setUpEvent,
  getEvents,
  getDataForEvent,
  getParticipantsList,
  getCorpSponsorList,
  inactiveEvent,
  activateEvent,
  //laksh
  get_All_Registrants,
  get_All_Donate_Registrants,
  //laksh

  //Ram
  createEvent,
  editEvent,
  getEventsData

};


