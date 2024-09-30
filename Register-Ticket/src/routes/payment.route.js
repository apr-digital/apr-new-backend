const { Router } = require('express');
const controller = require("../controllers/payment.controller");

const router = Router();


router.post("/initiate", controller.payment);
router.post("/redirect-url", controller.redirectUrl);
router.post("/callback-url", controller.callBackUrl);
router.post("/payment-status", controller.checkPaymentStatus);
router.get("/details/:registrant_id", controller.paymentHistory);
router.post("/check/payment", controller.checkInitiatePayment)
router.post("/confirmation/booking", controller.bookingConfirmation);

router.get("/invoice/data/:registrant_id/:order_id/:booking_id", controller.invoiceData);
router.get("/detail/for/admin", controller.payHisForAdmin)
router.get("/paystatus/:token", controller.getPayStatusByToken)

//Rishi

router.post("/initiate/ByAdmin", controller.paymentByAdmin);

module.exports = router;