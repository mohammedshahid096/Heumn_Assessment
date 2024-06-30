const { createLogger, format, transports } = require("winston");
const { combine, timestamp, json, splat } = format;

const logger = createLogger({
  level: "info",
  format: combine(timestamp(), json(), splat()),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "combined.log" }),
    new transports.File({ filename: "app-error.log", level: "error" }),
    new transports.File({ filename: "app-info.log", level: "info" }),
  ],
});

module.exports = logger;
