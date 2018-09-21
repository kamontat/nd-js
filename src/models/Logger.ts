import { transports, format } from "winston";
import { LOGGER_LEVEL, COLOR } from "../constants/defaultConst";

type LogOption = {
  level: string;
  color: boolean;
};

// TODO: update logger
export default (option: LogOption = { level: LOGGER_LEVEL, color: COLOR }) => {
  let fs = [];
  if (option.color) fs.push(format.colorize());

  fs.push(format.splat(), format.simple());

  return {
    format: format.combine(...fs),
    transports: [new transports.Console({ level: option.level }), new transports.File({ filename: "combined.log" })]
  };
};

// TODO: Add colors using colors https://github.com/Marak/colors.js
