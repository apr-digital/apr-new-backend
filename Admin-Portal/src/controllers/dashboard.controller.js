const db = require("../config/dbconfig");
const query = require("../models/dashboard.model");
const { sequelize } = require("sequelize");
const { QueryTypes } = require("sequelize");

const sponsorList = async (req, res) => {
  try {

    const eventArray = await db.sequelize.query(query.getActiveEventId, {
      type: QueryTypes.SELECT,
    });

    if(eventArray.length === 0){
      return res.status(400).send("unable to fetch dashboard data since there is no active event")
    }

    const event_id = eventArray[0]?.event_id

    const sponsorList = await db.sequelize.query(query.sponsorlist, {
      replacements: [event_id],
      type: QueryTypes.SELECT,
    });

    // run category count
    const raceType = await db.sequelize.query(query.runTypeInfo, {
      type: QueryTypes.SELECT,
    });

    console.log(raceType);
    let count_1k = 0;
    let count_5k = 0;
    let count_10k = 0;
    for (let i = 0; i < raceType.length; i++) {
      if (raceType[i].race_type_name == "1k") {
        const runCount = await db.sequelize.query(query.raceRunCount, {
          replacements: [raceType[i].race_type_id, event_id],
          type: QueryTypes.SELECT,
        });
        count_1k += +runCount[0].run_count;
      } else {
        if (raceType[i].race_type_name == "5k") {
          const runCount = await db.sequelize.query(query.raceRunCount, {
            replacements: [raceType[i].race_type_id, event_id],
            type: QueryTypes.SELECT,
          });
          count_5k += +runCount[0].run_count;
        } else {
          if (raceType[i].race_type_name == "10k") {
            const runCount = await db.sequelize.query(query.raceRunCount, {
              replacements: [raceType[i].race_type_id, event_id],
              type: QueryTypes.SELECT,
            });
            count_10k += +runCount[0].run_count;
          }
        }
      }
    }

    //t-shirt count

    const s_size = await db.sequelize.query(query.tshirtCount, {
      replacements: [event_id, "s"],
      type: QueryTypes.SELECT,
    });
    console.log(s_size);
    let count_s = Number(s_size[0].shirt_count);

    const xxxl_size = await db.sequelize.query(query.tshirtCount, {
      replacements: [event_id, "xxxl"],
      type: QueryTypes.SELECT,
    });
    let count_xxxl = Number(xxxl_size[0].shirt_count);

    const xxl_size = await db.sequelize.query(query.tshirtCount, {
      replacements: [event_id, "xxl"],
      type: QueryTypes.SELECT,
    });
    let count_xxl = Number(xxl_size[0].shirt_count);

    const xl_size = await db.sequelize.query(query.tshirtCount, {
      replacements: [event_id, "xl"],
      type: QueryTypes.SELECT,
    });
    let count_xl = Number(xl_size[0].shirt_count);

    const l_size = await db.sequelize.query(query.tshirtCount, {
      replacements: [event_id, "l"],
      type: QueryTypes.SELECT,
    });
    let count_l = Number(l_size[0].shirt_count);

    const m_size = await db.sequelize.query(query.tshirtCount, {
      replacements: [event_id, "m"],
      type: QueryTypes.SELECT,
    });
    let count_m = Number(m_size[0].shirt_count);

    const xs_size = await db.sequelize.query(query.tshirtCount, {
      replacements: [event_id, "xs"],
      type: QueryTypes.SELECT,
    });
    let count_xs = Number(xs_size[0].shirt_count);

    //gender count
    const maleCount = await db.sequelize.query(query.genderCount, {
      replacements: ["male", event_id],
      type: QueryTypes.SELECT,
    });

    const femaleCount = await db.sequelize.query(query.genderCount, {
      replacements: ["female", event_id],
      type: QueryTypes.SELECT,
    });

    //runner age count

    const ageCat = await db.sequelize.query(query.ageCat, {
      type: QueryTypes.SELECT,
    });
    let result = [];
    let total = 0;
    for (let i = 0; i < ageCat.length; i++) {
      let runner_count = await db.sequelize.query(query.ageRunCount, {
        replacements: [event_id, ageCat[i].age_type_id],
      });
      let count = runner_count[0];
      //console.log(count);
      let obj = { ...ageCat[i], ...count[0] };
      result.push(obj);
      total += +Number(count[0].run_count);
      //console.log("line276: " ,  count[0].run_count);
    }
    let ageCount = [];
    if (result.length === ageCat.length) {
      for (let j = 0; j < result.length; j++) {
        let percentage = Number(
          ((Number(result[j].run_count) / total) * 100).toFixed(2)
        );
        // console.log(total);
        //console.log(Number(result[j].run_count));
        let age_per = { age_percentage: percentage };
        ageCount.push({ ...result[j], ...age_per });
      }
    }

    //total amount

    //general registration amount
   // const regAmount = await db.sequelize.query(query.totalAmount, {
    //  replacements: [event_id],
    //  type: QueryTypes.SELECT,
    //});

    const regAmount = await getTotalRegisrationAmount(event_id);

    //sponsorship amount
    const sponsorshipAmount = await db.sequelize.query(
      query.totalSponsorAmount,
      { replacements: [event_id], type: QueryTypes.SELECT }
    );

    console.log(regAmount);
    console.log(sponsorshipAmount);
    const amount = Number(regAmount);
    const sponsor_amount = Number(sponsorshipAmount[0].sum);


    

    res.status(200).json({
      sponsorList: sponsorList,
      // participantCount: {
      //   total_participant: totalParticipants,
      //   villa_participant: villaParticipant,
      //   tower_participants: towerParticipsnt,
      //   total_runner: Number(totalRunners[0].run_count),
      //   corp_sponsor: corpCount.length,
      // },
      raceCatCount: {
        runner_1k: count_1k,
        runner_5k: count_5k,
        runner_10k: count_10k,
      },
      tshirtCount: {
        xxxl_count: count_xxxl,
        xxl_count: count_xxl,
        xl_count: count_xl,
        l_count: count_l,
        s_count: count_s,
        xs_count: count_xs,
        m_count: count_m,
      },
      genderCount: {
        male_runner: Number(maleCount[0].gen_count),
        female_runner: Number(femaleCount[0].gen_count),
      },
      ageCount,
      totalAmount: amount,
      sponsorAmount: sponsor_amount,
    });
  } catch (error) {
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
};


const getTotalRegisrationAmount= async(eventid)=>{
  return new Promise(async(resolve,reject)=>{
        
        const orderInfo = await db.sequelize.query(query.orderInfo, {replacements:[eventid],type:QueryTypes.SELECT});
             let totalAmount=0;
       for(let i=0; i< orderInfo.length; i++){
             const amount = await db.sequelize.query(query.paymentAmount, {replacements:[orderInfo[i].order_id],type:QueryTypes.SELECT});
                if(amount[0] !==undefined){
                  totalAmount += +amount[0].payment_amount; 
                }
       }


     return resolve(totalAmount)


  })
}

const participantCount = async (req, res) => {
  try {
    
    const eventArray = await db.sequelize.query(query.getActiveEventId, {
      type: QueryTypes.SELECT,
    });

    if(eventArray.length === 0){
      return res.status(400).send("unable to fetch dashboard data since there is no active event")
    }

    const event_id = eventArray[0]?.event_id

    //get all registrant who are logged in
    const registrants = await db.sequelize.query(query.registrant, {
      replacements: [event_id],
      type: QueryTypes.SELECT,
    });

    // over all registrant count
    // const total_whole_registrant_count = await db.sequelize.query(
    //   query.totalWholeRegistrantCountbyAddressType,
    //   {
    //     type: QueryTypes.SELECT,
    //   }
    // );

    // const paidRegistrant = await paidRegistrantsCount(event_id);

    // const whole_Corpregistrant_count = await db.sequelize.query(
    //   query.getCorporateRegistrantCount,
    //   {
    //     type: QueryTypes.SELECT,
    //   }
    // );

    const total_whole_registrant_count = await db.sequelize.query(query.overAllRegistrantsCount,{
      type:QueryTypes.SELECT
    });
    const paidRegistrant = await db.sequelize.query(query.overAllPaidRegistrantCount,{
      replacements:[event_id],
      type:QueryTypes.SELECT
    });
    const whole_Corpregistrant_count = await db.sequelize.query(query.getCorporateRegistrantCount,{
      replacements:[event_id],
      type:QueryTypes.SELECT
    })
    const totalParticipants = {
      ...total_whole_registrant_count[0],
      ...paidRegistrant[0],
      ...whole_Corpregistrant_count[0],
    };

    //over all runner count by address

    const total_address_runner_count = await db.sequelize.query(
      query.totalRunnerCountbyAddressType,
      {
        replacements:[event_id],
        type: QueryTypes.SELECT,
      }
    );
    //corporate runners

    const corpRunCount = await db.sequelize.query(query.corpRunCount, {
      replacements: [event_id],
      type: QueryTypes.SELECT,
    });
    total_address_runner_count[0].total_runner_count = String(parseInt(total_address_runner_count[0].total_runner_count)+parseInt(corpRunCount[0].toal_corp_runner_count))
    let totalRunnerCount = {
      ...total_address_runner_count[0],
      ...corpRunCount[0],
    };

    // if (total_address_runner_count) {

    //   res.status(200).json(total_address_runner_count)
    // } else {
    //   throw new Error("Database error")

    // }

    //total runner count
    const registrant = await db.sequelize.query(query.paidRegistrant, {
      replacements: [event_id],
      type: QueryTypes.SELECT,
    });
    // console.log(totalReg);
    let run_count = 0;
    // if (registrant.length > 0) {
    //   for (let i = 0; i < registrant.length; i++) {
    //     // const villaCount = await db.sequelize.query(query.villaParticipant  , {replacements:[event_id], type:QueryTypes.SELECT});
    //     const result = await db.sequelize.query(query.runnerCountAsOfOrderId, {
    //       replacements: [registrant[i].booking_id_ref],
    //       type: QueryTypes.SELECT,
    //     });
    //     run_count += +result[0].runner_count;
    //     // console.log(run_count);
    //   }
    // }

    //console.log("line51: ", corpRunCount);
    // const totalParticipant =
    //   run_count + Number(corpRunCount[0].runner_count);

    // const villaParticipant = await getVillaPartCount(registrant);
    // //console.log(villaParticipant);
    // const towerParticipsnt = await getTowerPartCount(registrant);
    // const totalRunners = await db.sequelize.query(query.totalRunner, {
    //   replacements: [event_id],
    //   type: QueryTypes.SELECT,
    // });
    const corpCount = await db.sequelize.query(query.sponsorlist, {
      replacements: [event_id],
      type: QueryTypes.SELECT,
    });

    //runCategory count

    let regInfo = [];

    // const regType = await db.sequelize.query(query.registrantType, {
    //   type: QueryTypes.SELECT,
    // });

    // for (let i = 0; i < registrant.length; i++) {
    //   // const data = await db.sequelize.query(query.regDetails, {
    //   //   replacements: [registrant[i].registrant_id_ref],
    //   //   type: QueryTypes.SELECT,
    //   // });
    //   const data = await db.sequelize.query(query.typeInBooking, {
    //     replacements: [registrant[i].booking_id_ref],
    //     type: QueryTypes,
    //   });
    //   let obj = { ...registrant[i], ...data[0] };
    //   regInfo.push(obj);
    // }

    // // console.log(regInfo);
    const corpRunner = await db.sequelize.query(query.corpRunnerCount, {
      replacements: [event_id],
      type: QueryTypes.SELECT,
    });
    let corpRun = { corporate_runner: Number(corpRunner[0].corp_runner) };

    // const runnerCount = await runnerCategory(regType, regInfo);
    const runnerCount = await db.sequelize.query(query.runnerCoutCategorical,{
      replacements:[event_id],
      type:QueryTypes.SELECT
    });
    const donate = await db.sequelize.query(query.donateRunner,{
      replacements:[event_id],
      type:QueryTypes.SELECT
    });
    let result = { ...runnerCount[0],...donate[0],...corpRun };

    // address count

    let phase_1 = 0;
    let phase_2 = 0;
    let phase_3 = 0;
    let tower_1 = 0;
    let tower_2 = 0;
    let tower_3 = 0;
    let tower_4 = 0;
    let tower_5 = 0;
    let tower_6 = 0;
    let tower_7 = 0;

    for (let i = 0; i < registrant.length; i++) {
      //console.log("line365: ", registrant.length);
      const regInfo = await db.sequelize.query(query.villaPhaseReg, {
        replacements: [registrant[i].registrant_id_ref, "1"],
      });
      //console.log("line369: ", regInfo[0].length);

      if (regInfo[0].length > 0) {
        const phase1 = await villaRunner(registrant[i].booking_id_ref);
        phase_1 += +phase1;
        // console.log("phase1: ", phase1);
      } else {
        const regInfo = await db.sequelize.query(query.villaPhaseReg, {
          replacements: [registrant[i].registrant_id_ref, "2"],
        });
        if (regInfo[0].length > 0) {
          const phase2 = await villaRunner(registrant[i].booking_id_ref);
          phase_2 += +phase2;

          //  console.log("phase2: ", phase2);
        } else {
          const regInfo = await db.sequelize.query(query.villaPhaseReg, {
            replacements: [registrant[i].registrant_id_ref, "3"],
          });
          if (regInfo[0].length > 0) {
            const phase3 = await villaRunner(registrant[i].booking_id_ref);
            phase_3 += +phase3;
            //console.log("phase3: ", phase3);
          } else {
            const regInfo = await db.sequelize.query(query.towerRegInfo, {
              replacements: [registrant[i].registrant_id_ref, "Tower 1"],
            });
            if (regInfo[0].length > 0) {
              const tower1 = await towerRunner(registrant[i].booking_id_ref);
              tower_1 += +tower1;
              // console.log("tower1: ", tower1);
            } else {
              const regInfo = await db.sequelize.query(query.towerRegInfo, {
                replacements: [registrant[i].registrant_id_ref, "Tower 2"],
              });
              if (regInfo[0].length > 0) {
                const tower2 = await towerRunner(registrant[i].booking_id_ref);
                tower_2 += +tower2;
                //console.log("tower2: ", tower2);
              } else {
                const regInfo = await db.sequelize.query(query.towerRegInfo, {
                  replacements: [registrant[i].registrant_id_ref, "Tower 3"],
                });
                if (regInfo[0].length > 0) {
                  const tower3 = await towerRunner(
                    registrant[i].booking_id_ref
                  );
                  tower_3 += +tower3;
                  // console.log("tower3: ", tower3);
                } else {
                  const regInfo = await db.sequelize.query(query.towerRegInfo, {
                    replacements: [registrant[i].registrant_id_ref, "Tower 4"],
                  });
                  if (regInfo[0].length > 0) {
                    const tower4 = await towerRunner(
                      registrant[i].booking_id_ref
                    );
                    tower_4 += +tower4;
                    //console.log("tower4: ", tower4);
                  } else {
                    const regInfo = await db.sequelize.query(
                      query.towerRegInfo,
                      {
                        replacements: [
                          registrant[i].registrant_id_ref,
                          "Tower 5",
                        ],
                      }
                    );
                    if (regInfo[0].length > 0) {
                      const tower5 = await towerRunner(
                        registrant[i].booking_id_ref
                      );

                      tower_5 += +tower5;
                      //  console.log("tower5: ", tower5);
                    } else {
                      const regInfo = await db.sequelize.query(
                        query.towerRegInfo,
                        {
                          replacements: [
                            registrant[i].registrant_id_ref,
                            "Tower 6",
                          ],
                        }
                      );
                      if (regInfo[0].length > 0) {
                        const tower6 = await towerRunner(
                          registrant[i].booking_id_ref
                        );

                        tower_6 += +tower6;
                        // console.log("tower6: ", tower6);
                      } else {
                        const regInfo = await db.sequelize.query(
                          query.towerRegInfo,
                          {
                            replacements: [
                              registrant[i].registrant_id_ref,
                              "Tower 7",
                            ],
                          }
                        );
                        if (regInfo[0].length > 0) {
                          const tower7 = await towerRunner(
                            registrant[i].booking_id_ref
                          );
                          tower_7 += +tower7;
                          //console.log("tower7: ", tower7);
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    let total_villa_runners = phase_1 + phase_2 + phase_3;

    let per1 = Number(((phase_1 / total_villa_runners) * 100).toFixed(2));
    //console.log(per1);
    let per2 = Number(((phase_2 / total_villa_runners) * 100).toFixed(2));
    let per3 = Number(((phase_3 / total_villa_runners) * 100).toFixed(2));



     // tower block count 
    const towerblockdet = await tower_block_details();
    const organizedtowerdet = await organizeBlocksByTower(towerblockdet);
    const towerblock_count = await db.sequelize.query(query.towerBlocksCount, {
      replacements:[event_id],
      type: QueryTypes.SELECT,
    });

        let towerResult =[];
    if (towerblock_count) {
      const result = await mergeArrays1(towerblock_count);
      const result2 =await mergeArrays2(result, organizedtowerdet)
      console.log("line 483: ",result);
      console.log("line 484: ",result2);
      if (result2) {
            towerResult=  towerResult.concat(result2);


             // console.log("line 489:", towerResult);
              
      }
    }




    res.status(200).json({
      participantCount: {
        registrant_count: totalParticipants,
        runner_count: totalRunnerCount,
        // tower_participants: towerParticipsnt,
        //total_runner: Number(totalRunners[0].run_count),
        corp_sponsor: corpCount.length,
      },
      runCatCount: result,
      addressCount: {
        villa: {
          phase1: phase_1,
          phase1_percentage: per1,
          phase2: phase_2,
          phase2_percentage: per2,
          phase3: phase_3,
          phase3_percentage: per3,
        },
         tower: 
         towerResult,
        // {
        //   tower1: tower_1,
        //   tower2: tower_2,
        //   tower3: tower_3,
        //   tower4: tower_4,
        //   tower5: tower_5,
        //   tower6: tower_6,
        //   tower7: tower_7,
        // },
      },
    });
  } catch (error) {
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
};

const getTowerPartCount = async (registrant) => {
  return new Promise(async (resolve, reject) => {
    //console.log(registrant);
    let reg_count = 0;
    let runner_count = 0;
    for (let i = 0; i < registrant.length; i++) {
      const result = await db.sequelize.query(query.towerReg, {
        replacements: [registrant[i].registrant_id_ref],
        type: QueryTypes.SELECT,
      });
      //console.log(result);
      reg_count += +result.length;
      if (result.length > 0) {
        const runCount = await db.sequelize.query(query.runnerCount, {
          replacements: [registrant[i].booking_id_ref],
          type: QueryTypes.SELECT,
        });

        runner_count += +runCount[0].villa_runner;
      }
    }
    let result = runner_count;
    return resolve(result);
  });
};

const getVillaPartCount = async (registrant) => {
  return new Promise(async (resolve, reject) => {
    //console.log(registrant);
    let reg_count = 0;
    let runner_count = 0;
    for (let i = 0; i < registrant.length; i++) {
      const result = await db.sequelize.query(query.villaReg, {
        replacements: [registrant[i].registrant_id_ref],
        type: QueryTypes.SELECT,
      });
      // console.log(result);
      reg_count += +result.length;
      if (result.length > 0) {
        const runCount = await db.sequelize.query(query.runnerCount, {
          replacements: [registrant[i].booking_id_ref],
          type: QueryTypes.SELECT,
        });

        runner_count += +runCount[0].villa_runner;
      }
    }
    let result = runner_count;
    return resolve(result);
  });
};

const raceCatCount = async (req, res) => {
  try {
    const event_id = req.params.event_id;

    const raceType = await db.sequelize.query(query.runTypeInfo, {
      type: QueryTypes.SELECT,
    });

    console.log(raceType);
    let count_1k = 0;
    let count_5k = 0;
    let count_10k = 0;
    for (let i = 0; i < raceType.length; i++) {
      if (raceType[i].race_type_name == "1k") {
        const runCount = await db.sequelize.query(query.raceRunCount, {
          replacements: [raceType[i].race_type_id, event_id],
          type: QueryTypes.SELECT,
        });
        count_1k += +runCount[0].run_count;
      } else {
        if (raceType[i].race_type_name == "5k") {
          const runCount = await db.sequelize.query(query.raceRunCount, {
            replacements: [raceType[i].race_type_id, event_id],
            type: QueryTypes.SELECT,
          });
          count_5k += +runCount[0].run_count;
        } else {
          if (raceType[i].race_type_name == "10k") {
            const runCount = await db.sequelize.query(query.raceRunCount, {
              replacements: [raceType[i].race_type_id, event_id],
              type: QueryTypes.SELECT,
            });
            count_10k += +runCount[0].run_count;
          }
        }
      }
    }

    res.status(200).json({
      runner_1k: count_1k,
      runner_5k: count_5k,
      runner_10k: count_10k,
    });
  } catch (error) {
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
};

const tshirtCount = async (req, res) => {
  try {
    const event_id = req.params.event_id;

    const s_size = await db.sequelize.query(query.tshirtCount, {
      replacements: [event_id, "s"],
      type: QueryTypes.SELECT,
    });
    console.log(s_size);
    let count_s = Number(s_size[0].shirt_count);

    const xxxl_size = await db.sequelize.query(query.tshirtCount, {
      replacements: [event_id, "xxxl"],
      type: QueryTypes.SELECT,
    });
    let count_xxxl = Number(xxxl_size[0].shirt_count);

    const xxl_size = await db.sequelize.query(query.tshirtCount, {
      replacements: [event_id, "xxl"],
      type: QueryTypes.SELECT,
    });
    let count_xxl = Number(xxl_size[0].shirt_count);

    const xl_size = await db.sequelize.query(query.tshirtCount, {
      replacements: [event_id, "xl"],
      type: QueryTypes.SELECT,
    });
    let count_xl = Number(xl_size[0].shirt_count);

    const l_size = await db.sequelize.query(query.tshirtCount, {
      replacements: [event_id, "l"],
      type: QueryTypes.SELECT,
    });
    let count_l = Number(l_size[0].shirt_count);

    const m_size = await db.sequelize.query(query.tshirtCount, {
      replacements: [event_id, "m"],
      type: QueryTypes.SELECT,
    });
    let count_m = Number(m_size[0].shirt_count);

    const xs_size = await db.sequelize.query(query.tshirtCount, {
      replacements: [event_id, "xs"],
      type: QueryTypes.SELECT,
    });
    let count_xs = Number(xs_size[0].shirt_count);

    res.status(200).json({
      xxxl_count: count_xxxl,
      xxl_count: count_xxl,
      xl_count: count_xl,
      l_count: count_l,
      s_count: count_s,
      xs_count: count_xs,
      m_count: count_m,
    });
  } catch (error) {
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
};

const genderCount = async (req, res) => {
  try {
    const event_id = req.params.event_id;

    const maleCount = await db.sequelize.query(query.genderCount, {
      replacements: ["male", event_id],
      type: QueryTypes.SELECT,
    });

    const femaleCount = await db.sequelize.query(query.genderCount, {
      replacements: ["female", event_id],
      type: QueryTypes.SELECT,
    });

    res.status(200).json({
      male_runner: Number(maleCount[0].gen_count),
      female_runner: Number(femaleCount[0].gen_count),
    });
  } catch (error) {
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
};

const runnerAgeCount = async (req, res) => {
  try {
    const event_id = req.params.event_id;

    const ageCat = await db.sequelize.query(query.ageCat, {
      type: QueryTypes.SELECT,
    });
    let result = [];
    let total = 0;
    for (let i = 0; i < ageCat.length; i++) {
      let runner_count = await db.sequelize.query(query.ageRunCount, {
        replacements: [event_id, ageCat[i].age_type_id],
      });
      let count = runner_count[0];
      //console.log(count);
      let obj = { ...ageCat[i], ...count[0] };
      result.push(obj);
      total += +Number(count[0].run_count);
      //console.log("line276: " ,  count[0].run_count);
    }
    let ageCount = [];
    if (result.length === ageCat.length) {
      for (let j = 0; j < result.length; j++) {
        let percentage = ((Number(result[j].run_count) / total) * 100).toFixed(
          2
        );
        // console.log(total);
        //console.log(Number(result[j].run_count));
        let age_per = { age_percentage: percentage };
        ageCount.push({ ...result[j], ...age_per });
      }
    }

    if (ageCat.length === ageCount.length) {
      res.status(200).json(ageCount);
    }
  } catch (error) {
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
};

const villaRunner = async (booking_id) => {
  return new Promise(async (resolve, reject) => {
    const data = await db.sequelize.query(query.villaRunner, {
      replacements: [booking_id],
      type: QueryTypes.SELECT,
    });

    return resolve(Number(data[0].villa_runner));
  });
};

const towerRunner = async (booking_id) => {
  return new Promise(async (resolve, reject) => {
    const data = await db.sequelize.query(query.towerRunner, {
      replacements: [booking_id],
      type: QueryTypes.SELECT,
    });
    console.log(data);
    return resolve(Number(data[0].tower_runner));
  });
};

const addressCount = async (req, res) => {
  try {
    const event_id = req.params.event_id;

    const registrant = await db.sequelize.query(query.paidRegistrant, {
      replacements: [event_id],
      type: QueryTypes.SELECT,
    });

    let phase_1 = 0;
    let phase_2 = 0;
    let phase_3 = 0;
    let tower_1 = 0;
    let tower_2 = 0;
    let tower_3 = 0;
    let tower_4 = 0;
    let tower_5 = 0;
    let tower_6 = 0;
    let tower_7 = 0;

    for (let i = 0; i < registrant.length; i++) {
      //console.log("line365: ", registrant.length);
      const regInfo = await db.sequelize.query(query.villaPhaseReg, {
        replacements: [registrant[i].registrant_id_ref, "phase 1"],
      });
      //console.log("line369: ", regInfo[0].length);

      if (regInfo[0].length > 0) {
        const phase1 = await villaRunner(registrant[i].booking_id_ref);
        phase_1 += +phase1;
        // console.log("phase1: ", phase1);
      } else {
        const regInfo = await db.sequelize.query(query.villaPhaseReg, {
          replacements: [registrant[i].registrant_id_ref, "phase 2"],
        });
        if (regInfo[0].length > 0) {
          const phase2 = await villaRunner(registrant[i].booking_id_ref);
          phase_2 += +phase2;

          //  console.log("phase2: ", phase2);
        } else {
          const regInfo = await db.sequelize.query(query.villaPhaseReg, {
            replacements: [registrant[i].registrant_id_ref, "phase 3"],
          });
          if (regInfo[0].length > 0) {
            const phase3 = await villaRunner(registrant[i].booking_id_ref);
            phase_3 += +phase3;
            //console.log("phase3: ", phase3);
          } else {
            const regInfo = await db.sequelize.query(query.towerRegInfo, {
              replacements: [registrant[i].registrant_id_ref, "Tower 1"],
            });
            if (regInfo[0].length > 0) {
              const tower1 = await towerRunner(registrant[i].booking_id_ref);
              tower_1 += +tower1;
              // console.log("tower1: ", tower1);
            } else {
              const regInfo = await db.sequelize.query(query.towerRegInfo, {
                replacements: [registrant[i].registrant_id_ref, "Tower 2"],
              });
              if (regInfo[0].length > 0) {
                const tower2 = await towerRunner(registrant[i].booking_id_ref);
                tower_2 += +tower2;
                //console.log("tower2: ", tower2);
              } else {
                const regInfo = await db.sequelize.query(query.towerRegInfo, {
                  replacements: [registrant[i].registrant_id_ref, "Tower 3"],
                });
                if (regInfo[0].length > 0) {
                  const tower3 = await towerRunner(
                    registrant[i].booking_id_ref
                  );
                  tower_3 += +tower3;
                  // console.log("tower3: ", tower3);
                } else {
                  const regInfo = await db.sequelize.query(query.towerRegInfo, {
                    replacements: [registrant[i].registrant_id_ref, "Tower 4"],
                  });
                  if (regInfo[0].length > 0) {
                    const tower4 = await towerRunner(
                      registrant[i].booking_id_ref
                    );
                    tower_4 += +tower4;
                    //console.log("tower4: ", tower4);
                  } else {
                    const regInfo = await db.sequelize.query(
                      query.towerRegInfo,
                      {
                        replacements: [
                          registrant[i].registrant_id_ref,
                          "Tower 5",
                        ],
                      }
                    );
                    if (regInfo[0].length > 0) {
                      const tower5 = await towerRunner(
                        registrant[i].booking_id_ref
                      );

                      tower_5 += +tower5;
                      //  console.log("tower5: ", tower5);
                    } else {
                      const regInfo = await db.sequelize.query(
                        query.towerRegInfo,
                        {
                          replacements: [
                            registrant[i].registrant_id_ref,
                            "Tower 6",
                          ],
                        }
                      );
                      if (regInfo[0].length > 0) {
                        const tower6 = await towerRunner(
                          registrant[i].booking_id_ref
                        );

                        tower_6 += +tower6;
                        // console.log("tower6: ", tower6);
                      } else {
                        const regInfo = await db.sequelize.query(
                          query.towerRegInfo,
                          {
                            replacements: [
                              registrant[i].registrant_id_ref,
                              "Tower 7",
                            ],
                          }
                        );
                        if (regInfo[0].length > 0) {
                          const tower7 = await towerRunner(
                            registrant[i].booking_id_ref
                          );
                          tower_7 += +tower7;
                          //console.log("tower7: ", tower7);
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    let total_villa_runners = phase_1 + phase_2 + phase_3;

    let per1 = Number((phase_1 / total_villa_runners) * 100).toFixed(2);
    //console.log(per1);
    let per2 = Number((phase_2 / total_villa_runners) * 100).toFixed(2);
    let per3 = Number((phase_3 / total_villa_runners) * 100).toFixed(2);

    res.status(200).json({
      villa: {
        phase1: phase_1,
        phase1_percentage: per1,
        phase2: phase_2,
        phase2_percentage: per2,
        phase3: phase_3,
        phase3_percentage: per3,
      },
      tower: {
        tower1: tower_1,
        tower2: tower_2,
        tower3: tower_3,
        tower4: tower_4,
        tower5: tower_5,
        tower6: tower_6,
        tower7: tower_7,
      },
    });
  } catch (error) {
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
};

const runCatCount = async (req, res) => {
  try {
    const event_id = req.params.event_id;

    let regInfo = [];
    const registrant = await db.sequelize.query(query.paidRegistrant, {
      replacements: [event_id],
      type: QueryTypes.SELECT,
    });

    const regType = await db.sequelize.query(query.registrantType, {
      type: QueryTypes.SELECT,
    });

    for (let i = 0; i < registrant.length; i++) {
      // const data = await db.sequelize.query(query.regDetails, {
      //   replacements: [registrant[i].registrant_id_ref],
      //   type: QueryTypes.SELECT,
      // });
      const data = await db.sequelize.query(query.typeInBooking, {
        replacements: [registrant[i].booking_id_ref],
        type: QueryTypes,
      });
      let obj = { ...registrant[i], ...data[0] };
      regInfo.push(obj);
    }

    // console.log(regInfo);
    const corpRunner = await db.sequelize.query(query.corpRunnerCount, {
      replacements: [event_id],
      type: QueryTypes.SELECT,
    });
    let corpRun = { corporate_runner: Number(corpRunner[0].corp_runner) };

    const runnerCount = await runnerCategory(regType, regInfo);
    let result = { ...runnerCount, ...corpRun };
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
};

const runnerCategory = async (regType, regInfo) => {
  return new Promise(async (resolve, reject) => {
    let marRunner = 0;
    let donorWithRunner = 0;
    let donate = 0;
    let c1 = 0;
    let c2 = 0;
    for (let i = 0; i < regInfo.length; i++) {
      for (let j = 0; j < regType.length; j++) {
        if (
          regType[j].type_name === "marathon runners" &&
          regType[j].type_id === regInfo[i].registrant_type_ref
        ) {
          let booking_id = regInfo[i].booking_id_ref;
          let runnerCount = await db.sequelize.query(query.runCount, {
            replacements: [booking_id],
            type: QueryTypes.SELECT,
          });
          marRunner += +runnerCount[0].runner_count;
          c1++;
        } else {
          if (
            regType[j].type_name === "donors with runners" &&
            regType[j].type_id === regInfo[i].registrant_type_ref
          ) {
            let booking_id = regInfo[i].booking_id_ref;
            let runnerCount = await db.sequelize.query(query.runCount, {
              replacements: [booking_id],
              type: QueryTypes.SELECT,
            });
            donorWithRunner += +runnerCount[0].runner_count;
            c2++;
          } else {
            if (
              regType[j].type_name === "donate" &&
              regType[j].type_id === regInfo[i].registrant_type_ref
            )
              donate++;
          }
        }
      }
    }
    let maRun = marRunner //+ c1; commented by Rishi on 7/3/24
    let doWithRun = donorWithRunner //+ c2; commented by Rishi on 7/3/24

    return resolve({
      marathon_runner: maRun,
      donor_with_runner: doWithRun,
      donate: donate,
    });
  });
};

const totalAmount = async (req, res) => {
  try {
    const event_id = req.params.event_id;

    //general registration amount
    const regAmount = await db.sequelize.query(query.totalAmount, {
      replacements: [event_id],
      type: QueryTypes.SELECT,
    });

    //sponsorship amount
    const sponsorshipAmount = await db.sequelize.query(
      query.totalSponsorAmount,
      { replacements: [event_id], type: QueryTypes.SELECT }
    );

    console.log(regAmount);
    console.log(sponsorshipAmount);
    const amount = Number(regAmount[0].sum) + Number(sponsorshipAmount[0].sum);

    res.status(200).json({ amount: amount });
  } catch (error) {
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
};

//----------------laksh-----------------------------------------
// const total_Whole_Registrant_Count_by_Address_Type = async (req, res) => {
//   try {
//     const total_whole_registrant_count = await db.sequelize.query(query.totalWholeRegistrantCountbyAddressType, {
//       type: QueryTypes.SELECT,
//     });
//     if (total_whole_registrant_count) {
//       console.log(total_whole_registrant_count);
//       res.status(200).json(total_whole_registrant_count)
//     } else {
//       throw new Error("Database error")

//     }

//   } catch (error) {
//     res.status(400).json({
//       error_msg: error.message,
//       stack_trace: error.stack,
//       error_obj: error
//     })
//   }

// }

const total_Runner_Count_by_AddressType = async (req, res) => {
  try {
    const total_address_runner_count = await db.sequelize.query(
      query.totalRunnerCountbyAddressType,
      {
        type: QueryTypes.SELECT,
      }
    );
    if (total_address_runner_count) {
      res.status(200).json(total_address_runner_count);
    } else {
      throw new Error("Database error");
    }
  } catch (error) {
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
};
const tower_block_details = async () => {
  return new Promise((resolve, reject) => {
    try {
      const towerblockdetails = db.sequelize.query(
        query.totalTowerBlockDetails,
        {
          type: QueryTypes.SELECT,
        }
      );
      if (towerblockdetails) {
        return resolve(towerblockdetails);
      } else {
        return reject(new Error("database error"));
      }
    } catch (error) {
      reject(error);
    }
  });
};

function mergeArrays1(towerBlockCounts) {
  // Merge the arrays based on tower_no and tower_block_no
  const mergedArray = towerBlockCounts.map(item => ({
    tower_no: item.tower_number,
    block_no: item.block_number,
    count: parseInt(item.block_count)
  }));

  // Group the merged array by tower_no
  const groupedByTower = mergedArray.reduce((result, item) => {
    // Adjusting tower naming and starting from tower_1
    const key = `tower_${parseInt(item.tower_no.replace(/\D/g, '')) || 1}`;
    result[key] = result[key] || [];
    result[key].push({
      block: item.block_no,
      count: item.count
    });
    return result;
  }, {});

  // Convert the grouped object to the desired format
  const output = Object.keys(groupedByTower).reduce((result, key) => {
    result[key] = groupedByTower[key];
    return result;
  }, {});

  return output;
}
function mergeArrays2(input1, input2) {

  const merged = {};

  // Merge input1 and input2
  for (const [towerName, blocks] of Object.entries(input1)) {
    merged[towerName] = blocks.map(({ block, count }) => ({
      block,
      count: count || 0,
    }));
  }

  // Include blocks from input2 not present in input1
  for (const [towerName, blocks] of Object.entries(input2)) {
    if (!merged[towerName]) {
      merged[towerName] = blocks.map(({ block, count }) => ({ block, count: count || 0 }));
    } else {
      blocks.forEach(({ block, count }) => {
        const existingBlock = merged[towerName].find(item => item.block === block);
        if (existingBlock) {
          existingBlock.count =
            input1[towerName]?.find(b => b.block.toLowerCase() === block.toLowerCase())?.count || count || 0;
        } else {
          merged[towerName].push({
            block,
            count:
              input1[towerName]?.find(b => b.block.toLowerCase() === block.toLowerCase())?.count || count || 0,
          });
        }
      });
    }
  }

  return merged;
}

async function organizeBlocksByTower(blockData) {

  const towerData = {};

  blockData.forEach(({ block_number, tower_name }) => {
    if (!towerData[tower_name]) {
      towerData[tower_name] = {};
    }

    if (!towerData[tower_name][block_number]) {
      towerData[tower_name][block_number] = 0;
    }

    towerData[tower_name][block_number]++;
  });

  const resultObject = Object.entries(towerData).reduce((acc, [tower_name, blockCounts]) => {
    acc[tower_name] = Object.entries(blockCounts).map(([block, count]) => ({ block, count: 0 }));
    return acc;
  }, {});

  return resultObject;
}


const tower_Blocks_Count = async (req, res) => {

  try {
    const towerblockdet = await tower_block_details();
    const organizedtowerdet = await organizeBlocksByTower(towerblockdet);
    const towerblock_count = await db.sequelize.query(query.towerBlocksCount, {
      type: QueryTypes.SELECT,
    });
    if (towerblock_count) {
      const result = mergeArrays1(towerblock_count);
      const result2 = mergeArrays2(result, organizedtowerdet)
      if (result) {
        res.status(200).json(result2)
      } else {
        throw new Error("problem in merging details")
      }


    } else {
      throw new Error("Database error")

    }

  } catch (error) {
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error
    })
  }

}
//---------------------------laksh-----------------------------------

const total_Whole_Registrant_Count_by_Address_Type = async (req, res) => {
  try {
    const total_whole_registrant_count = await db.sequelize.query(
      query.totalWholeRegistrantCountbyAddressType,
      {
        type: QueryTypes.SELECT,
      }
    );
    if (total_whole_registrant_count) {
      console.log(total_whole_registrant_count);
      res.status(200).json(total_whole_registrant_count);
    } else {
      throw new Error("Database error");
    }
  } catch (error) {
    res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
};

const paidRegistrantsCount = async (eventid) => {
  return new Promise(async (resolve, reject) => {
    const getAllReg = await db.sequelize.query(query.getRegistrants, {
      type: QueryTypes.SELECT,
    });
    let villa = 0;
    let tower = 0;
    let others = 0;

    let paidReg = 0;

    if (getAllReg.length > 0) {
      for (let i = 0; i < getAllReg.length; i++) {
        const checkPayment = await db.sequelize.query(query.paymentStatus, {
          replacements: [getAllReg[i].registrant_id, eventid],
          type: QueryTypes.SELECT,
        });
        console.log(checkPayment);
        if (checkPayment.length > 0) {
          paidReg = paidReg + 1;
          console.log(paidReg);
          if (getAllReg[i].address_type === "villa") {
            villa = villa + 1;
          } else if (getAllReg[i].address_type === "tower") {
            tower = tower + 1;
          } else if (getAllReg[i].address_type === "others") {
            others = others + 1;
          }
        }
      }
      console.log(
        `totl: ${paidReg}, villa ${villa}, tower: ${tower}, others: ${others}`
      );

      return resolve({
        total_paid_regstrant: paidReg,
        total_paid_villa_registrant: villa,
        total_paid_tower_registrant: tower,
        total_paid_other_registrant: others,
      });
    } else {
      return resolve({
        total_paid_regstrant: 0,
        total_paid_villa_registrant: 0,
        total_paid_tower_registrant: 0,
        total_paid_other_registrant: 0,
      });
    }
  });
};

const getDashBoard = async (req, res) => {
  try{

    const eventArray = await db.sequelize.query(query.getActiveEventId, {
      type: QueryTypes.SELECT,
    });

    if(eventArray.length === 0){
      return res.status(400).send("No active event found")
    }

    const event_id = eventArray[0]?.event_id;

    // get sponsors list
    const sponsorList = await db.sequelize.query(query.sponsorlist, {
      replacements: [event_id],
      type: QueryTypes.SELECT,
    });

    //t-shirt count and runner 1k, 5k, 10k count, male, female count
    const [counts] = await db.sequelize.query(query.getTshirtCountByEventId, {
      replacements: [event_id],
      type: QueryTypes.SELECT,
    });

    //runner age count
    const runnerByAgeCategory = await db.sequelize.query(query.getRunnerCountByAge, {
      replacements: [event_id, event_id],
      type: QueryTypes.SELECT,
    });

    const ageCount = runnerByAgeCategory.map(item => ({ ...item, age_percentage: ((item.run_count / item.total) * 100).toFixed(2)}))

    // total sponsor amount
    const [sponsorAmount] = await db.sequelize.query(
      query.totalSponsorAmount,
      { replacements: [event_id], type: QueryTypes.SELECT }
    );

    // total amount by registration
    const [total_amount_by_registration] = await db.sequelize.query(
      query.getTotalAmountFromRegistration,
      { replacements: [event_id], type: QueryTypes.SELECT }
    );

    

    // total registrant counts
    const [ total_registrant_count ] = await db.sequelize.query(query.overAllRegistrantsCount,{
      type:QueryTypes.SELECT
    });

    //total paid registrants count
    const [ total_paid_registrant_count ] = await db.sequelize.query(query.overAllPaidRegistrantCount,{
      replacements:[event_id],
      type:QueryTypes.SELECT
    });

    //total runner count
    const [ total_runner_count ] = await db.sequelize.query(query.totalRunnerCount,{
      replacements:[event_id],
      type:QueryTypes.SELECT
    });

    // runner count by category
    const [ runner_count_by_category ] = await db.sequelize.query(query.getRunnerCountByCategory,{
      replacements:[event_id],
      type:QueryTypes.SELECT
    });

    // donate runner count
    const [ donate_runners ] = await db.sequelize.query(query.donateRunner,{
      replacements:[event_id],
      type:QueryTypes.SELECT
    });

    // villa graph
    const [ runners_by_villa_count ] = await db.sequelize.query(query.getVillaCountGraph,{
      replacements:[event_id],
      type:QueryTypes.SELECT
    });

    const villa_graph_obj = {
      phase1: runners_by_villa_count?.phase1_count,
      phase1_percentage: (runners_by_villa_count?.phase1_count / runners_by_villa_count?.total_villa_count * 100).toFixed(2),
      phase2: runners_by_villa_count?.phase2_count,
      phase2_percentage: (runners_by_villa_count?.phase2_count / runners_by_villa_count?.total_villa_count * 100).toFixed(2),
      phase3: runners_by_villa_count?.phase3_count,
      phase3_percentage: (runners_by_villa_count?.phase3_count / runners_by_villa_count?.total_villa_count * 100).toFixed(2),
    }

    // let phase_1 = 0;
    // let phase_2 = 0;
    // let phase_3 = 0;
    // let tower_1 = 0;
    // let tower_2 = 0;
    // let tower_3 = 0;
    // let tower_4 = 0;
    // let tower_5 = 0;
    // let tower_6 = 0;
    // let tower_7 = 0;

    // for (let i = 0; i < registrant.length; i++) {
    //   //console.log("line365: ", registrant.length);
    //   const regInfo = await db.sequelize.query(query.villaPhaseReg, {
    //     replacements: [registrant[i].registrant_id_ref, "1"],
    //   });
    //   //console.log("line369: ", regInfo[0].length);

    //   if (regInfo[0].length > 0) {
    //     const phase1 = await villaRunner(registrant[i].booking_id_ref);
    //     phase_1 += +phase1;
    //     // console.log("phase1: ", phase1);
    //   } else {
    //     const regInfo = await db.sequelize.query(query.villaPhaseReg, {
    //       replacements: [registrant[i].registrant_id_ref, "2"],
    //     });
    //     if (regInfo[0].length > 0) {
    //       const phase2 = await villaRunner(registrant[i].booking_id_ref);
    //       phase_2 += +phase2;

    //       //  console.log("phase2: ", phase2);
    //     } else {
    //       const regInfo = await db.sequelize.query(query.villaPhaseReg, {
    //         replacements: [registrant[i].registrant_id_ref, "3"],
    //       });
    //       if (regInfo[0].length > 0) {
    //         const phase3 = await villaRunner(registrant[i].booking_id_ref);
    //         phase_3 += +phase3;
    //         //console.log("phase3: ", phase3);
    //       } else {
    //         const regInfo = await db.sequelize.query(query.towerRegInfo, {
    //           replacements: [registrant[i].registrant_id_ref, "Tower 1"],
    //         });
    //         if (regInfo[0].length > 0) {
    //           const tower1 = await towerRunner(registrant[i].booking_id_ref);
    //           tower_1 += +tower1;
    //           // console.log("tower1: ", tower1);
    //         } else {
    //           const regInfo = await db.sequelize.query(query.towerRegInfo, {
    //             replacements: [registrant[i].registrant_id_ref, "Tower 2"],
    //           });
    //           if (regInfo[0].length > 0) {
    //             const tower2 = await towerRunner(registrant[i].booking_id_ref);
    //             tower_2 += +tower2;
    //             //console.log("tower2: ", tower2);
    //           } else {
    //             const regInfo = await db.sequelize.query(query.towerRegInfo, {
    //               replacements: [registrant[i].registrant_id_ref, "Tower 3"],
    //             });
    //             if (regInfo[0].length > 0) {
    //               const tower3 = await towerRunner(
    //                 registrant[i].booking_id_ref
    //               );
    //               tower_3 += +tower3;
    //               // console.log("tower3: ", tower3);
    //             } else {
    //               const regInfo = await db.sequelize.query(query.towerRegInfo, {
    //                 replacements: [registrant[i].registrant_id_ref, "Tower 4"],
    //               });
    //               if (regInfo[0].length > 0) {
    //                 const tower4 = await towerRunner(
    //                   registrant[i].booking_id_ref
    //                 );
    //                 tower_4 += +tower4;
    //                 //console.log("tower4: ", tower4);
    //               } else {
    //                 const regInfo = await db.sequelize.query(
    //                   query.towerRegInfo,
    //                   {
    //                     replacements: [
    //                       registrant[i].registrant_id_ref,
    //                       "Tower 5",
    //                     ],
    //                   }
    //                 );
    //                 if (regInfo[0].length > 0) {
    //                   const tower5 = await towerRunner(
    //                     registrant[i].booking_id_ref
    //                   );

    //                   tower_5 += +tower5;
    //                   //  console.log("tower5: ", tower5);
    //                 } else {
    //                   const regInfo = await db.sequelize.query(
    //                     query.towerRegInfo,
    //                     {
    //                       replacements: [
    //                         registrant[i].registrant_id_ref,
    //                         "Tower 6",
    //                       ],
    //                     }
    //                   );
    //                   if (regInfo[0].length > 0) {
    //                     const tower6 = await towerRunner(
    //                       registrant[i].booking_id_ref
    //                     );

    //                     tower_6 += +tower6;
    //                     // console.log("tower6: ", tower6);
    //                   } else {
    //                     const regInfo = await db.sequelize.query(
    //                       query.towerRegInfo,
    //                       {
    //                         replacements: [
    //                           registrant[i].registrant_id_ref,
    //                           "Tower 7",
    //                         ],
    //                       }
    //                     );
    //                     if (regInfo[0].length > 0) {
    //                       const tower7 = await towerRunner(
    //                         registrant[i].booking_id_ref
    //                       );
    //                       tower_7 += +tower7;
    //                       //console.log("tower7: ", tower7);
    //                     }
    //                   }
    //                 }
    //               }
    //             }
    //           }
    //         }
    //       }
    //     }
    //   }
    // }
    // let total_villa_runners = phase_1 + phase_2 + phase_3;

    // let per1 = Number(((phase_1 / total_villa_runners) * 100).toFixed(2));
    // let per2 = Number(((phase_2 / total_villa_runners) * 100).toFixed(2));
    // let per3 = Number(((phase_3 / total_villa_runners) * 100).toFixed(2));



     // tower block count 
    const towerblockdet = await tower_block_details();
    const organizedtowerdet = await organizeBlocksByTower(towerblockdet);

    const towerblock_count = await db.sequelize.query(query.getTowerBlockCount, {
      replacements:[event_id],
      type: QueryTypes.SELECT,
    });

    console.log(towerblock_count)

    let towerResult =[];
    if (towerblock_count) {
      const result = mergeArrays1(towerblock_count);
      console.log(result)
      const result2 = mergeArrays2(result, organizedtowerdet)
      if (result2) {
        towerResult=  towerResult.concat(result2);     
      }
    }

    res.status(200).json({
      sponsorList,
      counts,
      ageCount,
      totalAmount: total_amount_by_registration?.total_amount,
      sponsorAmount: sponsorAmount?.total_sponsor_amount,
      participantCount: {
        registrant_count: { ...total_registrant_count, ...total_paid_registrant_count },
        corp_sponsor: sponsorList.length,
        runner_count: total_runner_count,
      },
      runCatCount: { ...runner_count_by_category, ...donate_runners },
      addressCount: {
        villa: villa_graph_obj,
        tower: towerResult,
      },
    });

  }catch(error){
    return res.status(400).json({
      error_msg: error.message,
      stack_trace: error.stack,
      error_obj: error,
    });
  }
}

module.exports = {
  totalAmount,
  sponsorList,
  participantCount,
  raceCatCount,
  tshirtCount,
  genderCount,
  runnerAgeCount,
  addressCount,
  runCatCount,
  //laksh
  total_Runner_Count_by_AddressType,
  total_Whole_Registrant_Count_by_Address_Type,
  tower_Blocks_Count,
  //laksh
  getDashBoard, // ram
};
