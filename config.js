require("dotenv").config();
const config = {
  port: process.env.PORT || 4000,
  mongoURL: process.env.MONGODB_URL,
  jwtSecret: process.env.JWT_SECRET || "fallbackSecretKey",
};
module.exports = config;