import { URL } from "url";
import { NOVEL_LINK } from "../constants/novelConst";
import { WrongParameterError } from "../constants/errorConst";

export const GetNID = (str: string) => {
  try {
    let link = PassLink(str);
    if (link.searchParams.has("id")) return link.searchParams.get("id") || "";
  } catch (e) {
    if (IsID(str)) return str;
  }
  throw WrongParameterError.clone().loadString("input is not either link or id");
};

export const IsID = (str: string) => {
  return /^\d+$/.test(str);
};

export const GetLink = (id: string) => {
  if (IsID(id)) {
    let link = PassLink(NOVEL_LINK);
    link.searchParams.set("id", id);
    return link;
  }
  return;
};

export const GetLinkWithChapter = (id: string, chapter: string) => {
  if (IsID(id)) {
    let link = PassLink(NOVEL_LINK.replace("view", "viewlongc"));
    link.searchParams.set("id", id);
    link.searchParams.set("chapter", chapter);
    return link;
  }
  return;
};

export const PassLink = (str: string) => {
  return new URL(str);
};
