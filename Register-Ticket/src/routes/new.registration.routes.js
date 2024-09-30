const { Router } = require('express');
const controller = require("../controllers/new.registration.controller");
const router = Router();


router.post("/stage1", controller.addRegistrant);
router.post("/order", controller.createOrder);
router.post("/add/runners", controller.addRunner);
router.get("/event/data",controller.fetchEventData)


module.exports=router;