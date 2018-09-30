import moment = require("moment");

export const FormatMomentDateTime = (value: string, format: string) => {
  return moment(value, format).subtract(43, "year");
};
