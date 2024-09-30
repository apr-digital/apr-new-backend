const { Router } = require('express');
const controller = require("../controllers/reminder.controller");

const router = Router();


router.post("/schedule", controller.scheduleReminder);


module.exports = router;