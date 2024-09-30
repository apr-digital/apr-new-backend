const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_KEY = "FSWERgjKYJSRATHafathrsr";

const authMiddeleware = async (req, res, next) => {   //.startsWith("Bearer")
  if (req.headers.authorization) {
    let token = await req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        const verify = jwt.verify(token,JWT_KEY );
      }
      next();
    } catch (err) {
      res.status(400).json(err);
    }
  } else {
    res.status(200).json("No token attached");
  }
};

module.exports ={authMiddeleware};