import { DEFAULT_NUMBER_COLOR, DEFAULT_DATE_COLOR, DEFAULT_LOCATION_COLOR } from "../constants/color.const";

export type ColorType = "number" | "chapter" | "date" | "location" | "";

export const API_DEFINE_COLOR_TYPE = (message: any): ColorType => {
  // TODO: implement this
  return "number";
};

export const API_ADD_COLOR_BY_TYPE = (message: any, custom: ColorType) => {
  if (!custom) {
    custom = API_DEFINE_COLOR_TYPE(message);
  }

  switch (custom) {
    case "chapter":
      return DEFAULT_NUMBER_COLOR(message);
    case "number":
      return DEFAULT_NUMBER_COLOR(message);
    case "date":
      return DEFAULT_DATE_COLOR(message);
    case "location":
      return DEFAULT_LOCATION_COLOR(message);
    default:
      return message;
  }
};
