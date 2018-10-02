/**
 * @internal
 * @module nd.color
 */

import chalk from "chalk";
import { ColorType } from "../models/Color";
import moment, { isDate, isMoment, Moment } from "moment";
import { CheckIsNumber, CheckIsExist } from "../helpers/helper";
import { TransferAsDate, TransferNothing, TransferReadableList, noValidator } from "../helpers/color";

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

export const COLORS = {
  Title: new ColorType("title", noValidator, TITLE_COLOR, TransferNothing),
  Name: new ColorType("name", noValidator, NAME_COLOR, TransferNothing),
  ChapterName: new ColorType("chapter name", noValidator, CHAPTER_NAME_COLOR, TransferNothing),
  ChapterNumber: new ColorType("chapter number", noValidator, CHAPTER_NUMBER_COLOR, TransferNothing),
  ChapterList: new ColorType("chapter list", obj => obj instanceof Array, CHAPTER_NUMBERS_COLOR, TransferReadableList),
  Date: new ColorType(
    "date",
    obj => isMoment(obj) || isDate(obj),
    DATE_COLOR,
    TransferAsDate,
    DATE_TODAY_COLOR,
    (v: Moment) => v.isSame(moment(), "day")
  ),
  Location: new ColorType("location", noValidator, LOCATION_COLOR, TransferNothing),
  Link: new ColorType("link", obj => obj instanceof URL, LINK_COLOR, TransferNothing),
  Number: new ColorType("number", obj => CheckIsNumber(obj.toString()), NUMBER_COLOR, TransferNothing),
  String: new ColorType("string", noValidator, STRING_COLOR, TransferNothing),
  Undefined: new ColorType("undefined", obj => !CheckIsExist(obj), UNDEFINED_COLOR, TransferNothing)
};
