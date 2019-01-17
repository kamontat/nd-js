/**
 * @internal
 * @module output.logger.constant
 */

import chalk from "chalk";
import { URL } from "url";
import { inspect } from "util";

import {
  isSameDate,
  TransferAsDate,
  TransferAsDateTime,
  TransferReadableList,
} from "../helpers/color";
import {
  CheckIsBoolean,
  CheckIsDate,
  CheckIsEmail,
  CheckIsExist,
  CheckIsNumber,
  CheckIsPathExist,
} from "../helpers/helper";
import { ColorType } from "../models/output/Color";

import { HAS_COLOR } from "./default.const";

export const TITLE_COLOR = chalk.cyanBright;

export const TOKEN_COLOR = chalk.blue.underline;
export const NAME_COLOR = chalk.greenBright;
export const EMAIL_COLOR = chalk.blueBright;

export const CHAPTER_NAME_COLOR = chalk.magentaBright;
export const NUMBER_COLOR = chalk.yellow;
export const CHAPTER_NUMBER_COLOR = chalk.magentaBright;
export const CHAPTER_NUMBERS_COLOR = chalk.magenta;

export const DATE_COLOR = chalk.blue;
export const DATE_TODAY_COLOR = chalk.blueBright.underline.bold;

export const LOCATION_COLOR = chalk.cyan;
export const LINK_COLOR = chalk.blueBright;

export const BOOLEAN_TRUE_COLOR = chalk.greenBright;
export const BOOLEAN_FALSE_COLOR = chalk.redBright;

export const IMPORTANT_COLOR = chalk.red;
export const HIGHLY_IMPORTANT_COLOR = chalk.red.bold.underline;

export const STRING_COLOR = chalk.reset;
export const UNDEFINED_COLOR = chalk.reset;

export const OPTION_COLOR = chalk.blueBright; // cmd --option
export const PRIMARY_ARGUMENT_COLOR = chalk.greenBright; // cmd primary-argument
export const ARGUMENT_COLOR = chalk.green; // cmd prim-arg ...argument

export const PARAMETER_COLOR = chalk.cyanBright; // cmd -p <parameter>

export const DIM_COLOR = chalk.gray.dim;

export const COLORS = {
  Title: new ColorType({
    name: "Title",
    color: TITLE_COLOR,
  }),
  Token: new ColorType({
    name: "Token",
    color: TOKEN_COLOR,
  }),
  Name: new ColorType({
    name: "Name",
    color: NAME_COLOR,
  }),
  Email: new ColorType({
    name: "Email",
    color: EMAIL_COLOR,
    validator: CheckIsEmail,
  }),
  ChapterName: new ColorType({
    name: "Chapter name",
    color: CHAPTER_NAME_COLOR,
  }),
  ChapterNumber: new ColorType({
    name: "Chapter number",
    color: CHAPTER_NUMBER_COLOR,
  }),
  ChapterList: new ColorType({
    name: "Chapter list",
    color: CHAPTER_NUMBERS_COLOR,
    validator: obj => obj instanceof Array,
    transform: TransferReadableList,
  }),
  Date: new ColorType({
    name: "Date",
    color: DATE_COLOR,
    validator: CheckIsDate,
    transform: TransferAsDate,
    alterColor: DATE_TODAY_COLOR,
    whenUseAlter: isSameDate,
  }),
  DateTime: new ColorType({
    name: "Datetime",
    validator: CheckIsDate,
    color: DATE_COLOR,
    transform: TransferAsDateTime,
    alterColor: DATE_TODAY_COLOR,
    whenUseAlter: isSameDate,
  }),
  Location: new ColorType({
    name: "Location",
    color: LOCATION_COLOR,
    validator: CheckIsPathExist,
  }),
  Link: new ColorType({
    name: "Link",
    color: LINK_COLOR,
    validator: obj => obj instanceof URL,
  }),
  Boolean: new ColorType({
    name: "Boolean",
    color: BOOLEAN_TRUE_COLOR,
    validator: obj => CheckIsBoolean(obj),
    alterColor: BOOLEAN_FALSE_COLOR,
    whenUseAlter: v => v === false,
  }),
  Number: new ColorType({
    name: "Number",
    color: NUMBER_COLOR,
    validator: CheckIsNumber,
  }),
  Object: new ColorType({
    name: "Object",
    color: STRING_COLOR,
    transform: v => inspect(v, false, 1, HAS_COLOR),
    validator: v => v instanceof Object,
  }),
  String: new ColorType({
    name: "String",
    color: STRING_COLOR,
  }),
  Undefined: new ColorType({
    name: "Undefined",
    color: UNDEFINED_COLOR,
    validator: obj => !CheckIsExist(obj),
  }),
  HighImportant: new ColorType({
    name: "HighlyImportant",
    color: HIGHLY_IMPORTANT_COLOR,
  }),
  Important: new ColorType({
    name: "Important",
    color: IMPORTANT_COLOR,
  }),
  Option: new ColorType({
    name: "Option",
    color: OPTION_COLOR,
  }),
  Argument: new ColorType({
    name: "Argument",
    color: ARGUMENT_COLOR,
  }),
  Dim: new ColorType({
    name: "Dim",
    color: DIM_COLOR,
  }),
};
