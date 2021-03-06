/**
 * @external
 * @module public.api
 */

import dns from "dns";
import { existsSync, readdirSync, statSync } from "fs";
import { promisify } from "util";

import moment, { isDate, isMoment } from "moment";
import "moment/locale/th";
import { join } from "path";

import { NETWORK_FAIL_ERR } from "../constants/error.const";
import { ND } from "../constants/nd.const";
import { DEFAULT_RESOURCE_NAME } from "../constants/novel.const";
import { GetLatestVersion } from "../models/release";

const resolver = promisify(dns.lookupService);

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
export const CheckIsExist = (value: any) => {
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
export const CheckIsNumber = (value: any) => {
  if (!CheckIsExist(value) || !value) {
    return false;
  }
  if (!value.toString) return false;
  return value.toString().match(/^\d+$/) !== null;
};

export const CheckIsEmail = (value: any) => {
  if (!CheckIsExist(value)) {
    return false;
  }
  if (!value.toString) return false;
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
  if (!pathname.toString) return false;
  const exist = existsSync(pathname.toString());
  return exist;
};

export const CheckIsNovelPath = (pathname: any) => {
  if (!CheckIsPathExist(pathname)) return false;
  const path = join(pathname, DEFAULT_RESOURCE_NAME);
  return existsSync(path);
};

export const CheckIsLatestVersion = () => {
  return IsConnectionEstablished()
    .then(() => {
      return GetLatestVersion().then(v => {
        return Promise.resolve({
          isLatest: v.version === ND.VERSION,
          ...v,
        });
      });
    })
    .catch(e => {
      throw NETWORK_FAIL_ERR.loadString(e).printAndExit();
    });
};

/**
 * @public
 * @static
 * This will change array of number to length of number if possible.
 *
 * @param array input array of number, where number can be inform of string
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

export const WalkDirSync = (dir: string, max?: number): string[] => {
  if (max === 0) return [];
  return readdirSync(dir).reduce((files: string[], file: string) => {
    if (statSync(join(dir, file)).isDirectory()) {
      files.push(join(dir, file), ...WalkDirSync(join(dir, file), max ? max - 1 : undefined));
    }
    return files;
  }, []);
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

export const FormatFileSize = (bytes: number, si?: boolean) => {
  const thresh = si ? 1000 : 1024;
  if (Math.abs(bytes) < thresh) {
    return bytes + " B";
  }
  const units = si
    ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
  let u = -1;
  do {
    bytes /= thresh;
    ++u;
  } while (Math.abs(bytes) >= thresh && u < units.length - 1);
  return bytes.toFixed(1) + " " + units[u];
};

export const IsConnectionEstablished = () => {
  return resolver("8.8.8.8", 53);
};
