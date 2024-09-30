const { Router } = require('express');
const controller = require("../controllers/dashboard.controller");

const router = Router();


router.get("/sponsor/list", controller.sponsorList);
router.get("/participant/count", controller.participantCount);
router.get("/race/category/count/:event_id", controller.raceCatCount);
router.get("/tshirt/count/:event_id", controller.tshirtCount);
router.get("/gender/count/:event_id", controller.genderCount);
router.get("/age/count/:event_id", controller.runnerAgeCount);
router.get("/address/count/:event_id", controller.addressCount);
router.get("/run/category/count/:event_id", controller.runCatCount);
router.get("/total/amount/:event_id", controller.totalAmount);
//-----------------------laksh-----------------------
router.get("/totalregistrantcount/addresstype", controller.total_Whole_Registrant_Count_by_Address_Type);
router.get("/totalrunnercount/addresstype", controller.total_Runner_Count_by_AddressType);
router.get("/towerblock/count", controller.tower_Blocks_Count);
//-----------------------laksh-----------------------

//------------------------ ram -------------------------// 
router.get("/", controller.getDashBoard);



module.exports = router;