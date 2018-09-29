import { Moment } from "moment";
import moment = require("moment");

export const CheckIsExist = (value: string) => {
  return value !== undefined && value !== null && value !== "" && value !== "null" && value !== "undefined";
};

export const FormatMomentDateTime = (value: string, format: string) => {
  return moment(value, format).subtract(43, "year");
};
