import chalk from "chalk";
import { ColorType } from "../models/Color";
import { isMoment, Moment } from "moment";
import { isDate } from "util";
import moment = require("moment");
import { MakeReadableNumberArray, CheckIsNumber } from "../helpers/helper";

const defaultTransformMethod = (v: any) => v;
const dateTransformMethod = (v: any) => {
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

const listTransformMethod = (v: Array<any>) => {
  if (v.every(v => CheckIsNumber(v) !== null)) {
    return MakeReadableNumberArray(v);
  }
  return v.toString();
};

export const TITLE_COLOR = chalk.green;
export const NAME_COLOR = chalk.red.underline;
export const CHAPTER_NAME_COLOR = chalk.redBright;
export const NUMBER_COLOR = chalk.yellow;
export const CHAPTER_NUMBER_COLOR = chalk.magentaBright;
export const CHAPTER_NUMBERS_COLOR = chalk.magenta;

export const DATE_COLOR = chalk.blue;
export const DATE_TODAY_COLOR = chalk.blueBright.underline.bold;

export const LOCATION_COLOR = chalk.cyan;
export const LINK_COLOR = chalk.blueBright;

export const STRING_COLOR = chalk.reset;
export const UNDEFINED_COLOR = chalk.reset;

export type ColorHeader =
  | "Title"
  | "Name"
  | "ChapterName"
  | "ChapterNumber"
  | "ChapterList"
  | "Date"
  | "Location"
  | "Link"
  | "Number"
  | "String"
  | "Undefined";

export const CONST_DEFAULT_COLORS = {
  Title: new ColorType("title", TITLE_COLOR, defaultTransformMethod),
  Name: new ColorType("name", NAME_COLOR, defaultTransformMethod),
  ChapterName: new ColorType("chapter name", CHAPTER_NAME_COLOR, defaultTransformMethod),
  ChapterNumber: new ColorType("chapter number", CHAPTER_NUMBER_COLOR, defaultTransformMethod),
  ChapterList: new ColorType("chapter list", CHAPTER_NUMBERS_COLOR, listTransformMethod),
  Date: new ColorType("date", DATE_COLOR, dateTransformMethod, DATE_TODAY_COLOR, (v: Moment) =>
    v.isSame(moment(), "day")
  ),
  Location: new ColorType("location", LOCATION_COLOR, defaultTransformMethod),
  Link: new ColorType("link", LINK_COLOR, defaultTransformMethod),
  Number: new ColorType("number", NUMBER_COLOR, defaultTransformMethod),
  String: new ColorType("string", STRING_COLOR, defaultTransformMethod),
  Undefined: new ColorType("undefined", UNDEFINED_COLOR, defaultTransformMethod)
};
