/**
 * @internal
 * @module output.logger.api
 */

import moment, { isDate, isMoment, Moment } from "moment";

import { CheckIsNumber, MakeReadableNumberArray } from "./helper";

/************************/
/*       Transfer       */
/************************/

export const noTransform = (v: any) => v;
export const TransferAsDate = (v: any) => {
  const settings = {
    sameDay: "[วันนี้]",
    lastDay: "[เมื่อวาน]",
    lastWeek: "[วัน]dddd[ที่แล้ว]",
    sameElse: "DD/MM/YYYY",
  };
  if (isMoment(v)) {
    return (v as Moment).calendar(undefined, settings) || "";
  } else if (isDate(v)) {
    return moment(v as Date).calendar(undefined, settings) || "";
  }
  return v;
};
export const TransferAsDateTime = (v: any) => {
  const settings = {
    sameDay: "[วันนี้] ตอน HH:mm:ss",
    lastDay: "[เมื่อวาน] ตอน HH:mm:ss",
    lastWeek: "[วัน]dddd[ที่แล้ว] ตอน HH:mm:ss",
    sameElse: "DD/MM/YYYY HH:mm:ss",
  };
  if (isMoment(v)) {
    return (v as Moment).calendar(undefined, settings) || "";
  } else if (isDate(v)) {
    return moment(v as Date).calendar(undefined, settings) || "";
  }
  return v;
};
export const TransferReadableList = (array: any[]) => {
  if (array.every(v => CheckIsNumber(v) !== null)) {
    return MakeReadableNumberArray(array);
  }
  return array.toString();
};

/************************/
/*       Validate       */
/************************/

export const noValidator = () => false;

/************************/
/*      Alternative     */
/************************/

export const isSameDate = (date?: Moment) => {
  if (!date) return false;
  if (!date.isSame) return false;
  return date.isSame(moment(), "day");
};
