const { Router } = require('express');
const controller = require("../controllers/adminlogin.controller.js");

const router = Router();

router.post("/create/table", controller.createAdminTable);
router.post("/create/table1", controller.createRegistrantTable);
router.post("/create/table2", controller.createRunnerTable);
router.post("/create/table3", controller.createEventTable);
router.post("/create/table4", controller.createPaymentTable);
router.post("/create/table5", controller.createRegistrantClassTable);
router.post("/create/table6", controller.createRegistrantTypeTable);
router.post("/create/table7", controller.createRegistrantSourceTable);
router.post("/create/table8", controller.createCardDetailsTable);
router.post("/create/table9", controller.createRaceCategoryTable);
router.post("/create/table10", controller.createTicketTypeTable);
router.post("/create/table11", controller.createAgeCategoryTable)

router.post("/signin", controller.adminLogin);
router.get("/access/token", controller.generateToken);
router.post("/update/admin", controller.updateAdminInfo);
router.post("/create/admin", controller.createAdmin);
router.get("/inactivate/admin/:admin_id", controller.inactivateAdmin);
router.get("/activate/admin/:admin_id", controller.activateAdmin);
router.put("/drop/admin/:admin_id", controller.dropAdmin)

router.post("/forgot/password", controller.forgotPassword);
router.post("/reset/password/:email_id/:token", controller.resetPassword);
router.get("/details/:admin_id", controller.getAdmin);
router.get("/get/all/admin", controller.getAllAdmin);
router.put("/edit/profile/pic", controller.editProfilePic)

module.exports = router;