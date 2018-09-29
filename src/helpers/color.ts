import {
  CONST_DEFAULT_NUMBER_COLOR,
  CONST_DEFAULT_DATE_COLOR,
  CONST_DEFAULT_LOCATION_COLOR,
  CONST_DEFAULT_LINK_COLOR,
  CONST_DEFAULT_NAME_COLOR,
  CONST_DEFAULT_CHAPTER_NAME_COLOR
} from "../constants/color.const";
import { log } from "winston";

import { isMoment, Moment, locale } from "moment";
import "moment/locale/th";

import { URL } from "url";

import { WrapTitleMessage } from "../models/LoggerWrapper";

export type ColorType = "number" | "chapter" | "date" | "location" | "string" | "link" | "name" | "chapter_name";

export const defineColorType = (message: any): ColorType => {
  // TODO: implement this
  if (message.toString().match(/^\d+$/)) {
    return "number";
  } else if (isMoment(message)) {
    return "date";
  } else if (message instanceof URL) {
    return "link";
  } else {
    return "string";
  }
};

export const API_ADD_COLOR = (message: any, custom?: ColorType) => {
  if (!custom) {
    custom = defineColorType(message);
  }

  log(WrapTitleMessage("debug", "color type", custom));
  switch (custom) {
    case "chapter":
      return CONST_DEFAULT_NUMBER_COLOR(message);
    case "number":
      return CONST_DEFAULT_NUMBER_COLOR(message);
    case "date":
      locale("th");
      return CONST_DEFAULT_DATE_COLOR((<Moment>message).calendar().toString());
    case "location":
      return CONST_DEFAULT_LOCATION_COLOR(message);
    case "link":
      return CONST_DEFAULT_LINK_COLOR(message);
    case "name":
      return CONST_DEFAULT_NAME_COLOR(message);
    case "chapter_name":
      return CONST_DEFAULT_CHAPTER_NAME_COLOR(message);
    default:
      return message;
  }
};
