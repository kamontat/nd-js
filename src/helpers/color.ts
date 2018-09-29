import {
  CONST_DEFAULT_NUMBER_COLOR,
  CONST_DEFAULT_DATE_COLOR,
  CONST_DEFAULT_LOCATION_COLOR,
  CONST_DEFAULT_LINK_COLOR,
  CONST_DEFAULT_NAME_COLOR,
  CONST_DEFAULT_CHAPTER_NAME_COLOR,
  CONST_DEFAULT_CHAPTER_NUMBERS_COLOR,
  CONST_DEFAULT_CHAPTER_NUMBER_COLOR,
  CONST_DEFAULT_DATE_TODAY_COLOR
} from "../constants/color.const";
import { log } from "winston";

import { isMoment, Moment, locale } from "moment";
import "moment/locale/th";

import { URL } from "url";

import { WrapTitleMessage } from "../models/LoggerWrapper";
import { resolve } from "path";
import { isDate } from "util";
import moment = require("moment");

export type ColorType =
  | "undefined" // [auto detect] if input is undefined
  | "number" // [auto detect] when contain only 0-9
  | "date" // [auto detect] when object is Moment date or Date interface
  | "location" // [auto detect] by try to resolve path
  | "string" // default
  | "link" // [auto detect] when object is url
  | "name"
  | "chapter_name"
  | "chapter_numbers" // [auto detect] when object is array
  | "chapter_number";

export const API_TRANSFORM_MESSAGE = (message: any, custom?: ColorType): { type: ColorType; message: string } => {
  if (custom) {
    return { type: custom, message: message };
  }
  if (!message) {
    return { type: "undefined", message: "undefined" };
  }
  // TODO: implement this
  if (isMoment(message)) {
    return { type: "date", message: (<Moment>message).calendar() };
  } else if (isDate(message)) {
    return { type: "date", message: moment(<Date>message).calendar() };
  } else if (message instanceof URL) {
    return { type: "link", message: message && message.toString() };
  } else if (message instanceof Array) {
    return { type: "chapter_numbers", message: message.toString() };
  } else if (resolve(message) !== "") {
    return { type: "location", message: message };
  } else if (message.toString().match(/^\d+$/)) {
    return { type: "number", message: message };
  } else {
    return { type: "string", message: message };
  }
};

export const API_ADD_COLOR = (message: any, custom?: ColorType) => {
  const action = API_TRANSFORM_MESSAGE(message, custom);
  log(WrapTitleMessage("debug", "color type", action.type));

  switch (action.type) {
    case "name":
      return CONST_DEFAULT_NAME_COLOR(action.message);
    case "chapter_name":
      return CONST_DEFAULT_CHAPTER_NAME_COLOR(action.message);
    case "chapter_number":
      return CONST_DEFAULT_CHAPTER_NUMBER_COLOR(action.message);
    case "chapter_numbers":
      return CONST_DEFAULT_CHAPTER_NUMBERS_COLOR(action.message);
    case "location":
      return CONST_DEFAULT_LOCATION_COLOR(action.message);
    case "link":
      return CONST_DEFAULT_LINK_COLOR(action.message);
    case "date":
      if (action.message.includes("วันนี้") || action.message.toLowerCase().includes("today"))
        return CONST_DEFAULT_DATE_TODAY_COLOR(action.message);
      else return CONST_DEFAULT_DATE_COLOR(action.message);
    case "number":
      return CONST_DEFAULT_NUMBER_COLOR(action.message);
    default:
      return action.message;
  }
};
