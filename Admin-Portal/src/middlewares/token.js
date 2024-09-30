const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_KEY = "SFWERgjEYJSRATHafathrsr";
const JWT_REFRESH_KEY = "ABCDEFGHIJKLlkjihgfedcba";
//const JWT_RESET_KEY = "hrdsfdhBtthSGhzfdnfAsdt";

const tokenGenerator = (email) => {
  const token = jwt.sign({ email }, JWT_KEY, { expiresIn: "3 minute" });
  return token;
};

const refTokenGen = (email) => {
    const token = jwt.sign({ email }, JWT_REFRESH_KEY, { expiresIn: "10 minute" });
    return token;
  };

const reTokenValidator = async(token) => {
  try{
  const data = jwt.verify(token, JWT_REFRESH_KEY, { expiresIn: "10 minute" });
  return data;
  }catch(error){
    return error;
  }
};

const tokenValidator = (token) => {
  const data = jwt.verify(token, JWT_KEY, { expiresIn: "3 minute" });
  return data;
};

module.exports = {
  tokenGenerator,
  refTokenGen,
  tokenValidator,
  reTokenValidator,
};