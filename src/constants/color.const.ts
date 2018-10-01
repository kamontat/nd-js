import chalk from "chalk";
import { ColorType } from "../models/Color";
import moment, { isDate, isMoment, Moment } from "moment";
import { MakeReadableNumberArray, CheckIsNumber, CheckIsExist } from "../helpers/helper";

const TransferNothing = (v: any) => v;
const TransferAsDate = (v: any) => {
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
const TransferReadableList = (v: Array<any>) => {
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

export const CONST_DEFAULT_COLORS = {
  Title: new ColorType("title", () => false, TITLE_COLOR, TransferNothing),
  Name: new ColorType("name", () => false, NAME_COLOR, TransferNothing),
  ChapterName: new ColorType("chapter name", () => false, CHAPTER_NAME_COLOR, TransferNothing),
  ChapterNumber: new ColorType("chapter number", () => false, CHAPTER_NUMBER_COLOR, TransferNothing),
  ChapterList: new ColorType("chapter list", obj => obj instanceof Array, CHAPTER_NUMBERS_COLOR, TransferReadableList),
  Date: new ColorType(
    "date",
    obj => isMoment(obj) || isDate(obj),
    DATE_COLOR,
    TransferAsDate,
    DATE_TODAY_COLOR,
    (v: Moment) => v.isSame(moment(), "day")
  ),
  Location: new ColorType("location", () => false, LOCATION_COLOR, TransferNothing),
  Link: new ColorType("link", obj => obj instanceof URL, LINK_COLOR, TransferNothing),
  Number: new ColorType("number", obj => CheckIsNumber(obj.toString()), NUMBER_COLOR, TransferNothing),
  String: new ColorType("string", () => false, STRING_COLOR, TransferNothing),
  Undefined: new ColorType("undefined", obj => !CheckIsExist(obj), UNDEFINED_COLOR, TransferNothing)
};
