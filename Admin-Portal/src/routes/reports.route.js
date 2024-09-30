const { Router } = require('express');
const controller = require("../controllers/reports.controller");

const router = Router();

router.get("/all/:event_id/:report_type", controller.reports);
router.post("/add/download/history", controller.downloadData);
router.get("/get/download/history", controller.downloadHistory)
//-----------------------laksh-------------------------
router.get("/get/bibcollection/report", controller.getBiB_collection_report);
//-----------------------laksh-------------------------


module.exports = router;