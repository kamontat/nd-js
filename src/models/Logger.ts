import { transports, format } from "winston";

type LogOption = {
  level: string;
};

export default (option: LogOption = { level: "info" }) => {
  return {
    format: format.combine(format.colorize(), format.splat(), format.simple()),
    transports: [new transports.Console({ level: option.level }), new transports.File({ filename: "combined.log" })]
  };
};
