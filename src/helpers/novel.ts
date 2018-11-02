/**
 * @internal
 * @module nd.apis
 */

import { URL } from "url";
import { format } from "util";

import { PARAM_WRONG_ERR } from "../constants/error.const";
import { DEFAULT_CHAPTER_FILE_TEMPLATE, DEFAULT_NOVEL_LINK } from "../constants/novel.const";

export const GetNID = (str: string) => {
  try {
    const link = PassLink(str);
    if (link.searchParams.has("id")) { return link.searchParams.get("id") || ""; }
  } catch (e) {
    if (IsID(str)) { return str; }
  }
  throw PARAM_WRONG_ERR.clone().loadString("input is not either link or id");
};

export const GetChapterNumber = (link: string) => {
  try {
    const url = PassLink(link);
    return url.searchParams.get("chapter") || "0";
  } catch (e) {
    if (IsID(link)) { return link; }
  }
  throw PARAM_WRONG_ERR.clone().loadString("input is not either link or id");
};

export const IsID = (str: string) => {
  return /^\d+$/.test(str);
};

export const GetLink = (id: string) => {
  if (IsID(id)) {
    const link = PassLink(DEFAULT_NOVEL_LINK);
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

    const link = PassLink(DEFAULT_NOVEL_LINK.replace("view", "viewlongc"));
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
  return `${format(DEFAULT_CHAPTER_FILE_TEMPLATE, chapter)}`;
};
