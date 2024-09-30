const { Router } = require("express");
const controller = require("../controllers/corpregistration.controller");
//const { authMiddeleware } = require("../middlewares/authmiddleware.js");
const router = Router();

router.get("/event/data", controller.getregistrantCategoryDetail);
router.post("/registration/data/runner", controller.dataForCorpRunnerReg);
router.post("/add/corp/registrant", controller.addCorpRegistrantInfo);
router.get("/registration/history/:registrant_id", controller.corpRegHistory)

module.exports = router;