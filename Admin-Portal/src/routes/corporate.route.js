const { Router } = require('express');
const controller = require("../controllers/corporate.controller");

const router = Router();


router.post("/participants", controller.corParticipantsList);
router.post("/add/corp/sponsor", controller.addCorpSponsor);
router.post("/validate/corp/code", controller.corpCodeValidation)


module.exports = router;