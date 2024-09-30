//--------------------code added by Rishi------------------------------------
const { Router } = require('express');
const controller = require("../controllers/communication.controller");
const router = Router();
router.post("/mail/getMails", controller.getEmails);
router.post("/sendNotification", controller.sendNotification);
router.post("/sendMail", controller.sendEmail);
router.post("/verifyEmails", controller.verifyEmails);
router.post("/notification", controller.notifToReg);
router.post("/reminder/notification", controller.notificationForRegistrant);
router.put("/update/status", controller.updateNotifReadStatus);
module.exports = router
//------------------------commented by suganthi-------------------------
// const { Router } = require('express');
// const controller = require("../controllers/communication.controller");
// const router = Router();
// router.post("/mail/registrant", controller.mailToRegistrant);
// router.post("/mail/corporate", controller.mailToCorporate);
// router.post("/notification", controller.notifToReg);
// router.post("/reminder/notification", controller.notificationForRegistrant);
// router.put("/update/status", controller.updateNotifReadStatus);
// module.exports = router