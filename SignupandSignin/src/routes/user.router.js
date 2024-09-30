const { Router } = require("express");
const controller = require("../controllers/user.controller.js");
const { authMiddeleware } = require("../middlewares/authmiddleware.js");
const session = require("express-session");
const passport = require("passport");
require("../middlewares/googleauth.js");

const router = Router();

router.post("/signup", controller.userSignup);

router.post("/existing/user/signup", controller.existingUserSignUp)
// router.post("/corp/user/signup", controller.corporateUserSignup);
// router.post("/corp/user/login", controller.corporateUserLogin);
router.post("/signin", controller.userLogin);
router.post("/access/token", controller.generateToken);
//router.get("/auth", authMiddeleware, controller.test);
router.post("/verify/otp", controller.verifyOtp);
router.post("/resend/otp", controller.resendOtp);
router.post("/verify/mobile", controller.mobileNoVerify)
router.put("/delete/account/:registrant_id", controller.deleteAccount)

//google signup integration routes
router.get("/", controller.signupUrl);
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/api/registrant/protected",
    failureRedirect: "/api/registrant/auth/google/failure",
  })
);
router.get("/protected", controller.isLoggedIn, controller.protected);
router.get("/profile", controller.profile);
router.get("/logout", controller.logOut);
router.get("/auth/google/failure", controller.authGoogleFailiuer);
router.post("/corp/sponsor/login", controller.corporateLogin)

router.post("/corp/sponsor/access/token", controller.generateTokenForSponsor )
router.post("/forgot/password", controller.forgotPassword);
router.post("/reset/password/:email_id/:token", controller.resetPassword)
router.post("/otp/verify/status", controller.checkOtpVerifyStatus);
router.post("/update/image", controller.updateProfileImage)

module.exports = router;
