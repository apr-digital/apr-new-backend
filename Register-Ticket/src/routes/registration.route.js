const { Router } = require('express');
const controller = require("../controllers/registration.controller");

const router = Router();

router.post("/add/registrant", controller.addRegistrantInfo);
router.put("/update/registrant", controller.updateRegistrantInfo);
router.delete("/remove/registrant/:registrant_id", controller.removeRegistrant);
router.get("/registrant/details/:registrant_id", controller.getRegistrantDetail);

router.post("/add/runner", controller.addRunners);
router.put("/update/runner", controller.updateRunnerInfo);
router.delete("/remove/runner/:runner_id", controller.removeRunner);
router.get("/runner/details/:runner_id", controller.getRunnerDetail);

router.get("/get/registrant/category/details", controller.getregistrantCategoryDetail)

router.get("/get/masterlist", controller.getMasterList);

router.get("/runners/data/:registrant_id", controller.getrunnerByRegistrant)
router.get("/corp/address/details", controller.dataForCorpSponsor)

router.post("/get/runner", controller.getRunnerForRegistrant)

router.post("/get/class/price", controller.getPricedetails);

router.post("/registration/data", controller.getDataForRegistration);

router.put("/add/registrant/web", controller.addRegistrantInfoWeb);

//router.put("/add/registrant/web1", controller.addRegistrantInfoWeb1);
router.post("/masterlist", controller.masterListApp);
router.post("/create/order", controller.createOrder);
router.get("/myschedule/data/:registrant_id", controller.mySchedule);
router.put("/update/user/profile", controller.editUserProfile);
router.put("/edit/user/pic", controller.updateRegProfilePic)
router.post("/verify/address", controller.verifyAddress);

//Rishi

router.put("/add/registrant/Admin/web", controller.addRegistrantInfoAdminWeb);
router.get("/get/Admin/Registrants",controller.getOnSpotAdminRegisteredDetails);
router.post("/search/registrant",controller.searchRegistrant);
router.post("/get/RegistrantData",controller.getRegistrantData);

//----------------suganthi-------------------
router.post("/old/runner/data", controller.fetchpreviousEventRunnerDetail)

//router.post("/payment", controller.payment)

//router.get("/bib", controller.increaseCount, controller.generateBib)
module.exports = router;
