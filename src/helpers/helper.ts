import { resolve, dirname } from "path";
import { existsSync } from "fs";

import moment = require("moment");
import "moment/locale/th";

/**
 * @external
 * @module helper
 */

export const CheckIsExist = (value: string | undefined | null) => {
  return value !== undefined && value !== null && value !== "" && value !== "null" && value !== "undefined";
};

export const CheckIsNumber = (v: string) => {
  return v.match(/^\d+$/) !== null;
};

export const MakeReadableNumberArray = (array: Array<string>) => {
  let result = array[0];

  // should already sorted
  let cont = false;
  let dash = false;
  for (let i = 0; i < array.length; i++) {
    const current = parseInt(array[i]);
    if (isNaN(current)) return array.toString();
    if (i + 1 < array.length) {
      const next = parseInt(array[i + 1]);
      cont = current + 1 == next;
      if (cont && !dash) {
        result += "-";
        dash = true;
        continue;
      } else if (!cont) {
        if (dash) {
          result += array[i];
          dash = false;
        }
        result += `, ${next}`;
        cont = false;
        continue;
      }
    } else {
      if (cont) {
        result += current;
      }
    }
  }

  return result;
};

export const TrimString = (obj: any | undefined | null) => {
  if (!CheckIsExist(obj)) return "";
  const str: string = obj.toString();
  if (str) return str.trim();
  return "";
};

export const CheckIsPathExist = (pathname: any) => {
  if (!CheckIsExist(pathname)) return false;
  let exist = existsSync(pathname.toString());
  return exist;
};

export const CheckIsBoolean = (obj: any) => {
  if (!CheckIsExist(obj)) return false;
  return obj === "true" || obj === true || obj === "false" || obj === false;
};

export const FormatMomentDateTime = (value: string, format: string) => {
  moment.locale("th");
  return moment(value, format).subtract(43, "year");
};

export const Timestamp = (date: moment.Moment | undefined) => {
  return date && date.format("X");
};
