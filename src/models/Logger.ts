import winston, { format } from "winston";

export default winston.createLogger({
  format: format.combine(format.colorize(), format.splat(), format.simple()),
  transports: [
    new winston.transports.Console({ level: "verbose" }),
    new winston.transports.File({ filename: "combined.log" })
  ]
});
