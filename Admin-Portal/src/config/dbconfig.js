const { Sequelize } = require("sequelize");


// const sequelize = new Sequelize(
//   "apr_prod_db",  //DB name
//   "postgres", //DB user name
//   "aprpostgres", //DB password
//   {
//     host: "159.89.161.233", //External host
//     dialect: "postgres",
//     dialectOptions: {
//       ssl: false // Disable SSL
//       // ssl: {
//       //   require: true,
//       //   rejectUnauthorized: false, // Accept self-signed certificates
//       // },
//     },
//   }
// );

// staging
const sequelize = new Sequelize(        
  "apr_test_db",  //DB name
  "postgres", //DB user name
  "aprpostgres", //DB password
  {
    host: "159.89.161.233", //External host
    dialect: "postgres",
    dialectOptions: {
      ssl: false // Disable SSL
      // ssl: {
      //   require: true,
      //   rejectUnauthorized: false, // Accept self-signed certificates
      // },
    },
  }
);

// testing
// const sequelize = new Sequelize(        
//   "testaprdb",  //DB name
//   "testaprdb_user", //DB user name
//   "qLc1wuNJlmxyBHsxRPHKhYFxy7Dbueb1", //DB password
//   {
//     host: "dpg-co76sued3nmc73e57ol0-a.singapore-postgres.render.com", //External host
//     dialect: "postgres",
//     dialectOptions: {
//       ssl: {
//         require: true,
//         rejectUnauthorized: false, // Accept self-signed certificates
//       },
//     },
//   }
// );

const testDb = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
testDb();


module.exports = { sequelize };
