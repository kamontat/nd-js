/**
 * @internal
 * @module nd.color
 */

import moment, { isMoment, isDate, Moment } from "moment";
import { CheckIsNumber, MakeReadableNumberArray } from "./helper";

/************************/
/*       Transfer       */
/************************/

export const TransferNothing = (v: any) => v;
export const TransferAsDate = (v: any) => {
  const settings = {
    sameDay: "[วันนี้]",
    lastDay: "[เมื่อวาน]",
    lastWeek: "[วัน]dddd[ที่แล้ว]",
    sameElse: "DD/MM/YYYY"
  };
  if (isMoment(v)) return (<Moment>v).calendar(undefined, settings) || "";
  else if (isDate(v)) return moment(<Date>v).calendar(undefined, settings) || "";
  return v;
};
export const TransferReadableList = (v: Array<any>) => {
  if (v.every(v => CheckIsNumber(v) !== null)) {
    return MakeReadableNumberArray(v);
  }
  return v.toString();
};

/************************/
/*       Validate       */
/************************/

export const noValidator = () => false;
