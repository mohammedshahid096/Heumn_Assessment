const mongoose = require("mongoose");
const logger = require("./applogger.config");

// TODO : function for database connection
const MongoDataBaseConn = async () => {
  logger.info("config - mongodb - start");
  try {
    await mongoose.connect(
      process.env.DEVELOPMENT_MODE === "production"
        ? process.env.DB_URL
        : process.env.DB_URL_DEV,
      {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
      }
    );
    console.log(process.env.DEVELOPMENT_MODE + " database is connected");
    logger.info(process.env.DEVELOPMENT_MODE + " database is connected");
  } catch (error) {
    logger.error(error.message, { error });
  }
};

module.exports = MongoDataBaseConn;
