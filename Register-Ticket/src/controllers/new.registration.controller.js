const db = require("../config/dbconfig");
const query = require("../models/new.registration.models");
const { sequelize } = require("sequelize");
const { QueryTypes } = require("sequelize");
const crypt = require("../middlewares/crypt");
var unirest = require("unirest");
const mail = require("../middlewares/mail");
const pushNotif = require("../middlewares/pushnotification");
const query1 = require("../models/registration.model")

const fetchEventData = async (req,res)=>{
  const {registrant_id, registrant_type_id} = req.body;
  
  const data = await db.sequelize.query(query.fetchEventData, {replacements:[registrant_id, registrant_type_id], type:QueryTypes.SELECT});
  //console.log(data);
    if(data[0] === null || undefined){
      res.status(400).json("no avtive event found")
    }else{
  const typeData = await db.sequelize.query(query.reg_type_data, {replacements:[data[0].event_id,registrant_type_id], type:QueryTypes.SELECT});
console.log(typeData);

  const towerData = await db.sequelize.query(query1.getTowerData, { type: QueryTypes.SELECT });

  const blockData = await blockDetails(towerData);
  //console.log(blockData);
                  let types =[];
                  for(const type of typeData)
                    {
                      types.push({category_id: type.category_id,
                      category_name: type.category_name,
                      category_price: type.category_price,
                      runners_allowed_count: type.runners_allowed_count})
                    }
         const responseData ={
                 event_id:data[0].event_id,
                 event_name:data[0].event_name ,
                 location:  data[0].event_location,
                 event_date: data[0].event_date ,
                 event_time: data[0].event_time,
                 registrant_data: 
                 {
                  first_name: data[0].first_name, 
                  last_name: data[0].last_name, 
                  email_id: data[0].email_id, 
                  mobile_number:data[0].mobile_number, 
                  emergency_contact_name:data[0].emergency_contact_name,
                  emergency_contact_number:data[0].emergency_contact_number, 
                  address_type:data[0].address_type,
                  villa_number:data[0].addr_villa_number, 
                  villa_lane_no:data[0].addr_villa_lane_no, 
                  villa_phase_no:data[0].addr_villa_phase_no,  
                  tower_no:data[0].addr_tower_no,                       
                  tower_block_no:data[0].addr_tower_block_no,
                  tower_flat_no:data[0].addr_tower_flat_no,  
                  external_address:data[0].external_address, 
                  city:data[0].city,
                  state:data[0].state, 
                  country:data[0].country,
                  pin_code:data[0].pin_code, 
                  current_stage:data[0].current_stage
                  },
                 tower_block: blockData,
                 registrant_type:{type_id:typeData[0].type_id,
                    type_name:typeData[0].type_name,
                    image:typeData[0].image_url,
                    category:types
                    },
         }

   res.status(200).json(responseData)
}
}


const blockDetails = async (towerData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const queryMap = {
        "Tower 1": query1.getBlock1,
        "Tower 2": query1.getBlock2,
        "Tower 3": query1.getBlock3,
        "Tower 4": query1.getBlock4,
        "Tower 5": query1.getBlock5,
        "Tower 6": query1.getBlock6,
        "Tower 7": query1.getBlock7,
      };

      const result = await Promise.all(
        towerData.map(async (tower) => {
          const query = queryMap[tower.tower_number];
          if (query) {
            const getBlock = await db.sequelize.query(query, {
              replacements: [],
              type: QueryTypes.SELECT,
            });
            return { ...tower, block: getBlock };
          }
          return tower;
        })
      );

      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
};


const addRegistrant = async(req,res)=>{
    const {registrant_id, emergency_number,emergency_name, resident_of_apr,address_type, 
        villa_number, villa_lane_no, villa_phase_no,tower_no, tower_block_no, tower_flat_no, external_address,city,
        state, country,pin_code, resitrant_type_id, registrant_class_id, runner_count, others_amount}=req.body;
 
        //get current-active event 
    const activeEvent =await db.sequelize.query(query.activeEvent, {type: QueryTypes.SELECT});
    
      if(activeEvent[0]){
        let regValue = [emergency_name, emergency_number, resident_of_apr, address_type, villa_number, villa_lane_no, villa_phase_no,tower_no, 
                        tower_block_no, tower_flat_no, external_address,city,state, country,pin_code,1, registrant_id];
       // let bookValue= [registrant_id,resitrant_type_id, registrant_class_id, runner_count, activeEvent[0].event_id];

    const Reg_result = await db.sequelize.query(query.updateRegistrant,{replacements:regValue, type:QueryTypes.UPDATE});
      
       if(Reg_result[1]===1){
    
             res.status(200).json({message:"Registrant details added",
                                   registrant_id:registrant_id,
                                   //booking_id: booking_result[0].booking_id,
                                   //others_amount:others_amount
             })

            }else{
                res.status(400).json("Registrant details are not added, please try again")
            }
        }else{
            res.status(400).json("No active event found")
        }
}

const addRunner = async (req,res)=>{

    const {registrant_id,registrant_type_id, registrant_class_id, runner_count, others_amount, runner_details} = req.body;

    const activeEvent =await db.sequelize.query(query.activeEvent, {type: QueryTypes.SELECT});
    
    if(activeEvent[0]){

      let bookValue= [registrant_id,registrant_type_id, registrant_class_id, runner_count, activeEvent[0].event_id];

      const [booking_result] = await db.sequelize.query(query.insertBooking, {replacements:bookValue, type:QueryTypes.INSERT})
      // if(booking[0]=== null || undefined){
            const address = await db.sequelize.query(query.getRegistrant, {replacements:[registrant_id], type:QueryTypes.SELECT})
         
            
          for (const runner of runner_details){

            if(runner.run_category_id === 15 && runner.age_category === 'kids (7-12)'){

              res.status(400).json("The runner belongs to kids category cannot participate in 10km run");
            }

            let insertValue = [runner.first_name,runner.last_name,registrant_id, runner.gender, runner.email_id, runner.phone_number,  runner.run_category_id, 
                              runner.t_shirt_size, activeEvent[0].event_id, booking_result[0].booking_id,runner.age_category,'runner', address[0].address_type, 
                              address[0].addr_villa_number,address[0].addr_villa_lane_no, address[0].addr_villa_phase_no, address[0].addr_tower_no,address[0].addr_tower_block_no, 
                              address[0].addr_tower_flat_no, address[0].external_address,address[0].city,address[0].state, address[0].country, address[0].pin_code];
        
            const runner_result = await db.sequelize.query(query.addRunner, {replacements:insertValue, type:QueryTypes.INSERT});
          }
           
            const stageCounter = await db.sequelize.query(query.updateStage, {replacements:[2,registrant_id], type:QueryTypes.UPDATE});
        
              res.status(200).json({message:"runner details added",
                                    others_amount:others_amount,
                                    booking_id:booking_result[0].booking_id})
            
            
    }else{

              res.status(400).json("No active event found")
         }

}

const createOrder = async (req,res)=>{
    const {others_amount, booking_id}=req.body;

    const [data] = await db.sequelize.query(query.bookingData, {replacements:[booking_id], type:QueryTypes.SELECT});
console.log(data);

    const stageCounter = await db.sequelize.query(query.updateStage, {replacements:[3,data.registrant_id_ref], type:QueryTypes.UPDATE});

    //if(data.order_id === null|| undefined){

    let key1 = await key();
    const orderId = `ACT0001${booking_id}${key1}`;

      let price = data.category_price;

      if(others_amount){
         price = others_amount
      }
      //console.log(price);
    
    let insertValue = [orderId, data.registrant_class_ref, data.event_id_ref, data.registrant_id_ref,data.runner_count, 
                       booking_id, data.billing_address, price];
                      
    const [order_result] = await db.sequelize.query(query.createOrder, {replacements:insertValue, type:QueryTypes.INSERT});

        res.status(200).json({message: "order created successfully",
                              address: data.billing_address,
                              order_id:orderId,
                              order_at:order_result[0].created_at,
                              order_amount: order_result[0].total_amount,
                              order_status:order_result[0].order_status
                             })

      // }else{

      //   res.status(200).json({message: "order created successfully",
      //                         address: data.billing_address,
      //                         order_id:data.order_id,
      //                         order_at:data.created_at,
      //                         order_amount: data.total_amount,
      //                         order_status:data.order_status
      //                        })
      // }
}
    

const  key = async () =>{
    return new Promise((resolve, reject) => {
      let length = 3,
        charset =
          "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        password = "";
      for (let j = 0, n = charset.length; j < length; ++j) {
        password += charset.charAt(Math.floor(Math.random() * n));
      }
      //console.log("password:", password);
      return resolve(password);
    });
}


module.exports={
addRegistrant,
addRunner,
createOrder,
addRunner,
fetchEventData
}