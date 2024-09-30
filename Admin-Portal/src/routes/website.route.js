const { Router } = require('express');
const controller = require("../controllers/website.controller");

const router = Router();

router.get("/event/info", controller.eventDetails);
router.post("/contact/us", controller.contactUs)



module.exports = router;