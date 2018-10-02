/**
 * @internal
 * @module nd.apis
 */

import { URL } from "url";
import { DEFAULT_NOVEL_LINK, DEFAULT_FILE_TEMPLATE } from "../constants/novel.const";
import { PARAM_WRONG_ERR } from "../constants/error.const";
import { format } from "util";

export const GetNID = (str: string) => {
  try {
    let link = PassLink(str);
    if (link.searchParams.has("id")) return link.searchParams.get("id") || "";
  } catch (e) {
    if (IsID(str)) return str;
  }
  throw PARAM_WRONG_ERR.clone().loadString("input is not either link or id");
};

export const GetChapter = (str: string) => {
  try {
    let link = PassLink(str);
    return link.searchParams.get("chapter") || "0";
  } catch (e) {
    if (IsID(str)) return str;
  }
  throw PARAM_WRONG_ERR.clone().loadString("input is not either link or id");
};

export const IsID = (str: string) => {
  return /^\d+$/.test(str);
};

export const GetLink = (id: string) => {
  if (IsID(id)) {
    let link = PassLink(DEFAULT_NOVEL_LINK);
    link.searchParams.set("id", id);
    return link;
  }
  return;
};

export const GetLinkWithChapter = (id: string, chapter: string | undefined) => {
  if (IsID(id)) {
    if (!chapter || chapter === "0") {
      return GetLink(id);
    }

    let link = PassLink(DEFAULT_NOVEL_LINK.replace("view", "viewlongc"));
    link.searchParams.set("id", id);
    link.searchParams.set("chapter", chapter);
    return link;
  }
  return;
};

export const PassLink = (str: string) => {
  return new URL(str);
};

export const GetChapterFile = (chapter: string) => {
  return `${format(DEFAULT_FILE_TEMPLATE, chapter)}`;
};
