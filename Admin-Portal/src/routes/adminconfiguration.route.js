const { Router } = require('express');
const controller = require("../controllers/adminconfiguration.controller");

const router = Router();


router.get("/get/event/details/:event_id", controller.geteventinfo);
router.get("/get/race/category", controller.getRaceCategoryinfo);
router.get("/get/registrant/class/:event_id", controller.getRegistrantClass);
router.get("/get/registrant/type", controller.getRegistrantType);
router.get("/get/registrant/source", controller.getRegistrantSource);
router.get("/get/ticket/type/:event_id", controller.getTicketType);

//router.post("/add/event", controller.createEvevntInfo);
// router.put("/edit/event", controller.updateEvent);       // commented by ram

router.post("/setup/event", controller.setUpEvent);
router.get("/events", controller.getEvents);
router.get("/data/for/event", controller.getDataForEvent);
router.get("/participants/list", controller.getParticipantsList);
router.get("/sponsors/list", controller.getCorpSponsorList);
router.put("/inactivate/event/:event_id", controller.inactiveEvent)
router.put("/activate/event/:event_id", controller.activateEvent)
//-----------------------laksh-----------------------
router.get("/get/all/registrants", controller.get_All_Registrants);
router.get("/get/all/donateregistrants", controller.get_All_Donate_Registrants);
//-----------------------laksh-----------------------

//-------------------Ram-----------------------------//
router.post("/create/event", controller.createEvent);
router.put("/edit/event/:event_id", controller.editEvent);
router.get("/get/event-data/:event_id", controller.getEventsData);

module.exports = router;