/**
 * @external
 * @module helper
 */

import { existsSync } from "fs";
import moment, { isDate, isMoment } from "moment";

import "moment/locale/th";

/**
 * @public
 * @static
 * This method will check the input `string` not exist or not.
 * Definition of exist is
 * 1. NOT undefined
 * 2. NOT null
 * 3. NOT empty string
 * 4. NOT "undefined"
 * 5. NOT "null"
 *
 * @param value checking value
 */
export const CheckIsExist = (value: string | undefined | null) => {
  return value !== undefined && value !== null && value !== "" && value !== "null" && value !== "undefined";
};

/**
 * @public
 * @static
 *
 * This method for check is string 'contains only number' so negative number will not allow here.
 *
 * @param value checking string
 *
 * @return true, if input value contains only number
 */
export const CheckIsNumber = (value: string) => {
  if (!value) {
    return false;
  }
  return value.toString().match(/^\d+$/) !== null;
};

export const CheckIsEmail = (value: string) => {
  if (!value) {
    return false;
  }
  const str = value.toString();
  return (
    str.match(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    ) !== null
  );
};

/**
 * @public
 * @static
 * This will check is input string is valid path and files/folders exist (by {@link https://nodejs.org/api/fs.html#fs_fs_existssync_path|existsSync} method)
 * @param pathname string of path
 *
 * @return true, if input string is path
 */
export const CheckIsPathExist = (pathname: any) => {
  if (!CheckIsExist(pathname)) {
    return false;
  }
  const exist = existsSync(pathname.toString());
  return exist;
};

/**
 * @public
 * @static
 * This will change array of number to length of number if possible.
 *
 * @param array input array of string(number) or number
 *
 * @return string that make array of number more readable
 *
 * @example
 * Input: [1, 2, 3, 4]
 * Output: "1-4"
 *
 * Input: [1, 2, 6, 7, 8]
 * Output: "1-2, 6-8"
 *
 */
export const MakeReadableNumberArray = (array: string[]) => {
  // sort the array low - high
  array = array.sort((a, b) => {
    return parseInt(a) - parseInt(b);
  });

  let result = array[0];
  let cont = false;
  let dash = false;
  for (let i = 0; i < array.length; i++) {
    const current = parseInt(array[i]);
    if (isNaN(current)) {
      return array.toString();
    }
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

/**
 * @public
 * @static
 * This will trim the string if exist.
 *
 * @param obj anything that can trim
 *
 * @return trim string or empty string if trim not available
 */
export const TrimString = (obj: any | undefined | null) => {
  if (!CheckIsExist(obj)) {
    return "";
  }
  const str: string = obj.toString();
  if (str) {
    return str.trim();
  }
  return "";
};

/**
 * @public
 * @static
 * indicate whether input is boolean or not.
 * Don't be confused, this method will return true whether input is "true or false"
 *
 * @param obj checking value
 *
 * @return true if input value is boolean or string that indicate boolean
 */
export const CheckIsBoolean = (obj: any) => {
  if (!CheckIsExist(obj)) {
    return false;
  }
  return obj === "true" || obj === true || obj === "false" || obj === false;
};

export const CheckIsDate = (obj: any) => {
  if (!CheckIsExist(obj)) return false;
  return isDate(obj) || isMoment(obj);
};

/**
 * @public
 * @static
 * Since input datetime will be shortest path of Buddhist era (e.g. 60, 61)
 * We need to format to the right year by subtract 43 years.
 *
 * @param value input date string
 * @param format format of the date
 *
 * @return Moment of value date
 */
export const FormatMomentDateTime = (value: string, format: string) => {
  moment.locale("th");
  return moment(value, format).subtract(43, "year");
};

/**
 * @public
 * @static
 * Make Moment date to timestamp string
 *
 * @param date Moment datetime
 * @return timestamp or undefined
 */
export const Timestamp = (date: moment.Moment | undefined) => {
  return date && date.format("X");
};

/**
 * @public
 * @static
 * Make timestamp string to Moment date
 *
 * @param date Timestamp
 *
 * @return Moment date
 * @throws Moment exception if input date isn't timestamp
 */
export const RevertTimestamp = (date: string | undefined) => {
  return moment(date, "X");
};
