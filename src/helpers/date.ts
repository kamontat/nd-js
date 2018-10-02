/**
 * @external
 * @module helper
 */

import moment = require("moment");
import "moment/locale/th";

export const FormatMomentDateTime = (value: string, format: string) => {
  moment.locale("th");
  return moment(value, format).subtract(43, "year");
};
